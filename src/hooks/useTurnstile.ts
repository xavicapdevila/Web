"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile invisible para formularios públicos.
 *
 * Uso:
 *   const turnstile = useTurnstile();
 *   ...
 *   <div ref={turnstile.containerRef} />              // no ocupa espacio (widget invisible)
 *   const token = await turnstile.getToken();          // en el submit
 *
 * Si NEXT_PUBLIC_TURNSTILE_SITE_KEY no está configurada, getToken() devuelve
 * null al instante y el formulario funciona igual que antes (feature apagada).
 * El widget debe crearse en Cloudflare como tipo «invisible» para que nunca
 * muestre UI.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TOKEN_TIMEOUT_MS = 12_000;

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        scriptPromise = null; // permitir reintento en el siguiente submit
        reject(new Error("turnstile script failed"));
      };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

export function useTurnstile() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const resolverRef = useRef<((token: string | null) => void) | null>(null);

  useEffect(() => {
    // Limpieza al desmontar el formulario.
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }
    };
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!SITE_KEY) return null; // feature apagada

    try {
      await loadScript();
      const turnstile = window.turnstile;
      const container = containerRef.current;
      if (!turnstile || !container) return null;

      const tokenPromise = new Promise<string | null>((resolve) => {
        resolverRef.current = resolve;
      });

      if (widgetIdRef.current) {
        // Segundo submit (p. ej. tras un error de red): token nuevo.
        turnstile.reset(widgetIdRef.current);
        turnstile.execute(widgetIdRef.current);
      } else {
        widgetIdRef.current = turnstile.render(container, {
          sitekey: SITE_KEY,
          execution: "execute",
          callback: (token: string) => resolverRef.current?.(token),
          "error-callback": () => resolverRef.current?.(null),
          "timeout-callback": () => resolverRef.current?.(null),
        });
        turnstile.execute(widgetIdRef.current);
      }

      // No colgar el submit si el desafío no responde.
      const timeout = new Promise<string | null>((resolve) =>
        setTimeout(() => resolve(null), TOKEN_TIMEOUT_MS),
      );
      return await Promise.race([tokenPromise, timeout]);
    } catch {
      // Script bloqueado o sin red hacia Cloudflare: enviamos sin token y el
      // servidor decide (con la clave activa lo rechazará; sin ella, pasa).
      return null;
    }
  }, []);

  return { containerRef, getToken };
}

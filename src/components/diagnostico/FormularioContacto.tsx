"use client";

/**
 * Formulario de captación: nombre, teléfono, correo y consentimientos.
 * Validación clara en castellano, errores bajo cada campo.
 */

import { useState } from "react";
import Link from "next/link";
import { useTurnstile } from "@/hooks/useTurnstile";
import type { DatosContacto } from "@/lib/diagnostico/tipos";
import { BotonPrimario } from "./ui";

interface Errores {
  nombre?: string;
  telefono?: string;
  email?: string;
  aceptaPrivacidad?: string;
  aceptaContacto?: string;
}

/** Iniciales en mayúscula: "maría font" → "María Font" */
function capitalizar(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (letra) => letra.toUpperCase());
}

function validar(datos: {
  nombre: string;
  telefono: string;
  email: string;
  aceptaPrivacidad: boolean;
  aceptaContacto: boolean;
}): Errores {
  const errores: Errores = {};
  if (datos.nombre.trim().length < 2) {
    errores.nombre = "Escribe tu nombre para saber con quién hablamos.";
  }
  const digitos = datos.telefono.replace(/\D/g, "");
  if (digitos.length < 9 || digitos.length > 15) {
    errores.telefono = "Revisa el teléfono: necesitamos al menos 9 dígitos.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(datos.email.trim())) {
    errores.email = "Revisa el correo electrónico: parece incompleto.";
  }
  if (!datos.aceptaPrivacidad) {
    errores.aceptaPrivacidad = "Necesitamos que aceptes la política de privacidad.";
  }
  if (!datos.aceptaContacto) {
    errores.aceptaContacto = "Marca el consentimiento para que podamos contactarte.";
  }
  return errores;
}

const CLASE_CAMPO =
  "w-full rounded-2xl border bg-white/[0.04] px-5 py-3.5 text-[16px] tracking-[-0.01em] text-[#EDF2EF] outline-none transition-colors placeholder:text-[#3d4a45] focus:border-[#34D399]/70";

export default function FormularioContacto({
  onEnviar,
}: {
  onEnviar: (datos: DatosContacto, turnstileToken: string | null) => void;
}) {
  const turnstile = useTurnstile();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [aceptaContacto, setAceptaContacto] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [intentado, setIntentado] = useState(false);

  function revalidar(parche: Partial<Parameters<typeof validar>[0]> = {}) {
    if (!intentado) return;
    setErrores(validar({ nombre, telefono, email, aceptaPrivacidad, aceptaContacto, ...parche }));
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setIntentado(true);
    const nuevos = validar({ nombre, telefono, email, aceptaPrivacidad, aceptaContacto });
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    // Captcha invisible (no-op y devuelve null hasta que Turnstile tenga claves)
    const turnstileToken = await turnstile.getToken();
    onEnviar(
      {
        nombre: capitalizar(nombre.trim()),
        telefono: telefono.trim(),
        email: email.trim().toLowerCase(),
        aceptaPrivacidad,
        aceptaContacto,
        quiereLlamada: false,
        franjaLlamada: null,
      },
      turnstileToken,
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <div ref={turnstile.containerRef} />
      <div>
        <label htmlFor="ct-nombre" className="mb-1.5 block text-[13px] font-medium text-[#8FA39B]">
          Nombre
        </label>
        <input
          id="ct-nombre"
          autoComplete="name"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            revalidar({ nombre: e.target.value });
          }}
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={errores.nombre ? "err-nombre" : undefined}
          className={`${CLASE_CAMPO} ${errores.nombre ? "border-[#FB7185]/70" : "border-white/[0.12]"}`}
          placeholder="Tu nombre"
        />
        {errores.nombre ? (
          <p id="err-nombre" className="mt-1.5 text-[13px] text-[#FB7185]">
            {errores.nombre}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ct-telefono" className="mb-1.5 block text-[13px] font-medium text-[#8FA39B]">
          Teléfono
        </label>
        <input
          id="ct-telefono"
          type="tel"
          autoComplete="tel"
          value={telefono}
          onChange={(e) => {
            setTelefono(e.target.value);
            revalidar({ telefono: e.target.value });
          }}
          aria-invalid={Boolean(errores.telefono)}
          aria-describedby={errores.telefono ? "err-telefono" : undefined}
          className={`${CLASE_CAMPO} ${errores.telefono ? "border-[#FB7185]/70" : "border-white/[0.12]"}`}
          placeholder="600 000 000"
        />
        {errores.telefono ? (
          <p id="err-telefono" className="mt-1.5 text-[13px] text-[#FB7185]">
            {errores.telefono}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ct-email" className="mb-1.5 block text-[13px] font-medium text-[#8FA39B]">
          Correo electrónico
        </label>
        <input
          id="ct-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            revalidar({ email: e.target.value });
          }}
          aria-invalid={Boolean(errores.email)}
          aria-describedby={errores.email ? "err-email" : undefined}
          className={`${CLASE_CAMPO} ${errores.email ? "border-[#FB7185]/70" : "border-white/[0.12]"}`}
          placeholder="tu@correo.com"
        />
        {errores.email ? (
          <p id="err-email" className="mt-1.5 text-[13px] text-[#FB7185]">
            {errores.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-3 pt-1">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={aceptaPrivacidad}
            onChange={(e) => {
              setAceptaPrivacidad(e.target.checked);
              revalidar({ aceptaPrivacidad: e.target.checked });
            }}
            aria-invalid={Boolean(errores.aceptaPrivacidad)}
            aria-describedby={errores.aceptaPrivacidad ? "err-privacidad" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#34D399]"
          />
          <span className="text-[13px] leading-relaxed text-[#8FA39B]">
            He leído y acepto la{" "}
            <Link
              href="/privacidad"
              target="_blank"
              className="underline underline-offset-2 transition-colors hover:text-[#EDF2EF]"
            >
              política de privacidad
            </Link>
            .
          </span>
        </label>
        {errores.aceptaPrivacidad ? (
          <p id="err-privacidad" className="text-[13px] text-[#FB7185]">
            {errores.aceptaPrivacidad}
          </p>
        ) : null}

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={aceptaContacto}
            onChange={(e) => {
              setAceptaContacto(e.target.checked);
              revalidar({ aceptaContacto: e.target.checked });
            }}
            aria-invalid={Boolean(errores.aceptaContacto)}
            aria-describedby={errores.aceptaContacto ? "err-contacto" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#34D399]"
          />
          <span className="text-[13px] leading-relaxed text-[#8FA39B]">
            Acepto que The Vila Home me contacte para revisar este diagnóstico — gratis y
            sin compromiso. Sin suscripciones ni cadenas de correos.
          </span>
        </label>
        {errores.aceptaContacto ? (
          <p id="err-contacto" className="text-[13px] text-[#FB7185]">
            {errores.aceptaContacto}
          </p>
        ) : null}
      </div>

      <div className="pt-2">
        <BotonPrimario type="submit">Quiero revisar mi diagnóstico con The Vila Home</BotonPrimario>
      </div>
    </form>
  );
}

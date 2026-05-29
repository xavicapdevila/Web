"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Root error boundary — catches any unhandled error in the app tree.
 * Next.js App Router renders this automatically when a page throws.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with your error tracking (e.g. Sentry) in production
    console.error("[GlobalError]", error?.digest, error?.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-[#C9B99A] font-body tracking-widest uppercase text-sm mb-6">
          Ha ocurrido un error
        </p>
        <h1 className="font-display text-3xl text-white mb-4">Algo ha ido mal</h1>
        <p className="text-[#666] text-sm mb-10 leading-relaxed">
          Nuestro equipo ha sido notificado. Por favor, inténtalo de nuevo o
          vuelve a la página de inicio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 bg-[#C9B99A] text-black font-body text-sm tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="px-8 py-3 border border-[#333] text-white font-body text-sm tracking-widest uppercase hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors"
          >
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

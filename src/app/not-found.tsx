import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe o ha sido movida.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#C9B99A]/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* 404 number */}
        <p className="font-display text-[10rem] lg:text-[14rem] leading-none text-[#C9B99A]/15 select-none font-light">
          404
        </p>

        {/* Divider line */}
        <div className="flex items-center gap-4 justify-center -mt-8 mb-10">
          <span className="h-px w-12 bg-[#C9B99A]/40" />
          <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
            Página no encontrada
          </span>
          <span className="h-px w-12 bg-[#C9B99A]/40" />
        </div>

        <h1 className="font-display text-3xl lg:text-4xl text-white font-light mb-4">
          Esta página no existe
        </h1>
        <p className="text-[#666] text-base max-w-sm mx-auto mb-10 leading-relaxed">
          La dirección que buscas ha cambiado, ha sido eliminada o nunca existió.
          Pero tenemos muchas propiedades esperándote.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-4 bg-[#C9B99A] text-black font-body text-sm tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            href="/propiedades"
            className="px-8 py-4 border border-[#C9B99A]/40 text-[#C9B99A] font-body text-sm tracking-widest uppercase hover:border-[#C9B99A] transition-colors"
          >
            Ver propiedades
          </Link>
        </div>
      </div>
    </div>
  );
}

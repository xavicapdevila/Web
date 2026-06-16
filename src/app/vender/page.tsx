import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Vender tu casa con The Vila Home | Valoración gratuita",
  description:
    "Vende tu casa sin perder el control del proceso: precio honesto, un único interlocutor de principio a fin y transparencia total. Solicita tu valoración gratuita sin compromiso.",
  alternates: { canonical: "https://www.thevilahome.com/vender" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.thevilahome.com/vender",
    siteName: "The Vila Home",
    title: "Vender tu casa con The Vila Home | Valoración gratuita",
    description:
      "Precio honesto, un único interlocutor y transparencia total. Solicita tu valoración gratuita sin compromiso.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "The Vila Home" }],
  },
};

/* ── Datos ─────────────────────────────────────────────────────────── */

const TRUST_PHRASES = [
  "Más de 200 propietarios asesorados",
  "Valoración gratuita sin compromiso",
  "Precio real de mercado, no estimaciones vacías",
  "Un interlocutor desde el inicio hasta el final",
  "Sin letra pequeña, sin comisiones ocultas",
];

const DIFFERENTIATORS: { icon: React.ReactNode; title: string; text: string }[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M7.5 3.75h6.69a2 2 0 0 1 1.42.59l4.55 4.55a2 2 0 0 1 0 2.82l-6.69 6.69a2 2 0 0 1-2.82 0l-4.55-4.55a2 2 0 0 1-.59-1.42V5.75a2 2 0 0 1 2-2Z" />
        <circle cx="9.5" cy="7.5" r="1.1" />
      </svg>
    ),
    title: "Precio honesto",
    text: "Te damos el valor real de mercado, con datos y comparables. Nunca un precio inflado solo para captar el encargo.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
      </svg>
    ),
    title: "Un agente, todo el proceso",
    text: "Un único interlocutor desde la valoración hasta la firma. Siempre sabes con quién hablas y quién lleva tu caso.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <rect x="7" y="11" width="3" height="5" rx="0.5" />
        <rect x="12.5" y="8" width="3" height="8" rx="0.5" />
        <rect x="18" y="13" width="0" height="3" />
      </svg>
    ),
    title: "Visibilidad real con reportes",
    text: "Sabes qué pasa con tu venta: visitas, interés y publicaciones. Te enviamos informes periódicos claros, sin tecnicismos.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2l1.2-1.8a1 1 0 0 1 .83-.45h6.94a1 1 0 0 1 .83.45L17.5 7h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z" />
        <circle cx="12" cy="12.5" r="3.2" />
      </svg>
    ),
    title: "Fotografía y marketing incluidos",
    text: "Reportaje profesional, plano y difusión en los portales y redes adecuados. Todo incluido, sin coste extra.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M6.5 3.5h7.6L18.5 8v12.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
        <path d="M13.5 3.6V8h4.4" />
        <path d="M8.5 12.5h7M8.5 16h5" />
      </svg>
    ),
    title: "Gestión legal y documental",
    text: "Nos ocupamos de la cédula, los certificados, las notas simples y toda la documentación. Tú no persigues papeles.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 11.5 8.5 6l3.5 3 2.5-2.5" />
        <path d="M11 13.5 8.5 11l-4 4a1.5 1.5 0 0 0 2.1 2.1l1.4-1.4" />
        <path d="M12 16.5l2.5 2.5a1.5 1.5 0 0 0 2.1-2.1l-2-2 1.4 1.4a1.5 1.5 0 0 0 2.1-2.1l-3.6-3.6" />
      </svg>
    ),
    title: "Negociación a tu lado",
    text: "Defendemos tu interés en cada oferta para cerrar en las mejores condiciones posibles, no solo lo más rápido.",
  },
];

const STEPS: { title: string; text: string }[] = [
  { title: "Valoración honesta", text: "Analizamos tu vivienda y el mercado para darte un precio realista, sin humo." },
  { title: "Preparación", text: "Ordenamos la documentación y ponemos a punto la casa para enseñarla bien." },
  { title: "Fotografía y marketing", text: "Reportaje profesional y una campaña pensada para el comprador adecuado." },
  { title: "Difusión y visitas", text: "Publicamos, filtramos interesados y gestionamos las visitas por ti." },
  { title: "Negociación", text: "Negociamos cada oferta a tu favor y te asesoramos en cada decisión." },
  { title: "Firma y entrega", text: "Te acompañamos en arras, notaría y entrega de llaves. Hasta el final." },
];

const HONESTY = [
  "Te decimos el precio real, aunque no sea el que esperabas oír.",
  "Si no somos la mejor opción para tu caso, te lo diremos.",
  "Sin comisiones ocultas ni cláusulas enterradas en la letra pequeña.",
];

const TESTIMONIALS: { quote: string; name: string; initials: string; tag: string }[] = [
  {
    quote: "Nos dijeron desde el primer día el precio real. Vendimos en seis semanas sin bajar de nuestras expectativas.",
    name: "Marta R.",
    initials: "MR",
    tag: "Vendió su piso en Vilanova",
  },
  {
    quote: "Lo que más valoro es que siempre hablé con la misma persona. Nada de call centers ni de explicar tu caso una y otra vez.",
    name: "Jordi & Anna",
    initials: "JA",
    tag: "Vendieron su casa en Cunit",
  },
  {
    quote: "Transparencia total con la documentación y en la negociación. Me sentí acompañada en todo momento hasta la firma.",
    name: "Carmen P.",
    initials: "CP",
    tag: "Vendió su ático en Cubelles",
  },
];

/* ── Helpers ───────────────────────────────────────────────────────── */

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#C9A24B]">
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5Z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#F4EFE4] border border-[#E4DAC6] text-[#917330] font-cormorant text-lg shrink-0">
      {initials}
    </div>
  );
}

const Check = () => (
  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#C9B99A] text-white shrink-0 mt-0.5">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M5 12.5l4 4 10-10" />
    </svg>
  </span>
);

function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`font-cormorant text-2xl leading-none tracking-tight ${dark ? "text-white" : "text-[#1A1A18]"}`}>
      The Vila <span className="text-[#917330]">Home</span>
    </span>
  );
}

/* ── Página ────────────────────────────────────────────────────────── */

export default function VenderPage() {
  return (
    <div className="font-dm-sans bg-white text-[#1A1A18] min-h-screen antialiased selection:bg-[#C9B99A]/30">
      {/* ── Nav sticky ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#EAE4D9]">
        <nav className="max-w-6xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <Link href="/" aria-label="The Vila Home — inicio">
            <Wordmark />
          </Link>
          <Link
            href="/valoracion"
            className="rounded-full bg-[#1A1A18] text-white text-[13px] font-medium px-5 py-2.5 hover:bg-black transition-colors duration-300"
          >
            Solicitar valoración gratuita
          </Link>
        </nav>
      </header>

      {/* ── Trust bar (scroll automático) ──────────────────────────── */}
      <div className="bg-[#1A1A18] overflow-hidden">
        <div
          className="relative py-3"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <div
            className="flex items-center w-max hover:[animation-play-state:paused]"
            style={{ animation: "marquee-scroll 38s linear infinite" }}
          >
            {[...TRUST_PHRASES, ...TRUST_PHRASES].map((phrase, i) => (
              <span key={i} className="flex items-center text-[13px] tracking-wide text-[#E8E2D5]/85 whitespace-nowrap">
                {phrase}
                <span className="mx-7 w-1.5 h-1.5 rounded-full bg-[#C9B99A]" aria-hidden />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          {/* Izquierda */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#917330] text-left">
              Vender con The Vila Home
            </p>
            <h1 className="font-dm-serif text-[2.6rem] sm:text-5xl lg:text-[3.6rem] leading-[1.05] mt-5 text-[#1A1A18]">
              Vender tu casa sin perder el control del proceso
            </h1>
            <p className="font-dm-sans font-light text-lg leading-relaxed text-[#5A564E] mt-6 max-w-xl text-left">
              Te acompañamos de principio a fin con un precio honesto, un único interlocutor y
              transparencia total. Sin sorpresas y sin letra pequeña.
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4 mt-9">
              <Link
                href="/valoracion"
                className="rounded-full bg-[#1A1A18] text-white text-sm font-medium px-7 py-3.5 hover:bg-black transition-colors duration-300"
              >
                Solicitar valoración gratuita
              </Link>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#1A1A18] underline underline-offset-4 decoration-[#C9B99A] hover:decoration-[#1A1A18] transition-colors"
              >
                Hablar con un asesor
              </a>
            </div>
          </div>

          {/* Derecha — card */}
          <div className="bg-white border border-[#EAE4D9] rounded-2xl shadow-[0_24px_60px_-30px_rgba(26,26,24,0.25)] p-8 sm:p-10">
            <p className="font-cormorant text-[5.5rem] leading-none text-[#1A1A18]">94%</p>
            <p className="text-[#5A564E] leading-relaxed mt-3 text-left">
              de nuestros encargos se venden al precio acordado con el propietario.
            </p>

            <div className="grid grid-cols-2 gap-px bg-[#EAE4D9] border border-[#EAE4D9] rounded-xl overflow-hidden mt-8">
              <div className="bg-white p-5">
                <p className="font-cormorant text-4xl text-[#1A1A18] leading-none">62 días</p>
                <p className="text-xs tracking-wide text-[#8A8578] mt-2 text-left">Tiempo medio de venta</p>
              </div>
              <div className="bg-white p-5">
                <p className="font-cormorant text-4xl text-[#1A1A18] leading-none">{siteConfig.propiedadesVendidas}</p>
                <p className="text-xs tracking-wide text-[#8A8578] mt-2 text-left">Propietarios asesorados</p>
              </div>
            </div>

            <div className="flex items-start gap-4 mt-8 pt-7 border-t border-[#EAE4D9]">
              <Avatar initials="MR" />
              <div>
                <Stars />
                <p className="font-cormorant italic text-lg text-[#3A382F] leading-snug mt-2 text-left">
                  “Vendimos en menos de dos meses y al precio que nos prometieron. Cero sorpresas.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Diferenciadores ────────────────────────────────────────── */}
      <section className="bg-white border-y border-[#EAE4D9]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#917330] text-left">
              Por qué con nosotros
            </p>
            <h2 className="font-dm-serif text-4xl lg:text-[2.75rem] leading-tight mt-4 text-[#1A1A18]">
              Lo que cambia cuando vendes con The Vila Home
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EAE4D9] border border-[#EAE4D9] rounded-2xl overflow-hidden mt-12">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.title} className="bg-white p-8 lg:p-9">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#F4EFE4] text-[#917330]">
                  {d.icon}
                </div>
                <h3 className="font-dm-serif text-[1.4rem] leading-snug mt-6 text-[#1A1A18]">{d.title}</h3>
                <p className="text-[15px] leading-relaxed text-[#6B6760] mt-3 text-left">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proceso ────────────────────────────────────────────────── */}
      <section className="bg-[#F7F3EE]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#917330] text-left">
              El proceso
            </p>
            <h2 className="font-dm-serif text-4xl lg:text-[2.75rem] leading-tight mt-4 text-[#1A1A18]">
              Seis pasos, un mismo interlocutor
            </h2>
          </div>

          <div className="relative mt-16">
            {/* Línea horizontal dorada (solo desktop) */}
            <div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-[#D8C9A8]" aria-hidden />
            <ol className="grid gap-y-12 sm:grid-cols-2 lg:grid-cols-6 lg:gap-x-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="relative">
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border border-[#C9B99A] bg-[#F7F3EE] text-[#917330] font-cormorant text-2xl">
                    {i + 1}
                  </div>
                  <h3 className="font-dm-serif text-xl mt-5 text-[#1A1A18]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#6B6760] mt-2 text-left">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Honestidad ─────────────────────────────────────────────── */}
      <section className="bg-[#FBF8F3]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <blockquote className="border-l-2 border-[#C9B99A] pl-7 lg:pl-9">
              <p className="font-cormorant italic text-3xl sm:text-[2.4rem] leading-snug text-[#2A2820] text-left">
                Preferimos perder un encargo antes que prometerte algo que no podemos cumplir.
              </p>
            </blockquote>

            <ul className="space-y-7">
              {HONESTY.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <Check />
                  <p className="text-lg leading-relaxed text-[#3A382F] text-left">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Testimonios ────────────────────────────────────────────── */}
      <section className="bg-white border-y border-[#EAE4D9]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#917330] text-left">
              Lo que dicen los propietarios
            </p>
            <h2 className="font-dm-serif text-4xl lg:text-[2.75rem] leading-tight mt-4 text-[#1A1A18]">
              Vendidas con tranquilidad
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex flex-col bg-white border border-[#EAE4D9] rounded-2xl p-8">
                <Stars />
                <blockquote className="font-cormorant italic text-[1.3rem] leading-snug text-[#2A2820] mt-5 flex-1 text-left">
                  “{t.quote}”
                </blockquote>
                <hr className="border-t border-[#EAE4D9] my-6" />
                <figcaption className="flex items-center gap-3">
                  <Avatar initials={t.initials} />
                  <div>
                    <p className="font-medium text-[#1A1A18] leading-tight">{t.name}</p>
                    <p className="text-xs text-[#8A8578] mt-0.5">{t.tag}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ──────────────────────────────────────────────── */}
      <section className="relative bg-[#1A1A18] overflow-hidden">
        {/* Círculos decorativos */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-[#C9B99A]/20" aria-hidden />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full border border-[#C9B99A]/15" aria-hidden />

        <div className="relative max-w-3xl mx-auto px-6 lg:px-10 py-24 lg:py-28 text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#C9B99A]">
            Valoración gratuita
          </p>
          <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] text-white mt-5">
            ¿Cuánto vale tu propiedad <span className="italic text-[#C9B99A]">hoy</span>?
          </h2>
          <p className="font-light text-lg text-[#C8C3B8] leading-relaxed mt-6 max-w-xl mx-auto text-center">
            Pídenos una valoración honesta y sin compromiso. Te diremos el precio real de mercado y
            cómo lo conseguiríamos, sin promesas que no podamos cumplir.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link
              href="/valoracion"
              className="rounded-full bg-[#C9B99A] text-[#1A1A18] text-sm font-semibold px-8 py-3.5 hover:bg-[#DDD0BB] transition-colors duration-300"
            >
              Solicitar valoración gratuita
            </Link>
            <a
              href={`tel:${siteConfig.phone}`}
              className="rounded-full border border-white/25 text-white text-sm font-medium px-8 py-3.5 hover:border-white/60 hover:bg-white/5 transition-colors duration-300"
            >
              Llámanos: {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#EAE4D9]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" aria-label="The Vila Home — inicio">
              <Wordmark />
            </Link>
            <nav className="flex items-center gap-7 text-sm text-[#6B6760]">
              <Link href="/aviso-legal" className="hover:text-[#1A1A18] transition-colors">Aviso legal</Link>
              <Link href="/privacidad" className="hover:text-[#1A1A18] transition-colors">Privacidad</Link>
              <Link href="/cookies" className="hover:text-[#1A1A18] transition-colors">Cookies</Link>
            </nav>
          </div>
          <p className="text-xs text-[#A8A294] mt-8 text-center md:text-left">
            © {new Date().getFullYear()} The Vila Home · {siteConfig.empresa} · NIF {siteConfig.nif}
          </p>
        </div>
      </footer>
    </div>
  );
}

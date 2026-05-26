import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Aviso legal de The Vila Home · Projectes Immobiliaris Costa Daurada SL.",
  robots: { index: false },
};

export default function AvisoLegalPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-10 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">Legal</span>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl text-white font-light mb-4">Aviso Legal</h1>
          <p className="text-[#666] text-sm">Última actualización: mayo 2026</p>
        </div>

        <div className="space-y-10 text-[#aaa] text-sm leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">1. Datos identificativos del titular</h2>
            <p>
              En cumplimiento de lo dispuesto en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
              Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa al usuario de los datos del
              titular del sitio web:
            </p>
            <div className="mt-4 bg-[#111] border border-[#1e1e1e] p-5 space-y-2">
              <p><span className="text-white">Denominación social:</span> {siteConfig.empresa}</p>
              <p><span className="text-white">NIF:</span> {siteConfig.nif}</p>
              <p><span className="text-white">Domicilio social:</span> {siteConfig.address}</p>
              <p><span className="text-white">Teléfono:</span> {siteConfig.phoneDisplay}</p>
              <p><span className="text-white">Correo electrónico:</span> {siteConfig.email}</p>
              <p><span className="text-white">Sitio web:</span> thevilahome.com</p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">2. Objeto y ámbito de aplicación</h2>
            <p>
              El presente Aviso Legal regula el acceso y uso del sitio web <strong className="text-[#ccc]">thevilahome.com</strong> (en
              adelante, "el Sitio Web"), propiedad de {siteConfig.empresa}. El acceso y uso del Sitio Web atribuye la
              condición de usuario e implica la aceptación plena de todas las condiciones incluidas en este Aviso Legal.
              El titular se reserva el derecho a modificar estas condiciones en cualquier momento, siendo efectiva dicha
              modificación desde el momento de su publicación en el Sitio Web.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">3. Condiciones de acceso y uso</h2>
            <p>
              El acceso al Sitio Web es libre y gratuito. El usuario se compromete a utilizar el Sitio Web de conformidad
              con la ley, el presente Aviso Legal y las buenas costumbres y orden público. Queda prohibido el uso del
              Sitio Web con finalidades ilícitas o lesivas para {siteConfig.empresa} o para terceros.
            </p>
            <p className="mt-3">
              El usuario se abstendrá de obtener o intentar obtener los contenidos del Sitio Web empleando medios
              distintos de los puestos a su disposición, así como de reproducir, copiar, distribuir, transformar o
              comunicar públicamente dichos contenidos sin la debida autorización del titular.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">4. Propiedad intelectual e industrial</h2>
            <p>
              Todos los contenidos del Sitio Web —incluyendo, sin carácter limitativo, textos, fotografías, gráficos,
              imágenes, tecnología, software, logotipos, marcas y nombres comerciales— son propiedad de{" "}
              {siteConfig.empresa} o de terceros que han autorizado su uso, y están protegidos por las leyes de propiedad
              intelectual e industrial vigentes.
            </p>
            <p className="mt-3">
              Queda expresamente prohibida la reproducción total o parcial del Sitio Web o de sus contenidos, así como su
              distribución, comunicación pública, transformación o modificación sin el consentimiento expreso y por
              escrito del titular. El incumplimiento de esta prohibición podrá dar lugar a las acciones legales pertinentes.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">5. Exclusión de garantías y responsabilidad</h2>
            <p>
              {siteConfig.empresa} no garantiza la disponibilidad, continuidad ni infalibilidad del funcionamiento del
              Sitio Web y, en consecuencia, no se responsabiliza de los daños y perjuicios que puedan derivarse de la
              falta de disponibilidad o de continuidad del Sitio Web o de sus servicios.
            </p>
            <p className="mt-3">
              La información contenida en el Sitio Web tiene carácter meramente informativo. Las características,
              precios y disponibilidad de los inmuebles publicados están sujetos a cambios sin previo aviso. La
              información no constituye oferta vinculante. {siteConfig.empresa} no se hace responsable de los errores u
              omisiones en el contenido del Sitio Web.
            </p>
            <p className="mt-3">
              El Sitio Web puede contener enlaces a sitios de terceros. {siteConfig.empresa} no controla dichos sitios ni
              se responsabiliza de sus contenidos o políticas de privacidad.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">6. Política de privacidad y cookies</h2>
            <p>
              El tratamiento de los datos personales recabados a través del Sitio Web se rige por la{" "}
              <Link href="/privacidad" className="text-[#C9B99A] hover:underline">Política de Privacidad</Link> y la{" "}
              <Link href="/cookies" className="text-[#C9B99A] hover:underline">Política de Cookies</Link>, que forman
              parte integrante del presente Aviso Legal.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">7. Legislación aplicable y jurisdicción</h2>
            <p>
              El presente Aviso Legal se rige por la legislación española vigente. Para la resolución de cualquier
              controversia que pudiera derivarse del acceso o uso del Sitio Web, las partes se someten, con renuncia
              expresa a cualquier otro fuero que pudiera corresponderles, a la jurisdicción de los Juzgados y Tribunales
              de Vilanova i la Geltrú.
            </p>
          </section>

        </div>

        {/* Back links */}
        <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-6">
          <Link href="/privacidad" className="text-[#C9B99A] text-sm hover:underline">
            Política de privacidad →
          </Link>
          <Link href="/cookies" className="text-[#C9B99A] text-sm hover:underline">
            Política de cookies →
          </Link>
          <Link href="/" className="text-[#666] text-sm hover:text-[#aaa] transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

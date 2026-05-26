import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Política de cookies de The Vila Home · Información sobre las cookies que utilizamos.",
  robots: { index: false },
};

export default function CookiesPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-10 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">Legal</span>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl text-white font-light mb-4">
            Política de Cookies
          </h1>
          <p className="text-[#666] text-sm">Última actualización: mayo 2026</p>
        </div>

        <div className="space-y-10 text-[#aaa] text-sm leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del usuario cuando
              este los visita. Permiten que el sitio web recuerde las acciones y preferencias del usuario durante un
              período de tiempo, de modo que no tenga que volver a introducirlas cada vez que regrese al sitio o navegue
              de una página a otra.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">2. Cookies utilizadas en este sitio web</h2>
            <p className="mb-4">
              A continuación se describen las cookies utilizadas en <strong className="text-[#ccc]">thevilahome.com</strong>:
            </p>

            <div className="space-y-4">
              {/* Técnicas */}
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase border border-[#C9B99A]/40 px-2 py-0.5">
                    Necesarias
                  </span>
                </div>
                <p className="text-white mb-2">Cookies técnicas y funcionales</p>
                <p className="mb-3">
                  Son imprescindibles para el correcto funcionamiento del sitio web. No requieren consentimiento previo
                  del usuario, ya que son necesarias para la prestación del servicio.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Cookie</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Origen</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Duración</th>
                        <th className="text-left text-[#666] py-2 font-normal">Finalidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">tvh_lang</td>
                        <td className="py-2 pr-4">Propia</td>
                        <td className="py-2 pr-4">1 año</td>
                        <td className="py-2">Preferencia de idioma seleccionado por el usuario</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[#ccc]">tvh_consent</td>
                        <td className="py-2 pr-4">Propia</td>
                        <td className="py-2 pr-4">1 año</td>
                        <td className="py-2">Almacena las preferencias de consentimiento de cookies del usuario</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analíticas */}
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#888] text-xs font-body tracking-widest uppercase border border-[#444] px-2 py-0.5">
                    Analíticas
                  </span>
                </div>
                <p className="text-white mb-2">Cookies analíticas (Google Analytics)</p>
                <p className="mb-3">
                  Permiten conocer el comportamiento de los usuarios en el Sitio Web con el fin de mejorar la experiencia
                  de navegación. Solo se activan si el usuario otorga su consentimiento.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Cookie</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Origen</th>
                        <th className="text-left text-[#666] py-2 font-normal">Finalidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">_ga</td>
                        <td className="py-2 pr-4">Google</td>
                        <td className="py-2">Distinguir usuarios únicos (2 años)</td>
                      </tr>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">_ga_*</td>
                        <td className="py-2 pr-4">Google</td>
                        <td className="py-2">Mantener estado de sesión (2 años)</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[#ccc]">_gid</td>
                        <td className="py-2 pr-4">Google</td>
                        <td className="py-2">Distinguir usuarios (24 horas)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-[#666]">
                  Más información en la{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C9B99A] hover:underline"
                  >
                    política de privacidad de Google
                  </a>.
                </p>
              </div>

              {/* Terceros embebidos */}
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#888] text-xs font-body tracking-widest uppercase border border-[#444] px-2 py-0.5">
                    Terceros
                  </span>
                </div>
                <p className="text-white mb-2">Cookies de servicios embebidos</p>
                <p>
                  Determinadas páginas incluyen contenido o herramientas de terceros (mapas de Google Maps y el widget
                  de valoración de Idealista). Estos servicios pueden instalar cookies propias sujetas a sus respectivas
                  políticas de privacidad y cookies, fuera del control de {siteConfig.empresa}.
                </p>
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Servicio</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Empresa</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Página</th>
                        <th className="text-left text-[#666] py-2 font-normal">Política</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">Google Maps (embed)</td>
                        <td className="py-2 pr-4">Google LLC</td>
                        <td className="py-2 pr-4">/contacto</td>
                        <td className="py-2">
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">Ver política</a>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[#ccc]">Widget valoración</td>
                        <td className="py-2 pr-4">Idealista.com Networks SL</td>
                        <td className="py-2 pr-4">/valoracion</td>
                        <td className="py-2">
                          <a href="https://www.idealista.com/info/privacidad" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">Ver política</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">3. Cómo revocar o modificar el consentimiento</h2>

            <p className="mb-4">Puede modificar sus preferencias de cookies en cualquier momento de dos formas:</p>

            <div className="space-y-4">
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-2">a) Panel de preferencias de la web</p>
                <p>
                  Haciendo clic en el enlace <strong className="text-[#C9B99A]">«Gestionar cookies»</strong> situado en
                  el pie de página de cualquier página del Sitio Web podrá activar o desactivar cada categoría de cookies
                  en cualquier momento.
                </p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-2">b) Configuración del navegador</p>
                <p>
                  Puede gestionar, bloquear o eliminar las cookies instaladas en su dispositivo a través de la
                  configuración de su navegador:
                </p>
                <ul className="mt-3 space-y-2 list-none">
                  {[
                    { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
                    { name: "Mozilla Firefox", url: "https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" },
                    { name: "Apple Safari", url: "https://support.apple.com/es-es/guide/safari/sfri11471/mac" },
                    { name: "Microsoft Edge", url: "https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
                  ].map(({ name, url }) => (
                    <li key={name} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-[#C9B99A] rounded-full shrink-0" />
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-[#666]">
                  Tenga en cuenta que deshabilitar determinadas cookies puede afectar al correcto funcionamiento del
                  Sitio Web o a la calidad de la experiencia de navegación.
                </p>
              </div>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">4. Actualización de esta política</h2>
            <p>
              {siteConfig.empresa} se reserva el derecho de actualizar esta Política de Cookies en cualquier momento.
              Se recomienda revisarla periódicamente para estar informado de cualquier cambio. Los cambios entrarán en
              vigor en el momento de su publicación en el Sitio Web.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">5. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con el uso de cookies en este Sitio Web, puede contactar con nosotros en{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[#C9B99A] hover:underline">
                {siteConfig.email}
              </a>.
            </p>
          </section>

        </div>

        {/* Back links */}
        <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-6">
          <Link href="/aviso-legal" className="text-[#C9B99A] text-sm hover:underline">
            Aviso legal →
          </Link>
          <Link href="/privacidad" className="text-[#C9B99A] text-sm hover:underline">
            Política de privacidad →
          </Link>
          <Link href="/" className="text-[#666] text-sm hover:text-[#aaa] transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

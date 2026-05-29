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

          {/* 1 — Qué son las cookies */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del
              usuario —ordenador, teléfono o tableta— cuando este los visita. Sirven para que el sitio
              recuerde información sobre la visita: qué páginas se han consultado, qué preferencias se han
              indicado o si se ha iniciado sesión, entre otras cosas. Las cookies no pueden ejecutar
              programas ni transmitir virus; son simplemente ficheros de texto.
            </p>
          </section>

          {/* 2 — Qué cookies utilizamos */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">2. ¿Qué cookies utilizamos?</h2>
            <p className="mb-6">
              A continuación se detallan todas las cookies utilizadas en{" "}
              <strong className="text-[#ccc]">thevilahome.com</strong>, agrupadas por categoría:
            </p>

            <div className="space-y-4">

              {/* — Necesarias — */}
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase border border-[#C9B99A]/40 px-2 py-0.5">
                    Necesarias
                  </span>
                </div>
                <p className="mb-4">
                  Imprescindibles para el funcionamiento básico del sitio web. No requieren consentimiento
                  previo del usuario.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Cookie</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Proveedor</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Duración</th>
                        <th className="text-left text-[#666] py-2 font-normal">Finalidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">_session</td>
                        <td className="py-2 pr-4">Propia</td>
                        <td className="py-2 pr-4">Sesión</td>
                        <td className="py-2">Gestión de sesión del usuario</td>
                      </tr>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">cookie_consent</td>
                        <td className="py-2 pr-4">Propia</td>
                        <td className="py-2 pr-4">12 meses</td>
                        <td className="py-2">Guardar las preferencias de cookies del usuario</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[#ccc]">PHPSESSID</td>
                        <td className="py-2 pr-4">Propia</td>
                        <td className="py-2 pr-4">Sesión</td>
                        <td className="py-2">Funcionamiento técnico del sitio web</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* — Analíticas — */}
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#888] text-xs font-body tracking-widest uppercase border border-[#444] px-2 py-0.5">
                    Analíticas
                  </span>
                </div>
                <p className="mb-4">
                  Permiten medir el uso del sitio web mediante la recopilación y análisis estadístico del
                  tráfico. Son gestionadas por{" "}
                  <strong className="text-[#ccc]">Google LLC</strong> como tercero encargado del tratamiento.
                  Solo se activan si el usuario otorga su consentimiento.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Cookie</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Proveedor</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Duración</th>
                        <th className="text-left text-[#666] py-2 font-normal">Finalidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">_ga</td>
                        <td className="py-2 pr-4">Google LLC</td>
                        <td className="py-2 pr-4">2 años</td>
                        <td className="py-2">Distinguir usuarios únicos</td>
                      </tr>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">_ga_*</td>
                        <td className="py-2 pr-4">Google LLC</td>
                        <td className="py-2 pr-4">2 años</td>
                        <td className="py-2">Mantener el estado de sesión de Analytics</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[#ccc]">_gid</td>
                        <td className="py-2 pr-4">Google LLC</td>
                        <td className="py-2 pr-4">24 horas</td>
                        <td className="py-2">Distinguir usuarios durante la sesión</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-[#666]">
                  Más información:{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C9B99A] hover:underline"
                  >
                    Política de privacidad de Google
                  </a>.
                </p>
              </div>

              {/* — Servicios de terceros — */}
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#888] text-xs font-body tracking-widest uppercase border border-[#444] px-2 py-0.5">
                    Servicios de terceros
                  </span>
                </div>
                <p className="mb-4">
                  Determinadas páginas incluyen herramientas o contenidos proporcionados por terceros: un
                  mapa de Google Maps en <strong className="text-[#ccc]">/contacto</strong> y el widget de
                  valoración de Idealista en <strong className="text-[#ccc]">/valoracion</strong>. Estos
                  servicios pueden instalar sus propias cookies, cuya gestión corresponde a cada proveedor.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Cookie</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Proveedor</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">Duración</th>
                        <th className="text-left text-[#666] py-2 font-normal">Finalidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">Google Maps (embed)</td>
                        <td className="py-2 pr-4">Google LLC</td>
                        <td className="py-2 pr-4">Variable</td>
                        <td className="py-2">Mostrar mapa interactivo en /contacto</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[#ccc]">Widget valoración</td>
                        <td className="py-2 pr-4">Idealista.com Networks SL</td>
                        <td className="py-2 pr-4">Variable</td>
                        <td className="py-2">Widget de valoración en /valoracion</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-[#666] space-y-1">
                  <p>
                    Google LLC:{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C9B99A] hover:underline"
                    >
                      Política de privacidad
                    </a>
                  </p>
                  <p>
                    Idealista.com Networks SL:{" "}
                    <a
                      href="https://www.idealista.com/legal/politica-privacidad.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C9B99A] hover:underline"
                    >
                      Política de privacidad
                    </a>
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* 3 — Para qué usamos las cookies */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">3. ¿Para qué usamos las cookies?</h2>
            <div className="space-y-5">
              <div>
                <p className="text-[#ccc] mb-1">Cookies necesarias</p>
                <p>
                  Garantizan el funcionamiento técnico del sitio web: mantienen la sesión del usuario activa
                  durante la navegación y almacenan sus preferencias sobre el consentimiento de cookies para
                  no volver a solicitárselas en cada visita.
                </p>
              </div>
              <div>
                <p className="text-[#ccc] mb-1">Cookies analíticas</p>
                <p>
                  Permiten obtener estadísticas agregadas sobre el uso del sitio web: páginas visitadas,
                  tiempo de permanencia, origen del tráfico y comportamiento general de los usuarios. Esta
                  información se utiliza exclusivamente para mejorar el rendimiento y los contenidos del
                  sitio. Los datos son tratados por Google LLC, que actúa como tercero encargado del
                  tratamiento.
                </p>
              </div>
              <div>
                <p className="text-[#ccc] mb-1">Servicios de terceros</p>
                <p>
                  Los servicios embebidos de Google Maps e Idealista operan de forma independiente. Las
                  cookies que instalan estos servicios están fuera del control de{" "}
                  {siteConfig.empresa} y se rigen exclusivamente por las políticas de privacidad de sus
                  respectivos proveedores.
                </p>
              </div>
            </div>
          </section>

          {/* 4 — Base legal */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">4. Base legal del tratamiento</h2>
            <div className="space-y-3">
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-[#ccc] mb-2">Cookies necesarias</p>
                <p>
                  La base legal es el{" "}
                  <strong className="text-white">interés legítimo del responsable y la necesidad para la
                  prestación del servicio</strong>, de conformidad con el artículo 6.1.b) del Reglamento
                  (UE) 2016/679 (RGPD). Estas cookies no requieren consentimiento previo del usuario.
                </p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-[#ccc] mb-2">Cookies analíticas y de servicios de terceros</p>
                <p>
                  La base legal es el{" "}
                  <strong className="text-white">consentimiento del usuario</strong>, de conformidad con el
                  artículo 6.1.a) del RGPD y el artículo 22.2 de la Ley 34/2002, de Servicios de la
                  Sociedad de la Información y de Comercio Electrónico (LSSI). El usuario puede retirar su
                  consentimiento en cualquier momento sin que ello afecte a la licitud del tratamiento
                  realizado con anterioridad.
                </p>
              </div>
            </div>
          </section>

          {/* 5 — Periodo de conservación */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">5. Periodo de conservación</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left text-[#666] py-2 pr-6 font-normal">Categoría</th>
                    <th className="text-left text-[#666] py-2 font-normal">Periodo de conservación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#1a1a1a]">
                    <td className="py-2 pr-6 text-[#ccc]">Necesarias (sesión)</td>
                    <td className="py-2">Se eliminan al cerrar el navegador</td>
                  </tr>
                  <tr className="border-b border-[#1a1a1a]">
                    <td className="py-2 pr-6 text-[#ccc]">Necesarias (preferencias)</td>
                    <td className="py-2">12 meses desde su creación</td>
                  </tr>
                  <tr className="border-b border-[#1a1a1a]">
                    <td className="py-2 pr-6 text-[#ccc]">Analíticas (Google Analytics)</td>
                    <td className="py-2">Entre 24 horas y 2 años, según la cookie</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6 text-[#ccc]">Servicios de terceros</td>
                    <td className="py-2">Variable; véanse las políticas de cada proveedor</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 6 — Transferencias internacionales */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">6. Transferencias internacionales de datos</h2>
            <p>
              Google LLC está establecida en los Estados Unidos de América. Las transferencias de datos
              personales a Google LLC se amparan en las{" "}
              <strong className="text-white">Cláusulas Contractuales Tipo</strong> aprobadas por la
              Comisión Europea, así como en el marco del{" "}
              <strong className="text-white">EU-US Data Privacy Framework</strong> (Decisión de adecuación
              de la Comisión Europea de 10 de julio de 2023). Para más información, puede consultar la{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9B99A] hover:underline"
              >
                política de privacidad de Google
              </a>.
            </p>
            <p className="mt-4">
              Idealista.com Networks SL está establecida en España (Unión Europea), por lo que el
              tratamiento de datos realizado por este proveedor no constituye transferencia internacional
              de datos.
            </p>
          </section>

          {/* 7 — Gestionar o retirar el consentimiento */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">7. ¿Cómo gestionar o retirar el consentimiento?</h2>
            <p className="mb-5">
              El usuario puede gestionar, modificar o retirar su consentimiento en cualquier momento de
              dos formas:
            </p>
            <div className="space-y-4">
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-[#ccc] mb-2">a) Panel de gestión de cookies de la web</p>
                <p>
                  Haciendo clic en el enlace{" "}
                  <strong className="text-[#C9B99A]">«Gestionar cookies»</strong> situado en el pie de
                  página de cualquier página del sitio web, el usuario podrá activar o desactivar cada
                  categoría de cookies en cualquier momento.
                </p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-[#ccc] mb-2">b) Configuración del navegador</p>
                <p className="mb-3">
                  También puede gestionar, bloquear o eliminar las cookies instaladas en su dispositivo
                  a través de la configuración de su navegador:
                </p>
                <ul className="space-y-2 list-none">
                  {[
                    {
                      name: "Google Chrome",
                      url: "https://support.google.com/chrome/answer/95647",
                    },
                    {
                      name: "Mozilla Firefox",
                      url: "https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias",
                    },
                    {
                      name: "Apple Safari",
                      url: "https://support.apple.com/es-es/guide/safari/sfri11471/mac",
                    },
                    {
                      name: "Microsoft Edge",
                      url: "https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
                    },
                  ].map(({ name, url }) => (
                    <li key={name} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-[#C9B99A] rounded-full shrink-0" />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C9B99A] hover:underline"
                      >
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-[#666]">
                  La desactivación de determinadas cookies puede afectar al correcto funcionamiento del
                  sitio web.
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#666]">
              La retirada del consentimiento no afectará a la licitud del tratamiento basado en el
              consentimiento previo a su retirada.
            </p>
          </section>

          {/* 8 — Actualización */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">8. Actualización de esta política</h2>
            <p>
              {siteConfig.empresa} se reserva el derecho de actualizar esta Política de Cookies en
              cualquier momento, por ejemplo para adaptarla a cambios legislativos o a modificaciones en
              los servicios del sitio web. Se recomienda revisar esta página periódicamente. Los cambios
              entrarán en vigor en el momento de su publicación en el sitio web.
            </p>
          </section>

          {/* 9 — Contacto */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">9. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con el uso de cookies en este sitio web, puede
              dirigirse al responsable del tratamiento:
            </p>
            <div className="mt-3 bg-[#111] border border-[#1e1e1e] p-5 text-xs space-y-1">
              <p className="text-[#ccc]">{siteConfig.empresa}</p>
              <p>
                Correo electrónico:{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[#C9B99A] hover:underline"
                >
                  {siteConfig.email}
                </a>
              </p>
            </div>
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

import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de The Vila Home · Cómo tratamos tus datos personales.",
  robots: { index: false },
};

export default function PrivacidadPage() {
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
            Política de Privacidad
          </h1>
          <p className="text-[#666] text-sm">Última actualización: mayo 2026</p>
        </div>

        <div className="space-y-10 text-[#aaa] text-sm leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">1. Responsable del tratamiento</h2>
            <div className="bg-[#111] border border-[#1e1e1e] p-5 space-y-2">
              <p><span className="text-white">Responsable:</span> {siteConfig.empresa}</p>
              <p><span className="text-white">NIF:</span> {siteConfig.nif}</p>
              <p><span className="text-white">Dirección:</span> {siteConfig.address}</p>
              <p><span className="text-white">Contacto en materia de privacidad:</span>{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-[#C9B99A] hover:underline">
                  {siteConfig.email}
                </a>
              </p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">2. Datos que recopilamos</h2>
            <p>Podemos recopilar las siguientes categorías de datos personales:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Datos de identificación y contacto: nombre, apellidos, dirección de correo electrónico, número de teléfono.",
                "Datos proporcionados voluntariamente a través de formularios de contacto o solicitudes de valoración.",
                "Datos de navegación: dirección IP, tipo de navegador, páginas visitadas y duración de la visita (a través de cookies analíticas, previo consentimiento).",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#C9B99A] rounded-full shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">3. Finalidades y bases legales del tratamiento</h2>
            <div className="space-y-4">
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-1">Gestión de consultas e información inmobiliaria</p>
                <p>Atender las solicitudes de información sobre propiedades o servicios recibidas a través del Sitio Web, teléfono o correo electrónico.</p>
                <p className="mt-1 text-[#666]">Base legal: ejecución de medidas precontractuales a petición del interesado (art. 6.1.b RGPD).</p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-1">Prestación del servicio de intermediación inmobiliaria</p>
                <p>Gestión de la relación contractual derivada del encargo de compraventa, alquiler o valoración de inmuebles.</p>
                <p className="mt-1 text-[#666]">Base legal: ejecución del contrato (art. 6.1.b RGPD).</p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-1">Envío de comunicaciones comerciales</p>
                <p>Envío de información sobre inmuebles, servicios o novedades del sector, únicamente si el usuario ha prestado su consentimiento expreso.</p>
                <p className="mt-1 text-[#666]">Base legal: consentimiento del interesado (art. 6.1.a RGPD). Puede retirar su consentimiento en cualquier momento.</p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-1">Cumplimiento de obligaciones legales</p>
                <p>Conservación de documentación según los plazos establecidos por la normativa fiscal, mercantil y de prevención del blanqueo de capitales.</p>
                <p className="mt-1 text-[#666]">Base legal: cumplimiento de una obligación legal (art. 6.1.c RGPD).</p>
              </div>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">4. Plazos de conservación</h2>
            <p>
              Los datos se conservarán durante el tiempo necesario para la prestación del servicio y, posteriormente,
              durante los plazos de prescripción legal aplicables:
            </p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Datos contractuales: hasta 6 años (obligaciones mercantiles y fiscales).",
                "Datos de prevención de blanqueo de capitales: hasta 10 años.",
                "Datos de consultas no formalizadas en contrato: hasta 1 año desde la última comunicación.",
                "Datos de comunicaciones comerciales: hasta que se retire el consentimiento.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#C9B99A] rounded-full shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">5. Cesión de datos a terceros</h2>
            <p>
              {siteConfig.empresa} no cederá datos personales a terceros salvo en los siguientes supuestos:
            </p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Cuando sea necesario para la prestación del servicio (por ejemplo, a otras agencias colaboradoras o a entidades financieras, con su consentimiento previo).",
                "Cuando exista obligación legal (Administración Tributaria, Fuerzas y Cuerpos de Seguridad del Estado, etc.).",
                "A encargados del tratamiento (proveedores de servicios tecnológicos) bajo contrato de encargo de tratamiento y con garantías suficientes.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#C9B99A] rounded-full shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              No se realizan transferencias internacionales de datos fuera del Espacio Económico Europeo.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">6. Derechos del interesado</h2>
            <p>
              En virtud del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD),
              puede ejercer los siguientes derechos:
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { right: "Acceso", desc: "Conocer qué datos tratamos sobre usted." },
                { right: "Rectificación", desc: "Corregir datos inexactos o incompletos." },
                { right: "Supresión", desc: "Solicitar la eliminación de sus datos ('derecho al olvido')." },
                { right: "Limitación", desc: "Restringir el tratamiento en determinados supuestos." },
                { right: "Portabilidad", desc: "Recibir sus datos en formato estructurado y de uso común." },
                { right: "Oposición", desc: "Oponerse al tratamiento, incluido el marketing directo." },
              ].map(({ right, desc }) => (
                <div key={right} className="bg-[#111] border border-[#1e1e1e] p-4">
                  <p className="text-white mb-1">{right}</p>
                  <p className="text-xs">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              Para ejercer cualquiera de estos derechos, puede dirigirse a{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[#C9B99A] hover:underline">
                {siteConfig.email}
              </a>{" "}
              adjuntando copia de su DNI o documento equivalente. Tiene derecho a presentar una reclamación ante la
              Agencia Española de Protección de Datos (
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9B99A] hover:underline"
              >
                www.aepd.es
              </a>
              ).
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">7. Seguridad</h2>
            <p>
              {siteConfig.empresa} ha adoptado las medidas técnicas y organizativas necesarias para garantizar la
              seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado,
              habida cuenta del estado de la tecnología, la naturaleza de los datos y los riesgos a los que están
              expuestos, de conformidad con lo establecido en el RGPD.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">8. Herramientas y servicios de terceros</h2>
            <div className="space-y-4">
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-1">Google Analytics</p>
                <p>
                  Utilizamos Google Analytics (Google LLC, EE.UU.) para analizar el uso del Sitio Web. Esta herramienta
                  solo se activa si el usuario otorga su consentimiento para cookies analíticas. Los datos son
                  anonimizados y no se utilizan para identificar personas. Google LLC actúa como encargado del
                  tratamiento bajo el{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">
                    Marco de Privacidad de Datos UE-EE.UU.
                  </a>
                </p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-1">Widget de valoración de Idealista</p>
                <p>
                  La página de valoración integra una herramienta de Idealista.com Networks SL (CIF B-84428349, España).
                  Al utilizar el formulario de valoración, los datos proporcionados (dirección del inmueble y
                  características) son tratados directamente por Idealista conforme a su{" "}
                  <a href="https://www.idealista.com/info/privacidad" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">
                    Política de Privacidad
                  </a>
                  . {siteConfig.empresa} no tiene acceso a los datos introducidos en el widget.
                </p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-1">Google Maps</p>
                <p>
                  La página de contacto muestra un mapa de Google Maps (Google LLC). Al cargar la página, Google Maps
                  puede instalar cookies propias sujetas a su{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">
                    Política de Privacidad
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-display text-xl text-white mb-4">9. Cookies</h2>
            <p>
              El Sitio Web utiliza cookies propias y de terceros. Para más información, consulte nuestra{" "}
              <Link href="/cookies" className="text-[#C9B99A] hover:underline">
                Política de Cookies
              </Link>.
            </p>
          </section>

        </div>

        {/* Back links */}
        <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-6">
          <Link href="/aviso-legal" className="text-[#C9B99A] text-sm hover:underline">
            Aviso legal →
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

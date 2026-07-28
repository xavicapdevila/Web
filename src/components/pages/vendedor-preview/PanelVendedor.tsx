"use client";

/**
 * PROTOTIPO — Panel del vendedor ("perfil del vendedor").
 *
 * Maqueta con datos de ejemplo, sin backend: qué vería el propietario de su
 * proceso de venta. El portal anterior se descartó; esto arranca de cero solo
 * como propuesta visual. Navegación real entre secciones (estado local).
 *
 * Decisiones de Xavi (jul 2026):
 * - El inmueble se identifica por dirección, sin título comercial.
 * - Sin valoración por visita (interesado/descartó…): no aparentar certezas.
 * - Documentación: SOLO lo recibido, con check — nunca la lista completa de
 *   lo que hace falta para vender (el cliente no debe ver el "manual").
 * - Sin Mensajes (se habla por WhatsApp/teléfono) ni Configuración.
 * - Tema: conmutador claro/oscuro, de serie siempre oscuro.
 */

import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarClock,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Download,
  FileSignature,
  FileText,
  Home,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Moon,
  PenLine,
  Route,
  ShieldCheck,
  Sun,
} from "lucide-react";

/** Titulares y cifras — Space Grotesk (la variable la inyecta la página) */
const DISPLAY = "[font-family:var(--font-dx-display),system-ui]";

const GRAD = "linear-gradient(135deg, var(--pv-acento), var(--pv-acento2))";

/* ---------------------------------------------------------------- datos mock */

/* Sin título comercial: en el panel del propietario el inmueble se identifica
   siempre por su dirección. La cuenta es de la PERSONA: si tiene varias casas
   en venta a la vez, elige cuál ver desde la cabecera. */
const PROPIEDADES = [
  {
    direccion: "Carrer de la Talaia, 18",
    municipio: "Vilanova i la Geltrú",
    ref: "2381",
    foto: "/images/vender/entrada.jpg",
    /* Solo lo HECHO para este inmueble: un terreno o un local sin tour
       virtual simplemente no lo lista */
    reportaje: ["Fotografía", "Vídeo del inmueble", "Plano", "Tour virtual"],
  },
  {
    direccion: "Carrer de l'Aigua, 42",
    municipio: "Vilanova i la Geltrú",
    ref: "2402",
    foto: "/images/vender/vista.jpg",
    reportaje: ["Fotografía", "Vídeo del inmueble", "Plano"],
  },
];

const VENDEDOR = { nombre: "Jordi Ferrer", iniciales: "JF" };

const PASOS: {
  titulo: string;
  detalle: string;
  fecha: string;
  estado: "hecho" | "activo" | "pendiente";
  icono: ReactNode;
}[] = [
  {
    titulo: "1. Encargo de venta",
    detalle: "Reportaje y anuncio publicados",
    fecha: "12/06/2026",
    estado: "hecho",
    icono: <Check className="h-5 w-5" strokeWidth={2.5} />,
  },
  {
    titulo: "2. Propuesta / Reserva",
    detalle: "A la espera de propuesta",
    fecha: "En curso",
    estado: "activo",
    icono: <FileText className="h-5 w-5" />,
  },
  {
    titulo: "3. Contrato de arras",
    detalle: "Pendiente de firma",
    fecha: "Pendiente",
    estado: "pendiente",
    icono: <FileSignature className="h-5 w-5" />,
  },
  {
    titulo: "4. Firma en notaría",
    detalle: "Último paso",
    fecha: "Pendiente",
    estado: "pendiente",
    icono: <PenLine className="h-5 w-5" />,
  },
];

/* Lo agendado lo introduce el asesor en su calendario (Ora); aquí solo se
   muestra. El estado es factual: confirmada por WhatsApp o aún no */
const PROXIMAS: { dia: string; fecha: string; hora: string; nombre: string; confirmada: boolean }[] = [
  { dia: "Mañana", fecha: "28/07/2026", hora: "11:00", nombre: "Hugo M.", confirmada: true },
  { dia: "Jueves", fecha: "30/07/2026", hora: "17:30", nombre: "Cèlia P.", confirmada: false },
];

/* Sin valoración por visita a propósito: muchas veces el comprador no dice
   nada (o no se le puede leer) y no queremos aparentar una certeza que no hay */
const VISITAS = [
  { fecha: "25/07/2026", hora: "11:30", nombre: "Laura S." },
  { fecha: "22/07/2026", hora: "17:00", nombre: "Javier R." },
  { fecha: "19/07/2026", hora: "10:00", nombre: "Marta G." },
  { fecha: "16/07/2026", hora: "12:00", nombre: "Daniel F." },
  { fecha: "11/07/2026", hora: "16:30", nombre: "Ana B." },
];

/* SOLO lo que ya ha llegado, siempre con check. La lista de lo que falta no se
   enseña nunca: es el "manual" de la venta y se pide directamente al cliente
   cuando toca. Y NADA de esto se descarga: documentos con coste (nota simple…)
   no deben poder acabar en manos de otras agencias — aquí solo se consulta */
const DOCUMENTOS: { nombre: string; fecha: string }[] = [
  { nombre: "Nota simple", fecha: "15/06/2026" },
  { nombre: "Certificado de eficiencia energética", fecha: "22/06/2026" },
  { nombre: "Cédula de habitabilidad", fecha: "22/06/2026" },
  { nombre: "Último recibo del IBI", fecha: "01/07/2026" },
];

/* Lo ÚNICO descargable del panel: los contratos del cliente con TVH */
const CONTRATOS: { nombre: string; fecha?: string }[] = [
  { nombre: "Encargo de venta", fecha: "12/06/2026" },
  { nombre: "Propuesta de compra / Reserva" },
  { nombre: "Contrato de arras" },
];


type Seccion = "resumen" | "proceso" | "visitas" | "documentos" | "notaria" | "propiedad";

const MENU: { key: Seccion; etiqueta: string; icono: ReactNode }[] = [
  { key: "resumen", etiqueta: "Resumen", icono: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { key: "proceso", etiqueta: "Proceso de venta", icono: <Route className="h-[18px] w-[18px]" /> },
  { key: "visitas", etiqueta: "Visitas", icono: <CalendarDays className="h-[18px] w-[18px]" /> },
  { key: "documentos", etiqueta: "Documentos", icono: <FileText className="h-[18px] w-[18px]" /> },
  { key: "notaria", etiqueta: "Notaría y firma", icono: <PenLine className="h-[18px] w-[18px]" /> },
  { key: "propiedad", etiqueta: "Mi propiedad", icono: <Home className="h-[18px] w-[18px]" /> },
];

/* ------------------------------------------------------------------- átomos */

function Carta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-[var(--pv-linea)] bg-[var(--pv-carta)] [box-shadow:var(--pv-sombra)] ${className}`}
    >
      {children}
    </section>
  );
}

/** Cabecera de carta plegable: icono en caja esmeralda + título + flecha */
function CabeceraCarta({
  icono,
  titulo,
  abierta,
  onToggle,
}: {
  icono: ReactNode;
  titulo: string;
  abierta: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={abierta}
      className="flex w-full items-center gap-3 px-5 py-4 text-left"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--pv-acento-suave)] text-[var(--pv-acento)]">
        {icono}
      </span>
      <span className={`${DISPLAY} flex-1 text-[15.5px] font-semibold tracking-[-0.01em] text-[var(--pv-texto)]`}>
        {titulo}
      </span>
      <ChevronDown
        className={`h-4 w-4 text-[var(--pv-tenue)] transition-transform duration-200 ${abierta ? "" : "-rotate-90"}`}
      />
    </button>
  );
}

function EnlacePie({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group mx-4 mb-4 mt-1 flex items-center justify-center gap-2 rounded-xl border border-[var(--pv-linea)] px-4 py-2.5 text-[13px] font-medium text-[var(--pv-texto2)] transition-colors hover:border-[var(--pv-acento)]/50 hover:text-[var(--pv-acento)]"
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );
}

function ChipEstado({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--pv-acento-suave)] px-2.5 py-1 text-[11px] font-semibold text-[var(--pv-acento)]">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--pv-acento)]" />
      {children}
    </span>
  );
}

/** Check verde de "recibido/hecho" — mismo esmeralda de acento que el resto */
function CheckVerde() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--pv-acento)] text-[var(--pv-tinta-acento)]">
      <Check className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}

/** Título de sección (bajo la cabecera, encima de las cartas) */
function TituloSeccion({ titulo, detalle }: { titulo: string; detalle: string }) {
  return (
    <div className="mt-6 px-1">
      <h2 className={`${DISPLAY} text-[21px] font-semibold tracking-[-0.02em] text-[var(--pv-texto)]`}>
        {titulo}
      </h2>
      <p className="mt-1 text-[13.5px] text-[var(--pv-apagado)]">{detalle}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ piezas */

function PasoTimeline({ paso, ultimo }: { paso: (typeof PASOS)[number]; ultimo: boolean }) {
  const { estado } = paso;
  return (
    <div className="relative flex gap-4 lg:block">
      {/* círculo + conector: horizontal en escritorio, vertical en móvil */}
      <div className="flex flex-col items-center lg:mb-4 lg:block">
        <div className="relative lg:flex lg:items-center">
          <div
            className={`z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
              estado === "hecho"
                ? "border-transparent text-[var(--pv-tinta-acento)]"
                : estado === "activo"
                  ? "border-[var(--pv-acento)] bg-[var(--pv-acento-suave)] text-[var(--pv-acento)]"
                  : "border-[var(--pv-linea2)] bg-[var(--pv-carta)] text-[var(--pv-tenue)]"
            }`}
            style={
              estado === "hecho"
                ? { background: GRAD, boxShadow: "0 6px 20px var(--pv-brillo)" }
                : undefined
            }
          >
            {paso.icono}
          </div>
          {!ultimo ? (
            <div aria-hidden className="absolute left-[52px] right-0 top-1/2 hidden -translate-y-1/2 lg:block">
              {estado === "hecho" ? (
                <div className="h-[3px] rounded-full" style={{ background: GRAD }} />
              ) : (
                <div className="border-t-2 border-dashed border-[var(--pv-linea2)]" />
              )}
            </div>
          ) : null}
        </div>
        {!ultimo ? (
          <div
            aria-hidden
            className={`my-1 min-h-6 w-0 flex-1 lg:hidden ${
              estado === "hecho"
                ? "border-l-[3px] border-[var(--pv-acento)]"
                : "border-l-2 border-dashed border-[var(--pv-linea2)]"
            }`}
          />
        ) : null}
      </div>

      <div className="pb-6 lg:pb-0 lg:pr-6">
        <p
          className={`text-[12px] font-semibold ${
            estado === "hecho" || estado === "activo" ? "text-[var(--pv-acento)]" : "text-[var(--pv-tenue)]"
          }`}
        >
          {paso.fecha}
        </p>
        <h3 className={`${DISPLAY} mt-1 text-[15px] font-semibold tracking-[-0.01em] text-[var(--pv-texto)]`}>
          {paso.titulo}
        </h3>
        <p className="mt-0.5 text-[13px] leading-snug text-[var(--pv-apagado)]">{paso.detalle}</p>

        {paso.titulo.startsWith("4") ? (
          <dl className="mt-3 space-y-1.5 text-[12.5px]">
            {[
              ["Notaría", "Por designar"],
              ["Fecha", "--/--/----"],
              ["Hora", "--:--"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 text-[var(--pv-apagado)]">
                {k === "Notaría" ? (
                  <MapPin className="h-3.5 w-3.5 text-[var(--pv-tenue)]" />
                ) : k === "Fecha" ? (
                  <CalendarDays className="h-3.5 w-3.5 text-[var(--pv-tenue)]" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-[var(--pv-tenue)]" />
                )}
                <dt className="text-[var(--pv-tenue)]">{k}</dt>
                <dd className="tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <button
            type="button"
            disabled={estado !== "hecho"}
            className={`mt-3 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
              estado === "hecho"
                ? "border-[var(--pv-acento)]/40 text-[var(--pv-acento)] hover:bg-[var(--pv-acento-suave)]"
                : "cursor-not-allowed border-[var(--pv-linea)] text-[var(--pv-tenue)] opacity-60"
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            {estado === "hecho" ? "Descargar PDF" : "Aún no disponible"}
          </button>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- componente */

export default function PanelVendedor() {
  /* De serie oscuro (decisión de Xavi); si el usuario elige claro, se queda
     guardado entre visitas */
  const [tema, setTema] = useState<"oscuro" | "claro">("oscuro");
  useEffect(() => {
    try {
      const t = localStorage.getItem("pv-tema");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- el tema guardado solo existe en el navegador: se aplica tras hidratar (el primer pintado siempre es el oscuro de serie)
      if (t === "claro" || t === "oscuro") setTema(t);
    } catch {
      /* modo incógnito */
    }
  }, []);
  const cambiarTema = () =>
    setTema((prev) => {
      const t = prev === "oscuro" ? "claro" : "oscuro";
      try {
        localStorage.setItem("pv-tema", t);
      } catch {
        /* modo incógnito */
      }
      return t;
    });

  /* La campanita solo marca cuando hay algo nuevo; al abrirla, visto y fuera */
  const [novedades, setNovedades] = useState(true);
  const [seccion, setSeccion] = useState<Seccion>("resumen");

  /* Varias casas en venta a la vez: la cuenta es de la persona y elige cuál
     ver desde la dirección de la cabecera (desplegable) */
  const [propIdx, setPropIdx] = useState(0);
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const propiedad = PROPIEDADES[propIdx];
  const [abiertas, setAbiertas] = useState({
    proximas: true,
    visitas: true,
    docs: true,
    contratos: true,
  });

  const alternar = (k: keyof typeof abiertas) =>
    setAbiertas((prev) => ({ ...prev, [k]: !prev[k] }));

  /* ------------------------------------------------ cartas reutilizables */

  const cartaProximas = (
    <Carta>
      <CabeceraCarta
        icono={<CalendarClock className="h-[18px] w-[18px]" />}
        titulo="Próximas visitas"
        abierta={abiertas.proximas}
        onToggle={() => alternar("proximas")}
      />
      {abiertas.proximas ? (
        <>
          <ul className="divide-y divide-[var(--pv-linea)] border-t border-[var(--pv-linea)]">
            {PROXIMAS.map((v) => (
              <li key={`${v.fecha}-${v.hora}`} className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--pv-acento-suave)] text-[var(--pv-acento)]">
                  <CalendarClock className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-[var(--pv-texto)]">
                    {v.dia} · {v.hora}
                  </span>
                  <span className="block truncate text-[12px] tabular-nums text-[var(--pv-apagado)]">
                    {v.nombre} · {v.fecha}
                  </span>
                </span>
                {v.confirmada ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--pv-acento-suave)] px-2.5 py-1 text-[11px] font-semibold text-[var(--pv-acento)]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                    Confirmada
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-[var(--pv-carta2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--pv-apagado)]">
                    Por confirmar
                  </span>
                )}
              </li>
            ))}
          </ul>
          {/* la promesa del sistema de avisos, contada al vendedor */}
          <p className="mx-4 mb-4 mt-1 flex items-start gap-2 rounded-xl bg-[var(--pv-carta2)] px-3.5 py-2.5 text-[12px] leading-relaxed text-[var(--pv-apagado)]">
            <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pv-acento)]" />
            El día antes te recordaremos cada visita por WhatsApp, con el resumen de tu día.
          </p>
        </>
      ) : null}
    </Carta>
  );

  const cartaRealizadas = (
    <Carta>
      <CabeceraCarta
        icono={<CalendarDays className="h-[18px] w-[18px]" />}
        titulo="Visitas realizadas"
        abierta={abiertas.visitas}
        onToggle={() => alternar("visitas")}
      />
      {abiertas.visitas ? (
        <>
          <ul className="divide-y divide-[var(--pv-linea)] border-t border-[var(--pv-linea)]">
            {VISITAS.map((v) => (
              <li key={`${v.fecha}-${v.hora}`} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--pv-carta2)] text-[var(--pv-apagado)]">
                  <CalendarDays className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-[var(--pv-texto)]">
                    {v.nombre}
                  </span>
                  <span className="block text-[12px] tabular-nums text-[var(--pv-apagado)]">
                    {v.fecha} · {v.hora}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {seccion !== "visitas" ? (
            <EnlacePie onClick={() => setSeccion("visitas")}>Ver todas las visitas</EnlacePie>
          ) : null}
        </>
      ) : null}
    </Carta>
  );

  const cartaDocumentos = (compacta: boolean) => (
    <Carta>
      <CabeceraCarta
        icono={<ShieldCheck className="h-[18px] w-[18px]" />}
        titulo="Documentos recibidos"
        abierta={abiertas.docs}
        onToggle={() => alternar("docs")}
      />
      {abiertas.docs ? (
        <>
          <ul className="divide-y divide-[var(--pv-linea)] border-t border-[var(--pv-linea)]">
            {(compacta ? DOCUMENTOS.slice(-3).reverse() : DOCUMENTOS).map((doc) => (
              <li key={doc.nombre} className="flex items-center gap-3 px-5 py-[10.5px]">
                <CheckVerde />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] text-[var(--pv-texto)]">{doc.nombre}</span>
                  <span className="block text-[11.5px] tabular-nums text-[var(--pv-tenue)]">
                    Recibido el {doc.fecha}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {compacta ? (
            <EnlacePie onClick={() => setSeccion("documentos")}>Ver todos los documentos</EnlacePie>
          ) : (
            <p className="mx-4 mb-4 mt-1 flex items-start gap-2 rounded-xl bg-[var(--pv-carta2)] px-3.5 py-2.5 text-[12px] leading-relaxed text-[var(--pv-apagado)]">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pv-acento)]" />
              Cada documento lo subimos aquí en cuanto lo tenemos. Si necesitamos algo de ti, te lo
              pediremos directamente — no tienes que estar pendiente.
            </p>
          )}
        </>
      ) : null}
    </Carta>
  );

  /* Los contratos del cliente: lo único con botón de descarga en todo el panel */
  const cartaContratos = (
    <Carta>
      <CabeceraCarta
        icono={<FileSignature className="h-[18px] w-[18px]" />}
        titulo="Tus contratos"
        abierta={abiertas.contratos}
        onToggle={() => alternar("contratos")}
      />
      {abiertas.contratos ? (
        <>
          <ul className="divide-y divide-[var(--pv-linea)] border-t border-[var(--pv-linea)]">
            {CONTRATOS.map((c) => (
              <li key={c.nombre} className="flex items-center gap-3 px-5 py-3">
                {c.fecha ? (
                  <CheckVerde />
                ) : (
                  <span
                    aria-hidden
                    className="h-5 w-5 shrink-0 rounded-full border border-dashed border-[var(--pv-linea2)]"
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-[13px] ${
                      c.fecha ? "text-[var(--pv-texto)]" : "text-[var(--pv-apagado)]"
                    }`}
                  >
                    {c.nombre}
                  </span>
                  <span className="block text-[11.5px] tabular-nums text-[var(--pv-tenue)]">
                    {c.fecha ? `Firmado el ${c.fecha}` : "Aún no disponible"}
                  </span>
                </span>
                {c.fecha ? (
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--pv-acento)]/40 px-2.5 py-1.5 text-[11.5px] font-semibold text-[var(--pv-acento)] transition-colors hover:bg-[var(--pv-acento-suave)]"
                  >
                    <Download className="h-3 w-3" />
                    PDF
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="mx-4 mb-4 mt-1 flex items-start gap-2 rounded-xl bg-[var(--pv-carta2)] px-3.5 py-2.5 text-[12px] leading-relaxed text-[var(--pv-apagado)]">
            <FileSignature className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pv-acento)]" />
            Cada contrato que firmes con nosotros quedará aquí, listo para descargar cuando
            quieras.
          </p>
        </>
      ) : null}
    </Carta>
  );

  /* La asesora del inmueble con su WhatsApp directo (en real, el número sale
     del perfil de cada asesor en Ora). Sin flecha ni clic: es información. */
  const tarjetaAsesora = (
    <div className="rounded-2xl border border-[var(--pv-linea)] bg-[var(--pv-carta)] p-4 [box-shadow:var(--pv-sombra)]">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/agents/ariadna.jpg"
          alt="Ariadna"
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
        />
        <span>
          <span className="block text-[13.5px] font-semibold text-[var(--pv-texto)]">Ariadna</span>
          <span className="block text-[12px] text-[var(--pv-apagado)]">Tu asesora</span>
        </span>
      </div>
      <a
        href="https://wa.me/34638359612"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[var(--pv-tinta-acento)] transition-all hover:brightness-110"
        style={{ background: GRAD, boxShadow: "0 8px 24px var(--pv-brillo)" }}
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp directo
      </a>
    </div>
  );

  /* --------------------------------------------------------- secciones */

  const seccionResumen = (
    <>
      {/* qué está pasando ahora — la parte más importante del panel: el
          estado contado en humano, sin tono de alerta. Responde siempre a
          qué hacemos, qué vendrá y si el propietario debe hacer algo */}
      <Carta className="relative mt-5 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full opacity-[0.10]"
          style={{ background: "radial-gradient(closest-side, var(--pv-acento), transparent 70%)" }}
        />
        <div className="px-5 pb-6 pt-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--pv-acento-suave)] text-[var(--pv-acento)]">
              <Activity className="h-[18px] w-[18px]" />
            </span>
            <h2 className={`${DISPLAY} flex-1 text-[17px] font-semibold tracking-[-0.01em] text-[var(--pv-texto)]`}>
              ¿Qué está pasando ahora?
            </h2>
            <span className="text-[11.5px] text-[var(--pv-tenue)]">Actualizado hoy</span>
          </div>

          {/* Una nota humana, no un panel de control: el texto cambia con la
              etapa de la operación (en real, plantillas por etapa que el
              asesor retoca) y lo firma la asesora */}
          <div className="mt-6 max-w-[820px] border-l-2 border-[var(--pv-acento)]/60 pl-5 sm:pl-6">
            <p className={`${DISPLAY} text-[19px] font-medium leading-[1.45] tracking-[-0.015em] text-[var(--pv-texto)] sm:text-[21px]`}>
              Tu casa se está enseñando. Ya han venido a verla cinco personas y seguimos en
              contacto con ellas: recogemos su impresión, resolvemos sus dudas y, si alguien da
              el paso, su propuesta la valoraremos contigo antes de responder nada.
            </p>
            <p className={`${DISPLAY} mt-4 text-[19px] font-medium leading-[1.45] tracking-[-0.015em] text-[var(--pv-texto2)] sm:text-[21px]`}>
              Tú no tienes que hacer nada: el siguiente movimiento es nuestro, y te avisaremos
              en cuanto haya novedad.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/agents/ariadna.jpg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            <p className="text-[13px] text-[var(--pv-apagado)]">
              <span className="font-semibold text-[var(--pv-texto)]">Ariadna</span> · tu asesora
            </p>
          </div>
        </div>
      </Carta>

      {/* cifras rápidas */}
      <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-5">
        {[
          { valor: "5", etiqueta: "Visitas realizadas", ir: "visitas" as Seccion },
          { valor: "2", etiqueta: "Próximas visitas", ir: "visitas" as Seccion },
          { valor: "5", etiqueta: "Documentos recibidos", ir: "documentos" as Seccion },
        ].map((s) => (
          <button
            key={s.etiqueta}
            type="button"
            onClick={() => setSeccion(s.ir)}
            className="min-w-0 rounded-2xl border border-[var(--pv-linea)] bg-[var(--pv-carta)] px-3 py-3.5 text-left transition-colors [box-shadow:var(--pv-sombra)] hover:border-[var(--pv-acento)]/40 sm:px-5 sm:py-4"
          >
            <span className={`${DISPLAY} block text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-[var(--pv-texto)]`}>
              {s.valor}
            </span>
            <span className="mt-0.5 block text-[12px] text-[var(--pv-apagado)]">{s.etiqueta}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {cartaProximas}
        {cartaDocumentos(true)}
      </div>
    </>
  );

  const seccionProceso = (
    <>
      <TituloSeccion
        titulo="Proceso de venta"
        detalle="Las cuatro etapas de la venta de tu casa y en cuál estamos."
      />
      <Carta className="mt-4">
        <div className="grid gap-0 px-5 pb-6 pt-6 sm:px-6 lg:grid-cols-4 lg:gap-2">
          {PASOS.map((paso, i) => (
            <PasoTimeline key={paso.titulo} paso={paso} ultimo={i === PASOS.length - 1} />
          ))}
        </div>
      </Carta>
    </>
  );

  const seccionVisitas = (
    <>
      <TituloSeccion
        titulo="Visitas"
        detalle="Tu asesora agenda cada visita y te la recordamos por WhatsApp el día antes."
      />
      <div className="mt-4 grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        {cartaProximas}
        {cartaRealizadas}
      </div>
    </>
  );

  const seccionDocumentos = (
    <>
      <TituloSeccion
        titulo="Documentos"
        detalle="Tus contratos con nosotros y la documentación de la venta, a medida que va llegando."
      />
      <div className="mt-4 grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        {cartaContratos}
        {cartaDocumentos(false)}
      </div>
    </>
  );

  const seccionNotaria = (
    <>
      <TituloSeccion
        titulo="Notaría y firma"
        detalle="El último paso de la venta. De la coordinación nos encargamos nosotros."
      />
      <div className="mt-4 grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        <Carta>
          <div className="px-5 py-5 sm:px-6">
            <ChipEstado>Aún sin fecha</ChipEstado>
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--pv-texto2)]">
              La notaría se designa cuando hay comprador y arras firmadas. Cuando llegue el
              momento lo coordinaremos todo — notaría, fecha y hora — y lo verás aquí con
              tiempo de sobra.
            </p>
            <dl className="mt-5 space-y-2.5 border-t border-[var(--pv-linea)] pt-5 text-[13.5px]">
              {[
                ["Notaría", "Por designar"],
                ["Fecha", "--/--/----"],
                ["Hora", "--:--"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center gap-2.5 text-[var(--pv-apagado)]">
                  {k === "Notaría" ? (
                    <MapPin className="h-4 w-4 text-[var(--pv-tenue)]" />
                  ) : k === "Fecha" ? (
                    <CalendarDays className="h-4 w-4 text-[var(--pv-tenue)]" />
                  ) : (
                    <Clock className="h-4 w-4 text-[var(--pv-tenue)]" />
                  )}
                  <dt className="w-16 text-[var(--pv-tenue)]">{k}</dt>
                  <dd className="tabular-nums text-[var(--pv-texto)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Carta>
        <Carta>
          <div className="px-5 py-5 sm:px-6">
            <h3 className={`${DISPLAY} text-[15px] font-semibold text-[var(--pv-texto)]`}>
              El día de la firma
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--pv-apagado)]">
              Solo tendrás que llevar tres cosas — te lo recordaremos unos días antes:
            </p>
            <ul className="mt-4 space-y-3">
              {["Tu DNI en vigor", "Las llaves de la vivienda", "Los últimos recibos (IBI y comunidad)"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-[13.5px] text-[var(--pv-texto2)]">
                    <CheckVerde />
                    {item}
                  </li>
                ),
              )}
            </ul>
            <p className="mt-5 flex items-start gap-2 rounded-xl bg-[var(--pv-carta2)] px-3.5 py-2.5 text-[12px] leading-relaxed text-[var(--pv-apagado)]">
              <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pv-acento)]" />
              Ariadna estará contigo el día de la firma.
            </p>
          </div>
        </Carta>
      </div>
    </>
  );

  const seccionPropiedad = (
    <>
      <TituloSeccion
        titulo="Mi propiedad"
        detalle="Tu anuncio: cómo lo hemos preparado y dónde lo estamos moviendo."
      />
      <div className="mt-4 grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Carta className="overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={propiedad.foto}
            alt={propiedad.direccion}
            width={960}
            height={540}
            className="h-[220px] w-full object-cover"
          />
          <div className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6">
            <div className="min-w-0 flex-1 max-sm:basis-full">
              <p className={`${DISPLAY} truncate text-[15.5px] font-semibold text-[var(--pv-texto)]`}>
                {propiedad.direccion}
              </p>
              <p className="text-[12.5px] text-[var(--pv-apagado)]">
                {propiedad.municipio} · REF. {propiedad.ref}
              </p>
            </div>
            <button
              type="button"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--pv-linea2)] px-4 py-2.5 text-[13px] font-semibold text-[var(--pv-texto)] transition-colors hover:border-[var(--pv-acento)]/60 hover:text-[var(--pv-acento)] max-sm:w-full"
            >
              Ver mi anuncio
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </Carta>
        <Carta>
          <div className="px-5 py-5 sm:px-6">
            <h3 className={`${DISPLAY} text-[15px] font-semibold text-[var(--pv-texto)]`}>
              El reportaje
            </h3>
            <ul className="mt-4 space-y-3">
              {propiedad.reportaje.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13.5px] text-[var(--pv-texto2)]">
                  <CheckVerde />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Carta>
      </div>
    </>
  );

  const SECCIONES: Record<Seccion, ReactNode> = {
    resumen: seccionResumen,
    proceso: seccionProceso,
    visitas: seccionVisitas,
    documentos: seccionDocumentos,
    notaria: seccionNotaria,
    propiedad: seccionPropiedad,
  };

  return (
    <div
      data-tema={tema}
      className="pv min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[var(--pv-fondo)] text-[var(--pv-texto)] antialiased transition-colors duration-300"
    >
      <style>{`
        .pv{
          --pv-fondo:#060A09;
          --pv-carta:rgba(255,255,255,0.03);
          --pv-carta2:rgba(255,255,255,0.055);
          --pv-linea:rgba(255,255,255,0.08);
          --pv-linea2:rgba(255,255,255,0.16);
          --pv-texto:#EDF2EF;
          --pv-texto2:#B7C4BE;
          --pv-apagado:#8FA39B;
          --pv-tenue:#5C6B65;
          --pv-acento:#34D399;
          --pv-acento2:#14B8A6;
          --pv-tinta-acento:#052E22;
          --pv-acento-suave:rgba(52,211,153,0.10);
          --pv-ambar:#FBBF24;
          --pv-brillo:rgba(20,184,166,0.35);
          --pv-sombra:none;
        }
        .pv[data-tema="claro"]{
          --pv-fondo:#F3F6F4;
          --pv-carta:#FFFFFF;
          --pv-carta2:#EDF2EF;
          --pv-linea:rgba(9,26,20,0.10);
          --pv-linea2:rgba(9,26,20,0.20);
          --pv-texto:#0C1613;
          --pv-texto2:#33433C;
          --pv-apagado:#5D6F67;
          --pv-tenue:#8FA098;
          --pv-acento:#0E9F72;
          --pv-acento2:#0E8C86;
          --pv-tinta-acento:#FFFFFF;
          --pv-acento-suave:rgba(14,159,114,0.10);
          --pv-ambar:#B45309;
          --pv-brillo:rgba(14,159,114,0.22);
          --pv-sombra:0 1px 2px rgba(9,26,20,0.05), 0 12px 32px -16px rgba(9,26,20,0.14);
        }
        /* El wordmark oficial es blanco: en claro se pinta al negro de marca */
        .pv[data-tema="claro"] .pv-logo{ filter:brightness(0) opacity(0.88); }
        /* La web justifica los párrafos globalmente; en un panel (columnas
           estrechas, móvil) el justificado abre huecos — aquí, a la izquierda */
        .pv p{ text-align:left; }
        /* Carrusel de secciones en móvil sin barra de scroll visible */
        .pv-navmovil{ scrollbar-width:none; }
        .pv-navmovil::-webkit-scrollbar{ display:none; }
        /* Mientras el panel está montado: sin rebote elástico al forzar el
           scroll (macOS) y hueco de scrollbar reservado para que cambiar de
           sección (alturas distintas) no desplace la página en horizontal */
        html:has(.pv){ overscroll-behavior:none; scrollbar-gutter:stable; }
      `}</style>

      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        {/* ------------------------------------------------ barra lateral */}
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-[var(--pv-linea)] px-5 py-7 lg:flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="The Vila Home" width={327} height={104} className="pv-logo ml-4 h-10 w-auto self-start" />

          <nav className="mt-9 space-y-1">
            {MENU.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSeccion(item.key)}
                aria-current={seccion === item.key ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors ${
                  seccion === item.key
                    ? "bg-[var(--pv-acento-suave)] text-[var(--pv-acento)]"
                    : "text-[var(--pv-apagado)] hover:bg-[var(--pv-carta2)] hover:text-[var(--pv-texto)]"
                }`}
              >
                {item.icono}
                <span className="flex-1 text-left">{item.etiqueta}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto">{tarjetaAsesora}</div>
        </aside>

        {/* ------------------------------------------------------- principal */}
        <main className="min-w-0 flex-1 px-4 pb-5 sm:px-6 lg:px-8">
          {/* Cabecera + navegación FIJAS al hacer scroll (escritorio y móvil):
              siempre se ve de qué casa se habla y se puede cambiar de sección
              sin volver arriba. Fondo opaco para tapar lo que pasa por debajo */}
          <div className="sticky top-0 z-30 -mx-4 bg-[var(--pv-fondo)] px-4 pb-3 pt-4 transition-colors duration-300 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 lg:pt-5">
          {/* cabecera — en móvil dos filas (logo + controles / inmueble) para
              que la dirección nunca se trunque peleando con el wordmark */}
          <header className="flex flex-wrap items-center gap-x-4 gap-y-0 rounded-2xl border border-[var(--pv-linea)] bg-[var(--pv-carta)] p-4 [box-shadow:var(--pv-sombra)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="The Vila Home" width={327} height={104} className="pv-logo h-7 w-auto lg:hidden" />
            {/* Sin miniatura a propósito: la foto del inmueble ya está en «Mi
                propiedad». Con más de una casa en venta, la dirección es un
                desplegable para cambiar de inmueble sin salir */}
            <div className="relative mt-1 min-w-0 flex-1 max-lg:order-last max-lg:mt-4 max-lg:basis-full max-lg:border-t max-lg:border-[var(--pv-linea)] max-lg:pt-4 lg:mt-0">
              <button
                type="button"
                onClick={() => setSelectorAbierto((v) => !v)}
                aria-expanded={selectorAbierto}
                aria-label="Cambiar de inmueble"
                className="group flex w-full min-w-0 items-center gap-2 text-left"
              >
                <span className="min-w-0 flex-1">
                  {/* Calle y municipio en la misma línea (si no cabe, se corta el
                      final); el estado va solo, debajo del todo. Sin referencia:
                      al propietario no le dice nada */}
                  <span className="block truncate">
                    <span className={`${DISPLAY} text-[16px] font-semibold tracking-[-0.01em] text-[var(--pv-texto)] sm:text-[17px]`}>
                      {propiedad.direccion}
                    </span>
                    <span className="text-[13px] text-[var(--pv-apagado)]"> · {propiedad.municipio}</span>
                  </span>
                  <span className="mt-1.5 block">
                    <ChipEstado>En venta</ChipEstado>
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[var(--pv-tenue)] transition-transform duration-200 group-hover:text-[var(--pv-acento)] ${selectorAbierto ? "rotate-180" : ""}`}
                />
              </button>

              {selectorAbierto ? (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSelectorAbierto(false)} aria-hidden />
                  <div className="absolute left-0 top-full z-20 mt-2 w-full max-w-[380px] overflow-hidden rounded-2xl border border-[var(--pv-linea)] bg-[var(--pv-fondo)] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.45)]">
                    <p className="px-4 pb-1 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--pv-tenue)]">
                      Tus casas en venta
                    </p>
                    {PROPIEDADES.map((p, i) => (
                      <button
                        key={p.ref}
                        type="button"
                        onClick={() => {
                          setPropIdx(i);
                          setSelectorAbierto(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--pv-carta2)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.foto}
                          alt=""
                          width={80}
                          height={80}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-medium text-[var(--pv-texto)]">
                            {p.direccion}
                          </span>
                          <span className="block text-[12px] text-[var(--pv-apagado)]">
                            {p.municipio} · REF. {p.ref}
                          </span>
                        </span>
                        {i === propIdx ? (
                          <Check className="h-4 w-4 shrink-0 text-[var(--pv-acento)]" strokeWidth={3} />
                        ) : null}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={cambiarTema}
                aria-label={tema === "oscuro" ? "Ver en claro" : "Ver en oscuro"}
                title={tema === "oscuro" ? "Ver en claro" : "Ver en oscuro"}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pv-linea)] text-[var(--pv-apagado)] transition-colors hover:border-[var(--pv-acento)]/50 hover:text-[var(--pv-acento)]"
              >
                {tema === "oscuro" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </button>
              <button
                type="button"
                onClick={() => setNovedades(false)}
                aria-label={novedades ? "Notificaciones — hay novedades" : "Notificaciones"}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pv-linea)] text-[var(--pv-apagado)] transition-colors hover:border-[var(--pv-acento)]/50 hover:text-[var(--pv-acento)]"
              >
                <Bell className="h-[18px] w-[18px]" />
                {novedades ? (
                  <span aria-hidden className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--pv-acento)] ring-2 ring-[var(--pv-fondo)]" />
                ) : null}
              </button>
              <div className="ml-1 hidden items-center gap-2.5 sm:flex">
                <span
                  className={`${DISPLAY} flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold text-[var(--pv-tinta-acento)]`}
                  style={{ background: GRAD }}
                >
                  {VENDEDOR.iniciales}
                </span>
                <span>
                  <span className="block text-[13.5px] font-semibold leading-tight text-[var(--pv-texto)]">
                    {VENDEDOR.nombre}
                  </span>
                  <span className="block text-[11.5px] text-[var(--pv-apagado)]">Vendedor</span>
                </span>
              </div>
            </div>
          </header>

          {/* navegación de secciones en móvil (la barra lateral no cabe) */}
          <div className="pv-navmovil mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {MENU.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSeccion(item.key)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
                  seccion === item.key
                    ? "border-transparent bg-[var(--pv-acento-suave)] text-[var(--pv-acento)]"
                    : "border-[var(--pv-linea)] text-[var(--pv-apagado)]"
                }`}
              >
                {item.etiqueta}
              </button>
            ))}
          </div>
          </div>

          {SECCIONES[seccion]}

          {/* En móvil no hay barra lateral: la asesora va al pie de la página */}
          <div className="mt-5 lg:hidden">{tarjetaAsesora}</div>

          <p className="py-6 text-center text-[11px] tracking-[0.08em] text-[var(--pv-tenue)]">
            PROTOTIPO · DATOS DE EJEMPLO · THE VILA HOME
          </p>
        </main>
      </div>
    </div>
  );
}

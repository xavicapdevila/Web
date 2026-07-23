/**
 * Informe descargable en PDF — dossier visual estilo consultora:
 * portada con logo y arco de nota, cabecera de marca en cada página, chips de
 * KPIs, radar de indicadores, gráfica de horquilla con el precio marcado,
 * porqués por indicador, plan numerado, timeline de 30 días y checklists a dos
 * columnas. Poca letra, mucha estructura.
 *
 * REGLA DE ORO: el aviso de que esto es orientativo (sin dirección exacta,
 * sin visita, puede variar → por eso alguien del equipo debe verla) aparece
 * en la portada, en el resumen ejecutivo Y en el pie de todas las páginas.
 */

import type { jsPDF } from "jspdf";
import {
  ETIQUETA_ESTADO,
  ETIQUETA_HORIZONTE,
  ETIQUETA_INDICADOR,
  ETIQUETA_NIVEL_RIESGO,
  ETIQUETA_POSICION_PRECIO,
  ETIQUETA_TIEMPO_ANUNCIADO,
  ETIQUETA_TIPO,
} from "@/lib/diagnostico/etiquetas";
import {
  AVISO_ORIENTATIVO,
  CHECKLIST_PUESTA_A_PUNTO,
  ERRORES_FRECUENTES,
  FRASE_PRECIO_MOVIMIENTO,
  METODO_TVH,
  QUE_MIDE_INDICADOR,
  construirPrimerosTreintaDias,
  textoHorquilla,
} from "@/lib/diagnostico/plantillas";
import { nombresUbicacion } from "@/lib/diagnostico/referencias-mock";
import type { DatosContacto, Indicadores, ResultadoDiagnostico } from "@/lib/diagnostico/tipos";

const ANCHO = 595.28; // A4 en pt
const ALTO = 841.89;
const MARGEN = 54;
const ANCHO_UTIL = ANCHO - MARGEN * 2;
const PIE_ALTURA = 44;
const BANDA_ALTURA = 30;

const TINTA: [number, number, number] = [38, 38, 38];
const GRIS: [number, number, number] = [116, 124, 120];
const VERDE: [number, number, number] = [16, 122, 99];
const VERDE_CLARO: [number, number, number] = [52, 211, 153];
const VERDE_SUAVE: [number, number, number] = [213, 240, 230];
const AMBAR: [number, number, number] = [176, 129, 43];
const CORAL: [number, number, number] = [163, 74, 58];
const LINEA: [number, number, number] = [224, 228, 225];
const FONDO_SUAVE: [number, number, number] = [244, 247, 245];
const OSCURO: [number, number, number] = [6, 10, 9];

function colorNivel(valor: number, invertido: boolean): [number, number, number] {
  const bueno = invertido ? valor <= 33 : valor >= 70;
  const regular = invertido ? valor <= 62 : valor >= 45;
  return bueno ? VERDE : regular ? AMBAR : CORAL;
}

/** El logo SVG convertido a PNG vía canvas (jsPDF no incrusta SVG directo) */
async function cargarLogoPng(): Promise<string | null> {
  try {
    const respuesta = await fetch("/logo.svg");
    const svg = await respuesta.text();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const imagen = new Image();
    await new Promise<void>((carga, fallo) => {
      imagen.onload = () => carga();
      imagen.onerror = () => fallo(new Error("logo"));
      imagen.src = url;
    });
    const lienzo = document.createElement("canvas");
    lienzo.width = 656;
    lienzo.height = 208;
    lienzo.getContext("2d")!.drawImage(imagen, 0, 0, 656, 208);
    URL.revokeObjectURL(url);
    return lienzo.toDataURL("image/png");
  } catch {
    return null;
  }
}

export async function descargarInformePdf(
  resultado: ResultadoDiagnostico,
  contacto: DatosContacto | null,
): Promise<void> {
  const { jsPDF: JsPdf } = await import("jspdf");
  const logo = await cargarLogoPng();
  const doc: jsPDF = new JsPdf({ unit: "pt", format: "a4" });
  const r = resultado.respuestas;
  const nombres = nombresUbicacion(r);
  const ubicacion =
    nombres.zona === nombres.municipio ? nombres.municipio : `${nombres.zona}, ${nombres.municipio}`;
  const fecha = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  const viviendaCorta = `${ETIQUETA_TIPO[r.tipo]} · ${r.superficie} m² · ${ubicacion}`;

  let y = 0;

  /* ── Maquetación base ── */

  const nuevaPagina = () => {
    doc.addPage();
    doc.setFillColor(...OSCURO);
    doc.rect(0, 0, ANCHO, BANDA_ALTURA, "F");
    if (logo) doc.addImage(logo, "PNG", MARGEN, 7.5, 48, 15.2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(150, 162, 156);
    doc.text("DIAGNÓSTICO INICIAL DE SALIDA AL MERCADO", MARGEN + ANCHO_UTIL, 19, {
      align: "right",
      charSpace: 0.8,
    });
    // OJO: jsPDF deja el charSpace pegado como estado global — resetear SIEMPRE
    doc.setCharSpace(0);
    y = BANDA_ALTURA + 34;
  };

  const saltoSiHaceFalta = (altura: number) => {
    if (y + altura > ALTO - PIE_ALTURA - 14) nuevaPagina();
  };

  const tituloSeccion = (texto: string) => {
    // Reserva título + un par de líneas: un título nunca queda huérfano al pie
    saltoSiHaceFalta(96);
    // Separación uniforme entre secciones; ajustada si arranca página
    const alPrincipioDePagina = y <= BANDA_ALTURA + 40;
    y += alPrincipioDePagina ? 6 : 30;
    doc.setDrawColor(...VERDE_CLARO);
    doc.setLineWidth(2.5);
    doc.line(MARGEN, y - 7, MARGEN + 22, y - 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(...TINTA);
    doc.text(texto, MARGEN, y + 8);
    y += 26;
  };

  const parrafo = (
    texto: string,
    opciones?: { negrita?: boolean; color?: [number, number, number]; tamano?: number; sangria?: number; salto?: number },
  ) => {
    const tamano = opciones?.tamano ?? 9.5;
    const sangria = opciones?.sangria ?? 0;
    doc.setFont("helvetica", opciones?.negrita ? "bold" : "normal");
    doc.setFontSize(tamano);
    doc.setTextColor(...(opciones?.color ?? TINTA));
    const lineas = doc.splitTextToSize(texto, ANCHO_UTIL - sangria) as string[];
    const altura = lineas.length * tamano * 1.38;
    saltoSiHaceFalta(altura);
    doc.text(lineas, MARGEN + sangria, y, { lineHeightFactor: 1.38 });
    y += altura + (opciones?.salto ?? 4);
  };

  const cajaAviso = (texto: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const lineas = doc.splitTextToSize(texto, ANCHO_UTIL - 28) as string[];
    const altura = lineas.length * 8.5 * 1.4 + 22;
    saltoSiHaceFalta(altura + 8);
    doc.setFillColor(...FONDO_SUAVE);
    doc.setDrawColor(...VERDE_CLARO);
    doc.setLineWidth(1);
    doc.roundedRect(MARGEN, y - 4, ANCHO_UTIL, altura, 6, 6, "FD");
    doc.setTextColor(...TINTA);
    doc.text(lineas, MARGEN + 14, y + 13, { lineHeightFactor: 1.4 });
    y += altura + 10;
  };

  /** Texto con barra de color a la izquierda (fortalezas / a revisar) */
  const itemConBarra = (texto: string, color: [number, number, number]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const lineas = doc.splitTextToSize(texto, ANCHO_UTIL - 14) as string[];
    const altura = lineas.length * 9.5 * 1.38;
    saltoSiHaceFalta(altura + 8);
    doc.setFillColor(...color);
    doc.roundedRect(MARGEN, y - 7, 3, altura + 2, 1.5, 1.5, "F");
    doc.setTextColor(...TINTA);
    doc.text(lineas, MARGEN + 14, y, { lineHeightFactor: 1.38 });
    y += altura + 8;
  };

  const filaDato = (etiqueta: string, valor: string) => {
    saltoSiHaceFalta(20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GRIS);
    doc.text(etiqueta, MARGEN, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...TINTA);
    const lineas = doc.splitTextToSize(valor, ANCHO_UTIL - 168) as string[];
    doc.text(lineas, MARGEN + 168, y, { lineHeightFactor: 1.35 });
    const alto = Math.max(1, lineas.length) * 12.5;
    doc.setDrawColor(...LINEA);
    doc.setLineWidth(0.5);
    doc.line(MARGEN, y + alto - 6, MARGEN + ANCHO_UTIL, y + alto - 6);
    y += alto + 6;
  };

  /** Checklist a dos columnas con casillas dibujadas */
  const checklistDosColumnas = (items: string[]) => {
    const anchoCol = (ANCHO_UTIL - 18) / 2;
    const mitad = Math.ceil(items.length / 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    const filas: { izq: string[]; der: string[] }[] = [];
    for (let i = 0; i < mitad; i++) {
      filas.push({
        izq: doc.splitTextToSize(items[i] ?? "", anchoCol - 16) as string[],
        der: doc.splitTextToSize(items[i + mitad] ?? "", anchoCol - 16) as string[],
      });
    }
    const alturaTotal = filas.reduce(
      (suma, f) => suma + Math.max(f.izq.length, f.der.length) * 8.8 * 1.35 + 7,
      0,
    );
    saltoSiHaceFalta(alturaTotal + 6);
    filas.forEach((fila) => {
      const altura = Math.max(fila.izq.length, fila.der.length) * 8.8 * 1.35;
      [
        { lineas: fila.izq, x: MARGEN },
        { lineas: fila.der, x: MARGEN + anchoCol + 18 },
      ].forEach(({ lineas, x }) => {
        if (lineas.length === 0 || lineas[0] === "") return;
        doc.setDrawColor(...VERDE);
        doc.setLineWidth(0.9);
        doc.rect(x, y - 6.5, 7, 7, "S");
        doc.setTextColor(...TINTA);
        doc.text(lineas, x + 13, y, { lineHeightFactor: 1.35 });
      });
      y += altura + 7;
    });
    y += 4;
  };

  /** Arco parcial para la nota: segmentos cortos desde arriba, sentido horario */
  const dibujarArco = (
    cx: number,
    cy: number,
    radio: number,
    fraccion: number,
    color: [number, number, number],
    grosor: number,
  ) => {
    const desde = -Math.PI / 2;
    const hasta = desde + 2 * Math.PI * Math.max(0.02, Math.min(1, fraccion));
    doc.setDrawColor(...color);
    doc.setLineWidth(grosor);
    doc.setLineCap("round");
    const pasos = Math.max(8, Math.ceil((hasta - desde) / 0.05));
    let px = cx + radio * Math.cos(desde);
    let py = cy + radio * Math.sin(desde);
    for (let i = 1; i <= pasos; i++) {
      const angulo = desde + ((hasta - desde) * i) / pasos;
      const x = cx + radio * Math.cos(angulo);
      const yy = cy + radio * Math.sin(angulo);
      doc.line(px, py, x, yy);
      px = x;
      py = yy;
    }
    doc.setLineCap("butt");
  };

  /* ══ PORTADA ══ */
  doc.setFillColor(...OSCURO);
  doc.rect(0, 0, ANCHO, ALTO, "F");

  if (logo) {
    // Arriba a la derecha, un punto más discreto
    doc.addImage(logo, "PNG", ANCHO - MARGEN - 160, 54, 160, 50.7);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text("THE VILA HOME", ANCHO - MARGEN, 84, { charSpace: 3, align: "right" });
    doc.setCharSpace(0);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...VERDE_CLARO);
  doc.text("DIAGNÓSTICO INICIAL DE SALIDA AL MERCADO", MARGEN, 158, { charSpace: 1.2 });
  doc.setCharSpace(0);

  doc.setFontSize(30);
  doc.setTextColor(240, 245, 242);
  const tituloPortada = doc.splitTextToSize("Así saldría hoy tu vivienda al mercado.", ANCHO_UTIL) as string[];
  doc.text(tituloPortada, MARGEN, 198, { lineHeightFactor: 1.22 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(170, 185, 178);
  doc.text(viviendaCorta, MARGEN, 274);

  const cx = ANCHO / 2;
  const cy = 436;
  doc.setDrawColor(30, 42, 38);
  doc.setLineWidth(10);
  doc.circle(cx, cy, 78, "S");
  dibujarArco(cx, cy, 78, resultado.puntuacionGeneral / 100, VERDE_CLARO, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(56);
  doc.setTextColor(240, 245, 242);
  doc.text(String(resultado.puntuacionGeneral), cx, cy + 12, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120, 135, 128);
  doc.text("DE 100", cx, cy + 34, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(170, 185, 178);
  doc.text(
    `Riesgo de estancamiento: ${ETIQUETA_NIVEL_RIESGO[resultado.nivelRiesgo]}   ·   Precio: ${ETIQUETA_POSICION_PRECIO[resultado.posicionPrecio]}`,
    cx,
    cy + 128,
    { align: "center" },
  );

  doc.setFontSize(10);
  doc.setTextColor(150, 162, 156);
  doc.text(
    `${contacto ? `Preparado para ${contacto.nombre}` : "Informe personalizado"} · ${fecha}`,
    MARGEN,
    ALTO - 118,
  );
  doc.setFontSize(8.5);
  doc.setTextColor(110, 122, 116);
  doc.text(
    doc.splitTextToSize(
      "Informe orientativo, elaborado sin conocer la dirección exacta y sin visita al inmueble. La lectura puede variar tras la visita de una persona del equipo.",
      ANCHO_UTIL,
    ) as string[],
    MARGEN,
    ALTO - 98,
    { lineHeightFactor: 1.4 },
  );
  doc.setTextColor(90, 102, 96);
  doc.text(`Ref. ${resultado.id} · versión del algoritmo ${resultado.version}`, MARGEN, ALTO - 60);

  /* ══ RESUMEN EJECUTIVO ══ */
  nuevaPagina();
  tituloSeccion("Resumen ejecutivo");

  // Chips de KPIs: nota, riesgo y posición del precio de un vistazo
  {
    const chips: { etiqueta: string; valor: string; color: [number, number, number] }[] = [
      {
        etiqueta: "NOTA DE SALIDA",
        valor: `${resultado.puntuacionGeneral} / 100`,
        color: colorNivel(resultado.puntuacionGeneral, false),
      },
      {
        etiqueta: "RIESGO DE ESTANCAMIENTO",
        valor: ETIQUETA_NIVEL_RIESGO[resultado.nivelRiesgo],
        color:
          resultado.nivelRiesgo === "bajo" ? VERDE : resultado.nivelRiesgo === "medio" ? AMBAR : CORAL,
      },
      {
        etiqueta: "TU PRECIO",
        valor: ETIQUETA_POSICION_PRECIO[resultado.posicionPrecio],
        color:
          resultado.posicionPrecio === "en-banda"
            ? VERDE
            : resultado.posicionPrecio === "parte-alta"
              ? AMBAR
              : CORAL,
      },
    ];
    const anchoChip = (ANCHO_UTIL - 20) / 3;
    saltoSiHaceFalta(62);
    chips.forEach((chip, i) => {
      const x = MARGEN + i * (anchoChip + 10);
      doc.setFillColor(...FONDO_SUAVE);
      doc.roundedRect(x, y - 4, anchoChip, 52, 6, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.8);
      doc.setTextColor(...GRIS);
      doc.text(chip.etiqueta, x + 12, y + 10, { charSpace: 0.5 });
      doc.setCharSpace(0);
      doc.setFontSize(14);
      doc.setTextColor(...chip.color);
      doc.text(chip.valor, x + 12, y + 32);
    });
    y += 64;
  }

  parrafo(
    `Tu ${ETIQUETA_TIPO[r.tipo].toLowerCase()} en ${ubicacion} sale con buena parte del trabajo identificado: este informe recoge qué juega a favor, qué conviene revisar, a quién le encaja y el plan que seguiríamos para salir bien a la primera.`,
    { salto: 8 },
  );
  cajaAviso(AVISO_ORIENTATIVO);

  tituloSeccion("Lo que nos has contado");
  filaDato("Vivienda", viviendaCorta);
  filaDato(
    "Distribución",
    `${r.habitaciones === 0 ? "Estudio" : `${r.habitaciones} habitaciones`} · ${r.banos} ${r.banos === 1 ? "baño" : "baños"}${
      r.tipo === "piso" || r.tipo === "atico" ? ` · ${r.ascensor === "si" ? "con ascensor" : "sin ascensor"}` : ""
    }`,
  );
  filaDato("Estado", ETIQUETA_ESTADO[r.estado]);
  filaDato("Extras", r.caracteristicas.length > 0 ? r.caracteristicas.join(", ") : "Sin extras destacados");
  filaDato("Precio esperado", `${r.precioEsperado.toLocaleString("es-ES")} €`);
  filaDato(
    "Situación",
    r.yaAnunciado === "si"
      ? `Ya anunciada (${r.tiempoAnunciado ? ETIQUETA_TIEMPO_ANUNCIADO[r.tiempoAnunciado].toLowerCase() : "tiempo sin indicar"})`
      : "Sin anunciar",
  );
  filaDato("Horizonte de venta", ETIQUETA_HORIZONTE[r.horizonte]);

  /* ══ INDICADORES ══ */
  // Flujo continuo: sin saltos de página forzados, que dejan medias páginas
  // en blanco; saltoSiHaceFalta ya evita títulos huérfanos.
  tituloSeccion("Los cinco indicadores, de un vistazo");
  {
    const etiquetasRadar = ["Demanda", "Atractivo", "Precio", "Preparación", "Bajo riesgo"];
    const valoresRadar = [
      resultado.indicadores.encajeDemanda,
      resultado.indicadores.atractivo,
      resultado.indicadores.competitividadPrecio,
      resultado.indicadores.preparacion,
      100 - resultado.indicadores.riesgoEstancamiento,
    ];
    const R = 86;
    saltoSiHaceFalta(2 * R + 64);
    const cxR = ANCHO / 2;
    const cyR = y + R + 20;
    const punto = (i: number, fraccion: number): [number, number] => {
      const angulo = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return [cxR + R * fraccion * Math.cos(angulo), cyR + R * fraccion * Math.sin(angulo)];
    };

    const vertices = valoresRadar.map((v, i) => punto(i, Math.max(0.05, v / 100)));
    doc.setFillColor(...VERDE_SUAVE);
    doc.lines(
      vertices.slice(1).concat([vertices[0]]).map((p, i) => {
        const previo = i === 0 ? vertices[0] : vertices[i];
        return [p[0] - previo[0], p[1] - previo[1]];
      }),
      vertices[0][0],
      vertices[0][1],
      [1, 1],
      "F",
      true,
    );

    doc.setDrawColor(...LINEA);
    doc.setLineWidth(0.75);
    [0.33, 0.66, 1].forEach((f) => {
      for (let i = 0; i < 5; i++) {
        const [x1, y1] = punto(i, f);
        const [x2, y2] = punto((i + 1) % 5, f);
        doc.line(x1, y1, x2, y2);
      }
    });
    for (let i = 0; i < 5; i++) {
      const [x2, y2] = punto(i, 1);
      doc.line(cxR, cyR, x2, y2);
    }

    doc.setDrawColor(...VERDE);
    doc.setLineWidth(1.5);
    for (let i = 0; i < 5; i++) {
      const [x1, y1] = vertices[i];
      const [x2, y2] = vertices[(i + 1) % 5];
      doc.line(x1, y1, x2, y2);
    }
    doc.setFillColor(...VERDE);
    vertices.forEach(([vx, vy]) => doc.circle(vx, vy, 2.2, "F"));

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...GRIS);
    etiquetasRadar.forEach((etiqueta, i) => {
      const [ex, ey] = punto(i, 1.17);
      doc.text(`${etiqueta} · ${valoresRadar[i]}`, ex, ey + 2, { align: "center" });
    });

    y = cyR + R + 32;
  }

  tituloSeccion("Cada indicador, explicado");
  (Object.keys(ETIQUETA_INDICADOR) as (keyof Indicadores)[]).forEach((clave) => {
    const valor = resultado.indicadores[clave];
    const invertido = clave === "riesgoEstancamiento";
    saltoSiHaceFalta(92);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...TINTA);
    doc.text(ETIQUETA_INDICADOR[clave], MARGEN, y);
    doc.setTextColor(...colorNivel(valor, invertido));
    doc.text(`${valor} / 100`, MARGEN + ANCHO_UTIL - doc.getTextWidth(`${valor} / 100`), y);
    doc.setFillColor(...LINEA);
    doc.roundedRect(MARGEN, y + 6, ANCHO_UTIL, 5, 2.5, 2.5, "F");
    doc.setFillColor(...colorNivel(valor, invertido));
    doc.roundedRect(MARGEN, y + 6, Math.max(10, (ANCHO_UTIL * valor) / 100), 5, 2.5, 2.5, "F");
    y += 22;
    parrafo(QUE_MIDE_INDICADOR[clave], { color: GRIS, tamano: 8.2, salto: 3 });
    parrafo(resultado.lecturaIndicadores[clave], { negrita: true, tamano: 9.5, salto: 3 });
    (resultado.porques?.[clave] ?? []).forEach((motivo) =>
      parrafo(`·  ${motivo}`, { tamano: 8.8, sangria: 8, salto: 2, color: TINTA }),
    );
    y += 10;
  });

  /* ══ ANÁLISIS ══ */
  tituloSeccion("Tu zona y tu precio");
  resultado.explicacion.slice(0, 2).forEach((p) => parrafo(p, { salto: 6 }));

  // Horquilla con gráfica y el precio esperado marcado
  saltoSiHaceFalta(128);
  doc.setFillColor(...FONDO_SUAVE);
  doc.roundedRect(MARGEN, y - 4, ANCHO_UTIL, 118, 6, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...VERDE);
  doc.text("HORQUILLA ORIENTATIVA DE SALIDA", MARGEN + 14, y + 12, { charSpace: 0.8 });
  doc.setCharSpace(0);
  doc.setFontSize(17);
  doc.setTextColor(...TINTA);
  doc.text(
    `${resultado.horquillaSalida.inferior.toLocaleString("es-ES")} €  —  ${resultado.horquillaSalida.superior.toLocaleString("es-ES")} €`,
    MARGEN + 14,
    y + 34,
  );
  {
    const { inferior, superior } = resultado.horquillaSalida;
    const minEje = inferior * 0.82;
    const maxEje = superior * 1.18;
    const x0 = MARGEN + 24;
    const x1 = MARGEN + ANCHO_UTIL - 24;
    const aX = (valor: number) =>
      x0 + ((Math.min(Math.max(valor, minEje), maxEje) - minEje) / (maxEje - minEje)) * (x1 - x0);
    const yEje = y + 68;
    doc.setDrawColor(...LINEA);
    doc.setLineWidth(4);
    doc.setLineCap("round");
    doc.line(x0, yEje, x1, yEje);
    doc.setDrawColor(...VERDE);
    doc.line(aX(inferior), yEje, aX(superior), yEje);
    doc.setLineCap("butt");
    // Sin marca de precio: la gráfica enseña SOLO la horquilla (decisión de Xavi)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRIS);
    doc.text(inferior.toLocaleString("es-ES") + " €", aX(inferior), yEje + 14, { align: "center" });
    doc.text(superior.toLocaleString("es-ES") + " €", aX(superior), yEje + 14, { align: "center" });
  }
  y += 128;
  parrafo(textoHorquilla(resultado), { salto: 3 });
  parrafo(
    "La horquilla es el rango de precios en el que se venden viviendas comparables a la tuya en tu zona, ajustado por tipología y estado. Sale de referencias — no de una visita —, así que el precio definitivo de salida se decide con comparables reales, sobre la vivienda vista.",
    { color: GRIS, tamano: 8.5, salto: 8 },
  );
  cajaAviso(FRASE_PRECIO_MOVIMIENTO);

  tituloSeccion("Lo que juega a tu favor");
  resultado.fortalezas.forEach((f) => itemConBarra(f.texto, VERDE));

  tituloSeccion("Lo que conviene revisar");
  resultado.aRevisar.forEach((f) => itemConBarra(f.texto, AMBAR));

  tituloSeccion("A quién le encaja");
  parrafo(resultado.perfilComprador, { salto: 4 });
  parrafo(resultado.explicacion[2] ?? "", { color: GRIS, tamano: 8.8 });

  /* ══ PLAN Y CALENDARIO ══ */
  tituloSeccion("Plan de salida recomendado");
  resultado.planSalida.forEach((paso, i) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    const lineas = doc.splitTextToSize(paso.texto, ANCHO_UTIL - 34) as string[];
    const altura = 14 + lineas.length * 8.8 * 1.38;
    saltoSiHaceFalta(altura + 12);
    doc.setFillColor(...VERDE);
    doc.circle(MARGEN + 9, y - 1, 9, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(String(i + 1), MARGEN + 9, y + 2.2, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(...TINTA);
    doc.text(paso.titulo, MARGEN + 26, y + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    doc.setTextColor(...GRIS);
    doc.text(lineas, MARGEN + 26, y + 16, { lineHeightFactor: 1.38 });
    y += altura + 12;
  });

  tituloSeccion("Los primeros 30 días");
  {
    const semanas = construirPrimerosTreintaDias(resultado);
    semanas.forEach((s, i) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.8);
      const lineas = doc.splitTextToSize(s.texto, ANCHO_UTIL - 96) as string[];
      const altura = Math.max(20, lineas.length * 8.8 * 1.38 + 6);
      saltoSiHaceFalta(altura + 8);
      // Línea vertical del timeline + punto
      if (i < semanas.length - 1) {
        doc.setDrawColor(...LINEA);
        doc.setLineWidth(1.2);
        doc.line(MARGEN + 4, y + 2, MARGEN + 4, y + altura + 6);
      }
      doc.setFillColor(...VERDE);
      doc.circle(MARGEN + 4, y - 2, 3.2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...VERDE);
      doc.text(s.semana, MARGEN + 16, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.8);
      doc.setTextColor(...TINTA);
      doc.text(lineas, MARGEN + 82, y, { lineHeightFactor: 1.38 });
      y += altura + 8;
    });
  }

  /* ══ CHECKLIST Y ERRORES ══ */
  tituloSeccion("Puesta a punto antes de fotos y visitas");
  checklistDosColumnas(CHECKLIST_PUESTA_A_PUNTO);
  // La documentación NO se lista a propósito: la pedimos nosotros si
  // trabajamos juntos (decisión de negocio — no dar deberes al propietario).

  tituloSeccion("Cinco errores que vemos cada semana");
  ERRORES_FRECUENTES.forEach((e, i) => {
    parrafo(`${i + 1}.  ${e.titulo}`, { negrita: true, salto: 2 });
    parrafo(e.texto, { color: GRIS, tamano: 8.8, sangria: 14, salto: 7 });
  });

  /* ══ MÉTODO Y CIERRE ══ */
  tituloSeccion("Así lo haríamos en The Vila Home");
  METODO_TVH.forEach((pieza) => {
    saltoSiHaceFalta(34);
    doc.setFillColor(...VERDE);
    doc.circle(MARGEN + 3, y - 2.5, 2.5, "F");
    parrafo(pieza.titulo, { negrita: true, sangria: 14, salto: 1 });
    parrafo(pieza.texto, { color: GRIS, tamano: 8.8, sangria: 14, salto: 7 });
  });

  tituloSeccion("El siguiente paso");
  parrafo(
    "Una persona del equipo — no un robot — revisará este diagnóstico y te escribirá en menos de un día laborable. El paso natural es una visita sin compromiso: viendo la vivienda afinamos el precio con comparables reales, ajustamos el plan y te decimos con franqueza qué haríamos nosotros.",
    { salto: 8 },
  );
  cajaAviso(AVISO_ORIENTATIVO);
  parrafo("The Vila Home · Vilanova i la Geltrú · thevilahome.com", { color: GRIS, tamano: 8.5 });

  /* ══ PIE EN TODAS LAS PÁGINAS (menos portada) ══ */
  const totalPaginas = doc.getNumberOfPages();
  for (let pagina = 2; pagina <= totalPaginas; pagina++) {
    doc.setPage(pagina);
    doc.setDrawColor(...LINEA);
    doc.setLineWidth(0.5);
    doc.line(MARGEN, ALTO - PIE_ALTURA + 6, MARGEN + ANCHO_UTIL, ALTO - PIE_ALTURA + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRIS);
    doc.text(
      "Informe orientativo — elaborado sin dirección exacta ni visita al inmueble; la lectura puede variar tras la visita del equipo.",
      MARGEN,
      ALTO - PIE_ALTURA + 20,
    );
    doc.text(
      `The Vila Home · Diagnóstico inicial · Ref. ${resultado.id} · pág. ${pagina - 1} de ${totalPaginas - 1}`,
      MARGEN,
      ALTO - PIE_ALTURA + 31,
    );
  }

  doc.save(`diagnostico-thevilahome-${resultado.id}.pdf`);
}

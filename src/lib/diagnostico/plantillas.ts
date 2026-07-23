/**
 * Plantillas de texto del diagnóstico: fortalezas, aspectos a revisar y la
 * explicación personalizada. Todo se decide por reglas deterministas sobre el
 * contexto de cálculo — sin aleatoriedad, sin cifras de mercado, sin promesas.
 *
 * Tono: humano, honesto, sin clichés inmobiliarios. Nunca porcentajes de
 * probabilidad de venta ni precios exactos.
 */

import type { ContextoCalculo } from "./motor";
import { ETIQUETA_CARACTERISTICA, TIPO_EN_FRASE } from "./etiquetas";
import type {
  Factor,
  Indicadores,
  NivelRiesgo,
  PasoPlan,
  PosicionPrecio,
  ResultadoDiagnostico,
} from "./tipos";

interface FactorCandidato extends Factor {
  aplica: boolean;
}

/** Ordena por peso descendente y, a igual peso, por id — orden 100% estable */
function elegir(candidatos: FactorCandidato[], cuantos: number): Factor[] {
  return candidatos
    .filter((c) => c.aplica)
    .sort((a, b) => b.peso - a.peso || a.id.localeCompare(b.id))
    .slice(0, cuantos)
    .map(({ id, texto, peso }) => ({ id, texto, peso }));
}

export function construirFactores(
  ctx: ContextoCalculo,
  indicadores: Indicadores,
): { fortalezas: Factor[]; aRevisar: Factor[] } {
  const r = ctx.respuestas;
  const tiene = (c: string) => r.caracteristicas.includes(c as (typeof r.caracteristicas)[number]);
  const rango = ctx.config.encaje.habitacionesIdeales[r.tipo];

  const fortalezas: FactorCandidato[] = [
    {
      id: "zona-muy-buscada",
      peso: 90,
      aplica: !ctx.esMunicipioDesconocido && ctx.demandaZona >= 75,
      texto: `${ctx.nombreZona} es de las zonas con más búsquedas activas de ${ctx.nombreMunicipio}: hay público esperando ${TIPO_EN_FRASE[r.tipo]} así.`,
    },
    {
      id: "precio-bien-posicionado",
      peso: 88,
      aplica: ctx.ratioPrecio <= 1.0,
      texto: "El precio que tienes en mente entra dentro de la horquilla de precios de la zona: es un punto de partida sano.",
    },
    {
      id: "reformado",
      peso: 85,
      aplica: r.estado === "reformado",
      texto: "Una vivienda reformada se explica sola: menos objeciones en visita y mejor primera impresión.",
    },
    {
      id: "terraza-atico",
      peso: 80,
      aplica: r.tipo === "atico" && tiene("terraza"),
      texto: "Ático con terraza: la combinación más deseada del mercado local, y la más difícil de encontrar.",
    },
    {
      id: "precio-razonable",
      peso: 70,
      aplica: ctx.ratioPrecio > 1.0 && ctx.ratioPrecio <= 1.05,
      texto: "El precio esperado está muy cerca de la horquilla de la zona: con una salida bien preparada, es defendible.",
    },
    {
      id: "buen-estado",
      peso: 65,
      aplica: r.estado === "buen-estado",
      texto: "El buen estado general permite salir al mercado sin obras previas: solo hace falta preparación, no reforma.",
    },
    {
      id: "ascensor",
      peso: 62,
      aplica: ctx.esTipologiaConAscensor && r.ascensor === "si",
      texto: "El ascensor amplía el público: no descarta a compradores de más edad ni a familias con niños pequeños.",
    },
    {
      id: "jardin",
      peso: 60,
      aplica: tiene("jardin"),
      texto: "El jardín es un diferenciador real: pocas viviendas de la zona pueden ofrecerlo.",
    },
    {
      id: "terraza",
      peso: 58,
      aplica: r.tipo !== "atico" && tiene("terraza"),
      texto: "La terraza suma espacio vivible: es de lo primero que filtran los compradores de la comarca.",
    },
    {
      id: "vistas",
      peso: 56,
      aplica: tiene("vistas"),
      texto: "Las vistas despejadas se recuerdan después de la visita: bien fotografiadas, marcan la diferencia.",
    },
    {
      id: "parking",
      peso: 55,
      aplica: tiene("parking"),
      texto: "El parking resuelve una de las objeciones más habituales al comprar en la zona.",
    },
    {
      id: "zona-estable",
      peso: 54,
      aplica: !ctx.esMunicipioDesconocido && ctx.demandaZona >= 60 && ctx.demandaZona < 75,
      texto: `${ctx.nombreZona} mantiene una demanda estable: no es un mercado de espera larga si la salida se hace bien.`,
    },
    {
      id: "sin-historial",
      peso: 52,
      aplica: r.yaAnunciado === "no",
      texto: "La vivienda saldría al mercado sin historial de anuncio: la primera impresión está intacta.",
    },
    {
      id: "habitaciones-demandadas",
      peso: 50,
      aplica: r.habitaciones >= rango.min && r.habitaciones <= rango.max,
      texto: "El número de habitaciones coincide con lo que más se busca en esta tipología.",
    },
    {
      id: "dos-banos",
      peso: 45,
      aplica: r.banos >= 2,
      texto: "Contar con dos baños o más evita uno de los descartes silenciosos más comunes.",
    },
    {
      id: "calendario-claro",
      peso: 42,
      aplica: r.horizonte === "cuanto-antes" || r.horizonte === "3-6-meses",
      texto: "Tener un calendario de venta definido permite planificar la salida en lugar de improvisarla.",
    },
    {
      id: "balcon",
      peso: 40,
      aplica: tiene("balcon"),
      texto: "El balcón aporta luz y exterior: bien presentado, mejora las fotos principales.",
    },
    // Siempre aplicables — garantizan tres fortalezas incluso en el peor caso
    {
      id: "diagnostico-previo",
      peso: 6,
      aplica: true,
      texto: "Llegas con un diagnóstico previo hecho: sales al mercado sabiendo qué revisar, y eso ya es más que la media.",
    },
    {
      id: "mejora-identificada",
      peso: 5,
      aplica: true,
      texto: "Los puntos de mejora están identificados y son concretos: ninguno es irresoluble antes de salir.",
    },
    {
      id: "comarca-activa",
      peso: 4,
      aplica: true,
      texto: "El Garraf mantiene compradores buscando durante todo el año: el mercado no se congela por temporada.",
    },
  ];

  const aRevisar: FactorCandidato[] = [
    {
      id: "precio-muy-por-encima",
      peso: 95,
      aplica: ctx.ratioPrecio > 1.2,
      texto: "El precio esperado queda claramente por encima de la horquilla de la zona: es la primera conversación pendiente.",
    },
    {
      id: "anuncio-quemado",
      peso: 90,
      aplica: r.tiempoAnunciado === "mas-6-meses",
      texto: "Más de seis meses anunciada deja huella: conviene retirar el anuncio y volver a salir con otra estrategia.",
    },
    {
      id: "reforma-pendiente",
      peso: 88,
      aplica: r.estado === "reformar",
      texto: "Una reforma pendiente reduce el público a compradores de proyecto: el precio y las fotos deben hablarles a ellos.",
    },
    {
      id: "precio-por-encima",
      peso: 85,
      aplica: ctx.ratioPrecio > 1.12 && ctx.ratioPrecio <= 1.2,
      texto: "El precio esperado está por encima de la horquilla donde la zona responde con visitas: merece revisarse antes de salir.",
    },
    {
      id: "atico-sin-ascensor",
      peso: 82,
      aplica: r.tipo === "atico" && r.ascensor === "no",
      texto: "Un ático sin ascensor pierde parte de su público natural: hay que compensarlo en precio o en presentación.",
    },
    {
      id: "piso-sin-ascensor",
      peso: 75,
      aplica: r.tipo === "piso" && r.ascensor === "no",
      texto: "La falta de ascensor descarta perfiles enteros de comprador: el resto de la propuesta tiene que ser impecable.",
    },
    {
      id: "anuncio-envejeciendo",
      peso: 72,
      aplica: r.tiempoAnunciado === "3-6-meses",
      texto: "Entre tres y seis meses anunciada, la vivienda empieza a 'envejecer' a ojos del mercado: toca refrescar la salida.",
    },
    {
      id: "zona-demanda-baja",
      peso: 65,
      aplica: !ctx.esMunicipioDesconocido && ctx.demandaZona < 55,
      texto: `En ${ctx.nombreZona} la demanda es más selectiva: la preparación y el precio pesan más que en otras zonas.`,
    },
    {
      id: "fuera-de-referencias",
      peso: 58,
      aplica: ctx.esMunicipioDesconocido,
      texto: `${ctx.nombreMunicipio} queda fuera de las zonas donde tenemos referencias afinadas: contrastar el precio con datos locales sería lo primero que haríamos contigo.`,
    },
    {
      id: "actualizacion-pendiente",
      peso: 60,
      aplica: r.estado === "actualizar",
      texto: "Pequeñas actualizaciones (pintura, luz, detalles) cambiarían la percepción en visita por poca inversión.",
    },
    {
      id: "precio-parte-alta",
      peso: 50,
      aplica: ctx.ratioPrecio > 1.05 && ctx.ratioPrecio <= 1.12,
      texto: "El precio esperado se sitúa en la parte alta de la horquilla: es defendible solo si la presentación acompaña.",
    },
    {
      id: "anuncio-reciente",
      peso: 45,
      aplica: r.tiempoAnunciado === "menos-1-mes" || r.tiempoAnunciado === "1-3-meses",
      texto: "El anuncio actual aún es reciente: es buen momento para corregir el enfoque antes de que pierda frescura.",
    },
    {
      id: "sin-calendario",
      peso: 40,
      aplica: r.horizonte === "explorando",
      texto: "Sin un calendario aproximado, la salida pierde fuerza: decidir el 'cuándo' es parte de la estrategia.",
    },
    {
      id: "un-bano-justo",
      peso: 35,
      aplica: r.banos === 1 && r.habitaciones >= 3,
      texto: "Un único baño para tres o más habitaciones genera dudas en familias: conviene anticipar la respuesta.",
    },
    {
      id: "superficie-atipica",
      peso: 30,
      aplica:
        r.superficie < ctx.config.encaje.superficieMinimaComoda ||
        r.superficie > ctx.config.encaje.superficieMaximaComoda,
      texto: "La superficie se sale del rango más buscado: el comprador tipo será distinto y la comunicación debe reflejarlo.",
    },
    // Siempre aplicables — garantizan dos aspectos incluso en el mejor caso
    {
      id: "preparacion-visual",
      peso: 10,
      aplica: true,
      texto: "La presentación (fotos, orden, luz) decidirá la primera semana en el mercado: merece preparación profesional.",
    },
    {
      id: "primera-semana",
      peso: 8,
      aplica: true,
      texto: "La primera semana en el mercado no se repite: conviene decidir precio, presentación y momento antes de publicar nada.",
    },
  ];

  void indicadores;
  return { fortalezas: elegir(fortalezas, 3), aRevisar: elegir(aRevisar, 2) };
}

export function construirExplicacion(
  ctx: ContextoCalculo,
  indicadores: Indicadores,
  nivelRiesgo: NivelRiesgo,
): string[] {
  const r = ctx.respuestas;
  const parrafos: string[] = [];

  // 1 · Demanda y tipología
  if (ctx.esMunicipioDesconocido) {
    parrafos.push(
      `Trabajamos sobre todo en el Garraf y el Penedès, y de ${ctx.nombreMunicipio} aún no tenemos referencias afinadas. Este diagnóstico usa valores prudentes de comarca: tómalo como una primera lectura, y es justo donde más aporta que lo revise una persona del equipo con datos locales.`,
    );
  } else if (ctx.demandaZona >= 75) {
    parrafos.push(
      `${ctx.nombreZona} concentra parte de la demanda más activa de ${ctx.nombreMunicipio}. Para ${TIPO_EN_FRASE[r.tipo]} como el tuyo hay compradores mirando ahora mismo, así que la clave no será encontrar interesados, sino salir bien a la primera.`,
    );
  } else if (ctx.demandaZona >= 60) {
    parrafos.push(
      `${ctx.nombreZona} es una zona con demanda estable en ${ctx.nombreMunicipio}: ${TIPO_EN_FRASE[r.tipo]} bien planteado encuentra comprador, pero no perdona una salida improvisada.`,
    );
  } else {
    parrafos.push(
      `En ${ctx.nombreZona} el comprador es más selectivo que en otras zonas de ${ctx.nombreMunicipio}. No significa que no haya mercado para ${TIPO_EN_FRASE[r.tipo]}: significa que el precio y la preparación tienen que trabajar juntos desde el primer día.`,
    );
  }

  // 2 · Precio (sin cifras; nunca "por debajo" — no anclamos expectativas al alza)
  if (ctx.ratioPrecio <= 1.05) {
    parrafos.push(
      "El precio que tienes en mente encaja con la horquilla de precios de viviendas comparables en la zona. Es la posición que más visitas genera durante las primeras semanas, que son las que cuentan.",
    );
  } else if (ctx.ratioPrecio <= 1.2) {
    parrafos.push(
      "El precio esperado se sitúa por encima de la horquilla de la zona. No es necesariamente un error, pero exige que todo lo demás — estado, fotos, relato — esté a la altura, y aun así alarga los plazos.",
    );
  } else {
    parrafos.push(
      "El precio esperado queda claramente por encima de lo que la zona está validando en viviendas comparables. Salir así suele traducirse en silencio: visitas que no llegan y un anuncio que envejece. Es la primera conversación que tendríamos.",
    );
  }

  // 3 · Preparación, historial y cierre
  const piezas: string[] = [];
  if (r.estado === "reformado" || r.estado === "buen-estado") {
    piezas.push("La vivienda está en condiciones de salir sin obras previas");
  } else if (r.estado === "actualizar") {
    piezas.push("Con pequeñas actualizaciones antes de salir, la percepción en visita cambia por completo");
  } else {
    piezas.push("Al venderse como proyecto de reforma, el comprador objetivo es distinto y la comunicación debe asumirlo");
  }
  if (r.yaAnunciado === "si") {
    piezas.push(
      r.tiempoAnunciado === "mas-6-meses" || r.tiempoAnunciado === "3-6-meses"
        ? "y el tiempo que lleva anunciada pide reposicionarla, no insistir"
        : "y el anuncio actual aún está a tiempo de corregirse bien",
    );
  } else {
    piezas.push("y al no estar anunciada, la primera impresión sigue intacta — es el mejor momento para prepararla");
  }
  const cierreRiesgo =
    nivelRiesgo === "bajo"
      ? "Con este punto de partida, el riesgo de que la venta se estanque es bajo si la salida se hace con criterio."
      : nivelRiesgo === "medio"
        ? "Hay algún punto que, sin corregir, puede alargar la venta más de lo necesario. Ninguno es grave; todos tienen solución antes de salir."
        : "Tal y como está planteada hoy, la salida tiene papeletas de estancarse. La buena noticia: los motivos son concretos y se pueden corregir antes de exponer la vivienda.";
  parrafos.push(
    `${piezas.join(", ")}. ${cierreRiesgo} En cualquier caso, esto es una orientación con lo que nos has contado: el siguiente paso es ir a ver la vivienda contigo — sin ningún compromiso — y dejarlo afinado sobre el terreno.`,
  );

  void indicadores;
  return parrafos;
}

/* ── Informe ampliado ────────────────────────────────────────────────────── */

export function calcularPosicionPrecio(ratio: number): PosicionPrecio {
  // Un precio prudente también es "en banda": nunca decimos "por debajo"
  // para no anclar al propietario en la idea de que podría pedir más.
  if (ratio <= 1.05) return "en-banda";
  if (ratio <= 1.2) return "parte-alta";
  return "por-encima";
}

/** Una línea por indicador explicando la nota, elegida por reglas */
export function construirLecturas(
  ctx: ContextoCalculo,
  ind: Indicadores,
): Record<keyof Indicadores, string> {
  const encaje = ctx.esMunicipioDesconocido
    ? "Sin referencia afinada de tu población: lectura prudente de comarca."
    : ctx.demandaZona >= 75
      ? "Lo que vendes coincide con lo que tu zona está buscando ahora."
      : ctx.demandaZona >= 60
        ? "Demanda estable en la zona: hay comprador si la salida acompaña."
        : "Comprador más selectivo en tu zona: precio y preparación pesan doble.";

  const atractivo =
    ind.atractivo >= 70
      ? "Suma argumentos que se notan en visita: el estado y los extras trabajan a favor."
      : ind.atractivo >= 45
        ? "Correcta, sin argumentos sobrados: la presentación tendrá que elevarla."
        : "Con pocos argumentos a primera vista: la percepción dependerá del precio.";

  const posicion = calcularPosicionPrecio(ctx.ratioPrecio);
  const precio =
    posicion === "en-banda"
      ? "Dentro de la horquilla de la zona: el rango que genera visitas en las primeras semanas."
      : posicion === "parte-alta"
        ? "En la parte alta de la horquilla: defendible solo si todo lo demás acompaña."
        : "Por encima de lo que la zona está validando: es la palanca más urgente.";

  const preparacion =
    ind.preparacion >= 70
      ? "Lista para salir con poco trabajo previo."
      : ind.preparacion >= 45
        ? "Con unos deberes antes de publicar, gana enteros."
        : "Salir hoy sería precipitado: conviene preparar antes de exponer.";

  const riesgo =
    ind.riesgoEstancamiento <= ctx.config.riesgo.niveles.bajo
      ? "Pocas papeletas de quedarse congelada si la salida se hace con criterio."
      : ind.riesgoEstancamiento <= ctx.config.riesgo.niveles.medio
        ? "Hay factores que, sin corregir, pueden alargar la venta más de lo necesario."
        : "Tal como está planteada, el anuncio tiene papeletas de envejecer sin visitas.";

  return {
    encajeDemanda: encaje,
    atractivo,
    competitividadPrecio: precio,
    preparacion,
    riesgoEstancamiento: riesgo,
  };
}

/**
 * El porqué de cada nota: los factores concretos que la suben o la bajan,
 * en lenguaje llano. Mismas reglas que el motor — sin cifras internas.
 */
export function construirPorques(
  ctx: ContextoCalculo,
  ind: Indicadores,
): Record<keyof Indicadores, string[]> {
  const r = ctx.respuestas;
  const rango = ctx.config.encaje.habitacionesIdeales[r.tipo];
  const posicion = calcularPosicionPrecio(ctx.ratioPrecio);

  const encajeDemanda: string[] = [];
  if (ctx.esMunicipioDesconocido) {
    encajeDemanda.push(
      "No tenemos referencias afinadas de tu población, así que la lectura parte de valores prudentes de comarca.",
    );
  } else if (ctx.demandaZona >= 75) {
    encajeDemanda.push(`${ctx.nombreZona} está entre las zonas con más búsquedas activas de la comarca.`);
  } else if (ctx.demandaZona >= 60) {
    encajeDemanda.push(`${ctx.nombreZona} mantiene una demanda estable: sin picos, pero constante.`);
  } else {
    encajeDemanda.push(`En ${ctx.nombreZona} el comprador es más selectivo y las operaciones tardan algo más.`);
  }
  encajeDemanda.push(
    r.habitaciones >= rango.min && r.habitaciones <= rango.max
      ? "El número de habitaciones coincide con el rango más buscado para esta tipología."
      : "El número de habitaciones queda fuera del rango más buscado para esta tipología, y eso estrecha el público.",
  );
  if (
    r.superficie < ctx.config.encaje.superficieMinimaComoda ||
    r.superficie > ctx.config.encaje.superficieMaximaComoda
  ) {
    encajeDemanda.push("La superficie se sale del rango más habitual: el comprador tipo será distinto al mayoritario.");
  }

  const atractivo: string[] = [];
  atractivo.push(
    r.estado === "reformado"
      ? "La reforma reciente es el mayor argumento en visita: resta objeciones y sube la percepción."
      : r.estado === "buen-estado"
        ? "El buen estado permite enseñar la vivienda sin excusas ni descuentos mentales."
        : r.estado === "actualizar"
          ? "Los detalles pendientes de actualizar restan en la primera impresión, aunque tienen arreglo barato."
          : "La reforma pendiente resta atractivo inmediato: el comprador descuenta la obra antes de ofertar.",
  );
  if (ctx.esTipologiaConAscensor) {
    atractivo.push(
      r.ascensor === "si"
        ? "El ascensor suma: no expulsa a ningún perfil de comprador."
        : "La falta de ascensor resta con familias y compradores de más edad.",
    );
  }
  if (r.caracteristicas.length > 0) {
    atractivo.push(
      `Suman argumentos a favor: ${r.caracteristicas
        .map((c) => ETIQUETA_CARACTERISTICA[c].toLowerCase())
        .join(", ")}.`,
    );
  } else {
    atractivo.push("Sin extras diferenciales (terraza, parking, vistas…), el peso recae en estado y precio.");
  }
  if (r.banos >= 2) {
    atractivo.push("El segundo baño evita uno de los descartes silenciosos más habituales.");
  }

  const competitividadPrecio: string[] = [
    posicion === "en-banda"
      ? "Tu precio esperado cae dentro de la horquilla de viviendas comparables: favorece visitas desde el primer día."
      : posicion === "parte-alta"
        ? "Tu precio esperado se sitúa en la parte alta de la horquilla: defendible solo si la presentación acompaña."
        : "Tu precio esperado queda por encima de la horquilla de comparables: es lo que más penaliza la nota.",
    "La referencia se ajusta por tipología y estado: no comparamos tu vivienda con cualquier anuncio, sino con sus comparables.",
  ];

  const preparacion: string[] = [];
  preparacion.push(
    r.estado === "reformado" || r.estado === "buen-estado"
      ? "La vivienda puede salir sin obras previas: solo necesita puesta a punto."
      : r.estado === "actualizar"
        ? "Unas mejoras pequeñas antes de salir elevarían la percepción con poca inversión."
        : "Conviene decidir la estrategia de la reforma antes de salir: venderla como proyecto o mejorarla.",
  );
  preparacion.push(
    r.yaAnunciado === "no"
      ? "Sin historial de anuncio: la primera impresión en el mercado está intacta."
      : r.tiempoAnunciado === "3-6-meses" || r.tiempoAnunciado === "mas-6-meses"
        ? "El tiempo acumulado de anuncio pide retirarlo y reposicionar, no insistir."
        : "El anuncio actual aún es reciente: se puede corregir sin coste de imagen.",
  );
  preparacion.push(
    r.horizonte === "cuanto-antes" || r.horizonte === "3-6-meses"
      ? "Hay calendario definido: la salida se puede planificar en lugar de improvisar."
      : r.horizonte === "este-anyo"
        ? "El margen de calendario permite llegar a la salida con todo preparado."
        : "Sin fecha decidida, conviene fijar el 'cuándo': es parte de la estrategia.",
  );

  const riesgoEstancamiento: string[] = [];
  riesgoEstancamiento.push(
    posicion === "en-banda"
      ? "El precio dentro de la horquilla es el mejor antídoto contra el estancamiento."
      : "El precio por encima de la horquilla es el principal factor de riesgo: silencia el teléfono.",
  );
  riesgoEstancamiento.push(
    r.yaAnunciado === "si" && r.tiempoAnunciado
      ? "El historial de anuncio acumulado añade riesgo de que el mercado la dé por vista."
      : "Salir de cero, sin historial de anuncio, reduce el riesgo de quemarse.",
  );
  if (!ctx.esMunicipioDesconocido && ctx.demandaZona < 55) {
    riesgoEstancamiento.push("La demanda selectiva de la zona alarga los plazos si la salida no acompaña.");
  }

  void ind;
  return { encajeDemanda, atractivo, competitividadPrecio, preparacion, riesgoEstancamiento };
}

/** Plan de salida recomendado: cinco pasos fijos, contenido según respuestas */
export function construirPlanSalida(ctx: ContextoCalculo, ind: Indicadores): PasoPlan[] {
  const r = ctx.respuestas;
  const posicion = calcularPosicionPrecio(ctx.ratioPrecio);

  const precio: PasoPlan =
    posicion === "por-encima"
      ? {
          titulo: "Reencuadrar el precio",
          texto:
            "Sentarse con comparables reales de la zona y decidir el precio de salida con datos, no con esperanza. Es la decisión que condiciona todo lo demás.",
        }
      : posicion === "parte-alta"
        ? {
            titulo: "Decidir si defiendes la parte alta",
            texto:
              "Estás en el tramo alto de la horquilla: o la presentación lo justifica pieza a pieza, o conviene ajustar antes de salir. Decidirlo ahora evita bajadas visibles después.",
          }
        : {
            titulo: "Blindar el precio con comparables",
            texto:
              "El precio está bien situado: documentarlo con comparables reales te dará seguridad cuando lleguen las ofertas a la baja.",
          };

  const historial: PasoPlan =
    r.yaAnunciado === "si" &&
    (r.tiempoAnunciado === "3-6-meses" || r.tiempoAnunciado === "mas-6-meses")
      ? {
          titulo: "Retirar y dejar descansar el anuncio",
          texto:
            "Lleva demasiado tiempo expuesta: retirarla unas semanas y volver a salir con otro precio, otras fotos y otro relato funciona mejor que insistir.",
        }
      : r.yaAnunciado === "si"
        ? {
            titulo: "Corregir el anuncio a tiempo",
            texto:
              "El anuncio aún es reciente: es el momento de ajustar fotos, orden y texto antes de que el mercado lo dé por visto.",
          }
        : {
            titulo: "No publicar hasta tenerlo todo",
            texto:
              "La primera semana en el mercado no se repite: mejor salir un solo día y perfecto que corregir en público.",
          };

  const preparacion: PasoPlan =
    r.estado === "reformar"
      ? {
          titulo: "Decidir cómo se vende la reforma",
          texto:
            "O pequeñas mejoras que abran el abanico de compradores, o venta como proyecto con precio y comunicación pensados para ese perfil. Las medias tintas confunden.",
        }
      : r.estado === "actualizar"
        ? {
            titulo: "Actualizaciones de bajo coste",
            texto:
              "Pintura, luz y detalles: poca inversión y mucho efecto en visita. Lo que no se arregle, que lo explique el precio antes de que lo descubra el comprador.",
          }
        : {
            titulo: "Puesta a punto visual",
            texto:
              "Orden, luz y fotografía profesional. La vivienda está bien: que las fotos estén a su altura, porque son la primera visita real.",
          };

  const documentacion: PasoPlan = {
    titulo: "Del papeleo nos ocupamos nosotros",
    texto:
      "Si trabajamos juntos, te pediremos lo necesario en el momento oportuno y lo gestionamos contigo: tú no tienes que perseguir papeles antes de hora.",
  };

  const calendario: PasoPlan =
    r.horizonte === "cuanto-antes"
      ? {
          titulo: "Calendario: dos semanas de preparación",
          texto:
            "Con tu urgencia, lo eficiente es concentrar la preparación en un par de semanas y salir fuerte, no publicar mañana a medias.",
        }
      : r.horizonte === "explorando"
        ? {
            titulo: "Calendario: decidir el cuándo",
            texto:
              "Sin fecha en mente, el mejor uso de este diagnóstico es preparar la decisión: cuando el 'cuándo' esté claro, la salida ya estará lista.",
          }
        : {
            titulo: "Calendario: elegir la ventana",
            texto:
              "Tu margen permite elegir la ventana de salida y llegar a ella con todo preparado: es la posición ideal para no malvender.",
          };

  void ind;
  return [precio, historial, preparacion, documentacion, calendario];
}

/** A quién le encaja esta vivienda — perfil probable del comprador */
export function construirPerfilComprador(ctx: ContextoCalculo): string {
  const r = ctx.respuestas;
  const frases: string[] = [];

  const base: Record<typeof r.tipo, string> = {
    piso: "El comprador natural son parejas y familias de la comarca que buscan piso para quedarse",
    atico: "El comprador natural es el que lleva tiempo esperando un ático: compra de mejora, con criterio y sin prisa",
    "planta-baja": "El comprador natural es quien quiere vivir sin escaleras: gente mayor, movilidad reducida y familias con niños pequeños",
    casa: "El comprador natural son familias que quieren espacio, y en esta comarca también la segunda residencia",
    adosada: "El comprador natural son familias que buscan casa sin salir del núcleo urbano",
  };
  frases.push(base[r.tipo]);

  if (r.estado === "reformar") {
    frases.push(
      "Con la reforma pendiente, ganan peso el comprador de proyecto y el inversor: calculan la obra antes de ofertar, y responden al precio más que a la foto",
    );
  } else if (ctx.esTipologiaConAscensor && r.ascensor === "no") {
    frases.push(
      "Sin ascensor, el abanico se estrecha hacia comprador joven e inversor; la vivienda tiene que compensarlo en precio o en encanto",
    );
  }

  const exterior = r.caracteristicas.filter((c) => ["terraza", "jardin", "vistas"].includes(c));
  if (exterior.length > 0) {
    frases.push(
      "El exterior será el argumento emocional de la visita: es lo que se recuerda al día siguiente",
    );
  }

  return frases.join(". ") + ".";
}

/* ── Bloques del informe descargable ─────────────────────────────────────── */

/**
 * Aviso de alcance del diagnóstico. Debe acompañar SIEMPRE al informe:
 * es la honestidad que lo hace creíble y el argumento de la visita.
 */
export const AVISO_ORIENTATIVO =
  "Este diagnóstico es orientativo: se ha elaborado sin conocer la dirección exacta de la vivienda y sin haberla visitado, a partir de tus respuestas y de referencias por zona y tipología. El estado real, la orientación, las vistas, la finca o la planta pueden cambiar la lectura — a veces mucho. Por eso el siguiente paso natural es que una persona del equipo la vea contigo, sin compromiso: la visita convierte esta primera lectura en una estrategia real.";

/** Qué mide cada indicador — definiciones para el informe */
export const QUE_MIDE_INDICADOR: Record<keyof Indicadores, string> = {
  encajeDemanda:
    "Mide si lo que vendes (tipología, tamaño, habitaciones) coincide con lo que los compradores de tu zona están buscando ahora. Una vivienda muy demandada perdona pequeños errores de salida; una de nicho, no.",
  atractivo:
    "Mide los argumentos que la vivienda pone sobre la mesa a ojos de quien la visita: estado, ascensor, exteriores, extras. Es lo que hace que una visita se convierta en oferta.",
  competitividadPrecio:
    "Compara el precio que tienes en mente con la horquilla de precios de viviendas comparables en tu zona. Es el indicador que más pesa: el precio de salida decide cuántas visitas llegan las primeras semanas.",
  preparacion:
    "Mide si la vivienda está lista para salir mañana: estado, historial de anuncio y calendario. Salir a medias es la forma más cara de aprender.",
  riesgoEstancamiento:
    "Estima la probabilidad de que el anuncio envejezca sin visitas ni ofertas, combinando precio, historial, estado y demanda de la zona. Un anuncio estancado acaba vendiendo por debajo de su potencial.",
};

/** Puesta a punto antes de las fotos y las visitas */
export const CHECKLIST_PUESTA_A_PUNTO: string[] = [
  "Despersonalizar: fotos, imanes, objetos muy personales fuera de escena",
  "Reparaciones menores: manillas, juntas, persianas, grifos que gotean",
  "Pintura en paredes marcadas — el blanco roto amplía y da luz",
  "Orden y despeje: cuanto menos mueble, más metros percibidos",
  "Luz: bombillas cálidas y potentes, cortinas abiertas en las visitas",
  "Olores: ventilación a fondo el día de fotos y de cada visita",
  "Entrada y fachada: la primera impresión empieza en la puerta",
  "Terraza o jardín arreglados: el exterior vende tanto como el interior",
];

/** Errores clásicos del propietario que vende por su cuenta */
export const ERRORES_FRECUENTES: PasoPlan[] = [
  {
    titulo: "Salir con un precio «de prueba»",
    texto: "«Probamos alto y ya bajaremos» quema las primeras semanas, que son las de máxima visibilidad. Las bajadas posteriores quedan registradas y el comprador negocia sabiendo que hay prisa.",
  },
  {
    titulo: "Fotos de móvil y anuncio improvisado",
    texto: "El comprador descarta en tres segundos de scroll. Una vivienda bien preparada con fotos mediocres compite en desventaja contra otra peor pero mejor presentada.",
  },
  {
    titulo: "Aceptar todas las visitas sin filtrar",
    texto: "Visitas de curiosos desgastan al propietario y a la vivienda. Filtrar por financiación e intención real ahorra semanas y disgustos.",
  },
  {
    titulo: "Negociar sin comparables en la mano",
    texto: "Ante una oferta a la baja, la diferencia entre ceder y defender el precio es tener datos de operaciones comparables — no sensaciones.",
  },
  {
    titulo: "Dejar el anuncio envejecer «a ver si suena la flauta»",
    texto: "Un anuncio con meses acumulados transmite que algo falla, aunque no sea verdad. Retirar, corregir y resalir funciona mejor que insistir.",
  },
];

/**
 * Filosofía de precio de la casa — acompaña a la horquilla en pantalla y PDF.
 * El mensaje: mercado en cambio + el mejor precio es el que genera movimiento.
 */
export const FRASE_PRECIO_MOVIMIENTO =
  "El mercado está en un momento de cambios y esta lectura puede variar. Y hay algo que defendemos siempre: el precio más alto no es necesariamente el mejor. El mejor precio es el que genera acción — visitas, ofertas, movimiento desde la primera semana. Un precio que solo genera silencio es el más caro de todos.";

/** El método de salida de The Vila Home, pieza a pieza */
export const METODO_TVH: PasoPlan[] = [
  {
    titulo: "Fotografía profesional",
    texto: "Sesión con la vivienda puesta a punto y luz preparada: las fotos deciden qué anuncios se abren y cuáles se pasan de largo.",
  },
  {
    titulo: "Vídeo de la vivienda",
    texto: "Un recorrido real pensado para quien mira desde el móvil antes de decidir si pide visita.",
  },
  {
    titulo: "Plano y 3D",
    texto: "El comprador entiende la distribución antes de venir: llegan visitas mejor filtradas y con más intención.",
  },
  {
    titulo: "Tour virtual",
    texto: "Visitas desde el sofá para compradores de fuera de la comarca, y menos visitas de curiosos en tu casa.",
  },
  {
    titulo: "Difusión segmentada",
    texto: "Portales más campañas dirigidas al perfil de comprador de tu zona — no publicar y esperar.",
  },
];

/**
 * Cómo se relaciona el precio esperado con la horquilla. OJO: nunca se dice
 * que el propietario "podría pedir más" — un precio prudente se enmarca como
 * posición cómoda, y el punto exacto se remite siempre a la visita.
 */
export function textoHorquilla(res: ResultadoDiagnostico): string {
  const precio = res.respuestas.precioEsperado;
  const { inferior, superior } = res.horquillaSalida;
  if (precio > superior) {
    return "Tu precio esperado queda por encima de esta horquilla: es la primera conversación que tendríamos, con comparables reales sobre la mesa.";
  }
  if (precio < inferior) {
    return "Tu precio esperado es prudente respecto a la horquilla: una posición cómoda para vender con agilidad. El punto exacto de salida lo afinaríamos juntos tras ver la vivienda.";
  }
  return "Tu precio esperado encaja dentro de la horquilla: buen punto de partida. El punto exacto de salida se decide con comparables reales tras ver la vivienda.";
}

/** Calendario orientativo de los primeros 30 días, adaptado a las respuestas */
export function construirPrimerosTreintaDias(
  res: ResultadoDiagnostico,
): { semana: string; texto: string }[] {
  const r = res.respuestas;

  const semana1 =
    res.posicionPrecio === "por-encima"
      ? "Sentar el precio de salida con comparables reales de la zona: es la decisión que condiciona todo lo demás y conviene tomarla con datos, no sobre la marcha."
      : res.posicionPrecio === "parte-alta"
        ? "Decidir con comparables si se defiende la parte alta de la horquilla o se ajusta antes de salir, y fijar el precio definitivo de salida."
        : "Confirmar el precio de salida con comparables reales y dejarlo documentado: dará seguridad cuando lleguen las primeras ofertas.";

  const semana2 =
    r.estado === "reformar"
      ? "Decidir cómo se vende la reforma (pequeñas mejoras o venta como proyecto) y dejar esa decisión cerrada antes de producir nada."
      : r.estado === "actualizar"
        ? "Ejecutar las pequeñas actualizaciones de bajo coste (pintura, luz, detalles) y dejar la vivienda lista para las fotos."
        : "Puesta a punto de la vivienda (orden, luz, pequeños arreglos) para que llegue impecable al día de las fotos.";

  const semana3 =
    r.yaAnunciado === "si" && (r.tiempoAnunciado === "3-6-meses" || r.tiempoAnunciado === "mas-6-meses")
      ? "Retirar el anuncio actual para que descanse, y producir el material nuevo con la vivienda ya lista: fotos profesionales, vídeo y plano."
      : "Producir el material con la vivienda ya lista: fotos profesionales, vídeo, plano y tour. Es lo que decidirá cuántas visitas llegan.";

  const semana4 =
    r.horizonte === "explorando"
      ? "Con todo preparado, la salida queda lista para cuando decidas el momento — sin prisas y sin quemar el anuncio."
      : "Salida coordinada en portales y campañas, y gestión de las primeras visitas con recogida de feedback para ajustar rápido si hace falta.";

  return [
    { semana: "Semana 1", texto: semana1 },
    { semana: "Semana 2", texto: semana2 },
    { semana: "Semana 3", texto: semana3 },
    { semana: "Semana 4", texto: semana4 },
  ];
}

/**
 * Pruebas básicas del motor de puntuación.
 *
 * Ejecutar con:  npm run test:diagnostico
 * (usa el runner de Node vía tsx; no hace falta ningún framework)
 */

import { deepStrictEqual, notStrictEqual, ok, strictEqual } from "node:assert";
import { test } from "node:test";

import { CONFIG_SCORING } from "./config-scoring";
import { calcularDiagnostico } from "./motor";
import { construirPrimerosTreintaDias, textoHorquilla } from "./plantillas";
import { CASOS_EJEMPLO } from "./referencias-mock";
import type { RespuestasDiagnostico } from "./tipos";

test("entradas idénticas producen resultados idénticos (determinismo)", () => {
  for (const caso of CASOS_EJEMPLO) {
    const primera = calcularDiagnostico(caso.respuestas);
    const segunda = calcularDiagnostico(JSON.parse(JSON.stringify(caso.respuestas)));
    deepStrictEqual(segunda, primera, `resultado no determinista en "${caso.id}"`);
  }
});

test("el orden en que se marcan las características no altera el resultado", () => {
  const base = CASOS_EJEMPLO.find((c) => c.id === "atico-con-terraza")!.respuestas;
  const desordenado: RespuestasDiagnostico = {
    ...base,
    caracteristicas: [...base.caracteristicas].reverse(),
  };
  deepStrictEqual(calcularDiagnostico(desordenado), calcularDiagnostico(base));
});

test("el identificador es estable y distingue respuestas distintas", () => {
  const ids = new Set<string>();
  for (const caso of CASOS_EJEMPLO) {
    const id = calcularDiagnostico(caso.respuestas).id;
    strictEqual(id, calcularDiagnostico(caso.respuestas).id, `id inestable en "${caso.id}"`);
    ok(/^dx-[0-9a-f]{8}$/.test(id), `formato de id inesperado: ${id}`);
    ids.add(id);
  }
  strictEqual(ids.size, CASOS_EJEMPLO.length, "dos casos distintos comparten id");
});

test("todas las puntuaciones quedan entre 0 y 100", () => {
  for (const caso of CASOS_EJEMPLO) {
    const res = calcularDiagnostico(caso.respuestas);
    const valores = [res.puntuacionGeneral, ...Object.values(res.indicadores)];
    for (const v of valores) {
      ok(Number.isInteger(v) && v >= 0 && v <= 100, `valor fuera de rango en "${caso.id}": ${v}`);
    }
  }
});

test("subir el precio esperado nunca mejora la competitividad ni baja el riesgo", () => {
  const base = CASOS_EJEMPLO.find((c) => c.id === "piso-con-ascensor")!.respuestas;
  let anterior = calcularDiagnostico({ ...base, precioEsperado: 150000 });
  for (const precio of [200000, 235000, 280000, 350000, 500000]) {
    const actual = calcularDiagnostico({ ...base, precioEsperado: precio });
    ok(
      actual.indicadores.competitividadPrecio <= anterior.indicadores.competitividadPrecio,
      `competitividad subió al pasar a ${precio} €`,
    );
    ok(
      actual.indicadores.riesgoEstancamiento >= anterior.indicadores.riesgoEstancamiento,
      `riesgo bajó al pasar a ${precio} €`,
    );
    anterior = actual;
  }
});

test("el resultado trae 3 fortalezas, 2 aspectos a revisar y explicación", () => {
  for (const caso of CASOS_EJEMPLO) {
    const res = calcularDiagnostico(caso.respuestas);
    strictEqual(res.fortalezas.length, 3, `fortalezas en "${caso.id}"`);
    strictEqual(res.aRevisar.length, 2, `aspectos a revisar en "${caso.id}"`);
    strictEqual(res.explicacion.length, 3, `párrafos de explicación en "${caso.id}"`);
    ok(res.explicacion.every((p) => p.length > 40), "explicación demasiado corta");
  }
});

test("el informe ampliado viene completo: lecturas, posición, plan y perfil", () => {
  for (const caso of CASOS_EJEMPLO) {
    const res = calcularDiagnostico(caso.respuestas);
    const lecturas = Object.values(res.lecturaIndicadores);
    strictEqual(lecturas.length, 5, `lecturas en "${caso.id}"`);
    ok(lecturas.every((l) => l.length > 20), `lecturas vacías en "${caso.id}"`);
    ok(
      ["por-debajo", "en-banda", "parte-alta", "por-encima"].includes(res.posicionPrecio),
      `posición de precio inválida en "${caso.id}"`,
    );
    strictEqual(res.planSalida.length, 5, `plan de salida en "${caso.id}"`);
    ok(
      res.planSalida.every((p) => p.titulo.length > 5 && p.texto.length > 40),
      `pasos del plan incompletos en "${caso.id}"`,
    );
    ok(res.perfilComprador.length > 40, `perfil de comprador en "${caso.id}"`);
    const porques = Object.values(res.porques);
    strictEqual(porques.length, 5, `porqués en "${caso.id}"`);
    ok(
      porques.every((lista) => lista.length >= 2 && lista.every((p) => p.length > 25)),
      `porqués incompletos en "${caso.id}"`,
    );
  }
});

test("la posición del precio es coherente y nunca dice 'por debajo'", () => {
  const base = CASOS_EJEMPLO.find((c) => c.id === "piso-con-ascensor")!.respuestas;
  const barato = calcularDiagnostico({ ...base, precioEsperado: 150000 });
  const caro = calcularDiagnostico({ ...base, precioEsperado: 500000 });
  // Regla de negocio: un precio prudente se comunica como "en banda" para no
  // anclar al propietario en la idea de que podría pedir más
  strictEqual(barato.posicionPrecio, "en-banda");
  strictEqual(caro.posicionPrecio, "por-encima");
  ok(caro.planSalida[0].titulo.includes("Reencuadrar"), "el plan debe empezar por el precio");
  const textos = JSON.stringify(barato);
  ok(!textos.includes("por debajo"), "ningún texto debe decir 'por debajo'");
  ok(!textos.includes("dejando margen"), "ningún texto debe sugerir que puede pedir más");
});

test("el diagnóstico nunca detalla la documentación (la pedimos nosotros)", () => {
  for (const caso of CASOS_EJEMPLO) {
    const textos = JSON.stringify(calcularDiagnostico(caso.respuestas)).toLowerCase();
    for (const prohibido of ["nota simple", "cédula", "certificado energético", "certificado de eficiencia"]) {
      ok(!textos.includes(prohibido), `"${prohibido}" aparece en "${caso.id}"`);
    }
  }
});

test("la horquilla de salida es coherente, redondeada y nunca invita a pedir más", () => {
  const { redondeo } = CONFIG_SCORING.precio.horquilla;
  for (const caso of CASOS_EJEMPLO) {
    const res = calcularDiagnostico(caso.respuestas);
    const { inferior, superior } = res.horquillaSalida;
    ok(inferior > 0 && superior > inferior, `horquilla incoherente en "${caso.id}"`);
    strictEqual(inferior % redondeo, 0, `inferior sin redondear en "${caso.id}"`);
    strictEqual(superior % redondeo, 0, `superior sin redondear en "${caso.id}"`);
  }
  // Más superficie → horquilla más alta (monotonía)
  const base = CASOS_EJEMPLO.find((c) => c.id === "piso-con-ascensor")!.respuestas;
  const pequeno = calcularDiagnostico({ ...base, superficie: 70 });
  const grande = calcularDiagnostico({ ...base, superficie: 120 });
  ok(grande.horquillaSalida.inferior > pequeno.horquillaSalida.inferior);
  // Con precio esperado prudente, el texto no sugiere que puede pedir más
  const barato = calcularDiagnostico({ ...base, precioEsperado: 120000 });
  const texto = textoHorquilla(barato);
  ok(!texto.includes("por debajo") && !texto.includes("pedir más") && !texto.includes("margen"));
  ok(texto.includes("prudente"), "el precio prudente se enmarca en positivo");
});

test("los metros extra valen menos: doblar superficie no dobla la horquilla", () => {
  const base = CASOS_EJEMPLO.find((c) => c.id === "casa-adosada")!.respuestas;
  const pequena = calcularDiagnostico({ ...base, superficie: 130 });
  const doble = calcularDiagnostico({ ...base, superficie: 260 });
  ok(
    doble.horquillaSalida.inferior > pequena.horquillaSalida.inferior,
    "más superficie debe subir la horquilla",
  );
  ok(
    doble.horquillaSalida.inferior < 2 * pequena.horquillaSalida.inferior,
    "pero mucho menos que linealmente",
  );
});

test("el calendario de los primeros 30 días trae 4 semanas con contenido", () => {
  for (const caso of CASOS_EJEMPLO) {
    const semanas = construirPrimerosTreintaDias(calcularDiagnostico(caso.respuestas));
    strictEqual(semanas.length, 4, `semanas en "${caso.id}"`);
    ok(semanas.every((s) => s.texto.length > 40), `semanas vacías en "${caso.id}"`);
  }
});

test("incluso el peor escenario garantiza fortalezas, y el mejor, aspectos a revisar", () => {
  const peor: RespuestasDiagnostico = {
    municipio: "canyelles",
    municipioOtro: null,
    zona: "canyelles",
    tipo: "piso",
    superficie: 38,
    habitaciones: 1,
    banos: 1,
    ascensor: "no",
    caracteristicas: [],
    estado: "reformar",
    precioEsperado: 900000,
    yaAnunciado: "si",
    tiempoAnunciado: "mas-6-meses",
    horizonte: "explorando",
  };
  const mejor = CASOS_EJEMPLO.find((c) => c.id === "atico-con-terraza")!.respuestas;
  strictEqual(calcularDiagnostico(peor).fortalezas.length, 3);
  strictEqual(calcularDiagnostico(mejor).aRevisar.length, 2);
  strictEqual(calcularDiagnostico(peor).nivelRiesgo, "alto");
});

test("el nivel de riesgo respeta los umbrales de la config", () => {
  for (const caso of CASOS_EJEMPLO) {
    const res = calcularDiagnostico(caso.respuestas);
    const { bajo, medio } = CONFIG_SCORING.riesgo.niveles;
    const esperado =
      res.indicadores.riesgoEstancamiento <= bajo
        ? "bajo"
        : res.indicadores.riesgoEstancamiento <= medio
          ? "medio"
          : "alto";
    strictEqual(res.nivelRiesgo, esperado, `nivel de riesgo en "${caso.id}"`);
  }
});

test("los pesos de la config suman 100", () => {
  const suma = Object.values(CONFIG_SCORING.pesos).reduce((a, b) => a + b, 0);
  strictEqual(suma, 100);
});

test("tiempoAnunciado se ignora si la vivienda no está anunciada", () => {
  const base = CASOS_EJEMPLO.find((c) => c.id === "piso-con-ascensor")!.respuestas;
  const conRuido: RespuestasDiagnostico = {
    ...base,
    yaAnunciado: "no",
    tiempoAnunciado: "mas-6-meses",
  };
  const limpio: RespuestasDiagnostico = { ...base, yaAnunciado: "no", tiempoAnunciado: null };
  deepStrictEqual(calcularDiagnostico(conRuido), calcularDiagnostico(limpio));
});

test("otra población: determinista, id propio y aviso de referencias limitadas", () => {
  const base = CASOS_EJEMPLO.find((c) => c.id === "piso-con-ascensor")!.respuestas;
  const otra: RespuestasDiagnostico = {
    ...base,
    municipio: "otro",
    municipioOtro: "Castellet i la Gornal",
    zona: "otro",
  };

  const res = calcularDiagnostico(otra);
  deepStrictEqual(calcularDiagnostico(JSON.parse(JSON.stringify(otra))), res);
  strictEqual(res.fortalezas.length, 3);
  strictEqual(res.aRevisar.length, 2);
  ok(
    res.aRevisar.some((f) => f.id === "fuera-de-referencias"),
    "debe avisar de que no hay referencias afinadas",
  );
  ok(
    res.explicacion[0].includes("Castellet I La Gornal") === false &&
      res.explicacion[0].includes("Castellet"),
    "la explicación menciona la población escrita",
  );
  notStrictEqual(res.id, calcularDiagnostico(base).id, "una población distinta cambia el id");
  notStrictEqual(
    res.id,
    calcularDiagnostico({ ...otra, municipioOtro: "Sant Jaume dels Domenys" }).id,
    "dos poblaciones libres distintas no comparten id",
  );
});

test("otra población: mayúsculas y espacios no cambian el resultado", () => {
  const base = CASOS_EJEMPLO.find((c) => c.id === "piso-con-ascensor")!.respuestas;
  const otra: RespuestasDiagnostico = {
    ...base,
    municipio: "otro",
    municipioOtro: "les roquetes",
    zona: "otro",
  };
  const variante: RespuestasDiagnostico = { ...otra, municipioOtro: "  Les   Roquetes " };
  deepStrictEqual(calcularDiagnostico(variante), calcularDiagnostico(otra));
});

test("una config distinta cambia la versión y el identificador", () => {
  const base = CASOS_EJEMPLO[0].respuestas;
  const original = calcularDiagnostico(base);
  const alterada = calcularDiagnostico(base, {
    ...CONFIG_SCORING,
    version: "1.0.0+panel",
  });
  strictEqual(alterada.version, "1.0.0+panel");
  notStrictEqual(alterada.id, original.id, "el id debe trazar la config usada");
});

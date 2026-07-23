# Diagnóstico inicial de salida al mercado — prototipo

Herramienta de captación de propietarios para campañas de Meta Ads. **No es una
valoración automática ni promete precio de venta**: ofrece un diagnóstico
inicial sobre cómo saldría hoy una vivienda al mercado, y convierte esa lectura
en una conversación con el equipo.

Prototipo navegable dentro de la web (Next.js + TypeScript + Tailwind),
desplegable en Vercel con el resto del proyecto. Sin APIs de pago y con
**datos simulados** marcados como mock.

## Rutas

| Ruta | Qué es |
| --- | --- |
| `/antes-de-vender` | Landing de entrada (noindex, sin chrome público) |
| `/antes-de-vender/analisis` | Cuestionario → procesamiento → resultado → captación → confirmación |
| `/antes-de-vender/analisis?demo=1` | Lo mismo, abriendo el selector de escenarios demo |
| `/antes-de-vender/panel` | Panel interno de demostración (noindex, sin enlazar) |

Todas llevan `robots: noindex` y se renderizan sin Navbar/Footer (añadidas a la
lista de rutas standalone de `PublicChrome`).

## Recorrido del usuario

1. **Landing** — titular, aclaración honesta («no es una valoración automática…»)
   y CTA «Analizar mi vivienda».
2. **Cuestionario** — una pregunta por pantalla, barra de progreso, atrás/adelante.
   12 preguntas; los pasos se adaptan (el ascensor solo se pregunta en piso/ático,
   el tiempo anunciado solo si ya está anunciada). No se pregunta si está
   habitada/alquilada/ocupada. La ubicación ofrece 10 municipios con referencias
   propias (Garraf, Baix Penedès y Vilafranca) en píldoras compactas, más «Otra
   población…» con autocompletado sobre los 949 municipios de Catalunya
   (`src/lib/catalunya-municipios.ts`): fuera de Catalunya no se trabaja y el
   formulario lo dice; una población catalana sin referencia entra con valores
   prudentes de comarca y el informe lo avisa.
3. **Procesamiento** — animación breve con mensajes honestos (sin «miles de variables»).
4. **Resultado** — puntuación general, 5 indicadores con lectura en una línea
   cada uno, posición cualitativa del precio en la banda (sin cifras) y primera
   fortaleza visible; el resto queda tras el formulario: fortalezas, aspectos a
   revisar, «nuestra lectura», perfil de comprador probable y plan de salida en
   5 pasos (todo por reglas deterministas en `plantillas.ts`).
5. **Captación** — nombre, teléfono, email + privacidad y consentimiento, con
   validaciones en castellano.
6. **Confirmación** — desbloquea el informe completo (3 fortalezas, 2 aspectos a
   revisar, explicación por plantillas) y permite pedir llamada (mañana/tarde).
7. **Panel interno** — lista, filtros, estado del lead, CSV, versión del
   algoritmo y editor de pesos.

## Arquitectura

## Diseño

Sistema propio, independiente de la web pública: oscuro premium (fondo
`#060A09`), acento esmeralda→teal (`#34D399 → #14B8A6`), tarjetas de cristal,
Space Grotesk para titulares y cifras (`fuente.ts`, cargada solo en estas
rutas) y micro-animaciones definidas en `globals.css` (`dx-float`, `dx-fade-up`,
`dx-pulse`). Los átomos compartidos (chips, botones, barras, anillo de
puntuación, halos) viven en `src/components/diagnostico/ui.tsx`.

```
src/lib/diagnostico/
  tipos.ts             Tipos compartidos (respuestas, resultado, registro, lead)
  config-scoring.ts    ⚙️ REGLAS EDITABLES: pesos, umbrales, ajustes + versión
  referencias-mock.ts  Referencias simuladas por municipio/zona/tipología + 5 casos de ejemplo
  motor.ts             Motor determinista (puro, sin aleatoriedad ni fechas)
  plantillas.ts        Fortalezas, aspectos a revisar y explicación por reglas
  etiquetas.ts         Textos castellanos compartidos UI/CSV/plantillas
  almacen.ts           Persistencia del prototipo (localStorage) + CSV + pesos del panel
  motor.test.ts        Pruebas del motor (node:test)

src/components/diagnostico/
  LandingDiagnostico   Cuestionario   Procesando   Resultado
  FormularioContacto   FlujoDiagnostico (orquestador)   PanelDiagnostico   ui (átomos)
```

### Motor de puntuación

- **Determinista**: mismas respuestas + misma config → exactamente el mismo
  resultado, incluido el identificador (`dx-<hash fnv1a>` sobre versión +
  respuestas canónicas). Sin `Math.random()`, sin fechas.
- **Cinco indicadores** (0–100): encaje con la demanda, atractivo,
  competitividad del precio, preparación y riesgo de estancamiento (invertido:
  más = peor). La puntuación general es la media ponderada con los pesos de la
  config (el riesgo entra como `100 − riesgo`).
- Cada resultado guarda: versión del algoritmo, respuestas normalizadas,
  puntuaciones parciales, puntuación general, factores positivos, factores a
  revisar e identificador estable.
- **Reglas editables** en `config-scoring.ts`. Si cambias valores, sube
  `ALGORITMO_VERSION`.
- La UI nunca muestra precios exactos ni porcentajes de probabilidad de venta:
  solo bandas relativas («dentro de la banda», «por encima…»).

### Datos simulados

`referencias-mock.ts` contiene €/m² y demanda **inventados** (plausibles para el
Garraf) por municipio/zona/tipología. Nunca se muestran como cifra al usuario.
Las zonas de cada municipio replican la división oficial de Idealista
(consultada en idealista.com en jul 2026), para que el propietario reconozca su
zona con los mismos nombres que ve en los portales; Canyelles no tiene
subdivisión en Idealista y va como «Todo el municipio».
Incluye 5 casos de ejemplo de Vilanova (piso con/sin ascensor, ático con
terraza, adosada, para reformar) que alimentan el modo demo, los datos de
prueba del panel y los tests.

### Persistencia (decisión de prototipo)

Los diagnósticos se guardan **solo en localStorage del navegador** — nada viaja
a ningún servidor ni al Blob de producción. El panel lista lo que haya en ese
navegador. Para pasar a producción, sustituir únicamente `almacen.ts` por una
persistencia real (y meter el panel tras la auth de `/admin`).

## Modo demo

- Landing → «Ver un ejemplo primero», o `?demo=1` en `/antes-de-vender/analisis`.
- En el cuestionario, enlace discreto «Modo demo» al pie.
- En el panel, «Sembrar datos de prueba» crea los 5 casos con contactos ficticios.

## Panel de pesos

El panel permite probar otros pesos (guardados en localStorage). Los
diagnósticos calculados así quedan versionados como `1.0.0+panel` para no
confundirlos con los de la config canónica del archivo.

## Pruebas

```bash
npm run test:diagnostico
```

11 pruebas con `node:test` (vía `tsx`): determinismo entrada-idéntica →
resultado-idéntico, estabilidad e unicidad del id, rangos 0–100, monotonía del
precio (subirlo nunca mejora la competitividad), garantía de 3 fortalezas +
2 aspectos en cualquier escenario, umbrales de riesgo, suma de pesos = 100 y
trazabilidad de config alternativa.

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:3000/antes-de-vender
npm run test:diagnostico
npm run build        # listo para Vercel (igual que el resto de la web)
```

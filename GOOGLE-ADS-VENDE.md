# Google Ads — Landing /vende-tu-casa (captación de vendedores)

Plan de campaña para The Vila Home. Decisiones base (jul 2026):
**Búsqueda · Castellano + Catalán · Solo Garraf · ~25 €/día para empezar.**

Objetivo honesto: no existe «convertir al 100%». Lo que perseguimos es
**leads de calidad al menor coste posible**. Con la landing actual, un
5-15 % de visita→lead ya es muy bueno.

---

## 0. TRACKING — hazlo ANTES de encender la campaña (bloqueante)

Sin esto, Google Ads no sabe qué clics acaban en lead y no puede optimizar.

1. **Crear propiedad GA4** (si no existe) en analytics.google.com y copiar su
   ID `G-XXXXXXXXXX`.
2. **Ponerlo en Vercel** como variable de entorno `NEXT_PUBLIC_GA_ID`
   (Production) y redeploy. *(Ahora mismo está sin configurar.)*
3. En **GA4 → Administrar → Eventos**: tras el primer lead de prueba, aparecerá
   `generate_lead`. Márcalo como **evento clave / conversión**.
4. **Vincular GA4 con Google Ads**: GA4 → Administrar → Vínculos de productos →
   Google Ads.
5. En **Google Ads → Objetivos → Conversiones → + Nueva → Importar → GA4 →
   `generate_lead`**. Ponla como **Principal**.
6. **Prueba real**: abre la landing, acepta cookies de analítica, envía el
   formulario y confirma en GA4 (Tiempo real) que salta `generate_lead`.

### Aviso RGPD (impórtale a la optimización)
El evento solo se dispara si el visitante **acepta cookies de analítica**. Quien
las rechace no cuenta como conversión en Google (aunque **el lead sí llega por
email igualmente**). Cuando la campaña esté en marcha, activar **Google Consent
Mode v2** para que Google modele las conversiones perdidas por consentimiento.

---

## 1. Presupuesto recomendado

**~25 €/día (≈750 €/mes) para arrancar.** Motivo: Garraf-only + 2 idiomas tiene
volumen de búsqueda modesto; con 25 €/día Google reúne datos de conversión en
2-3 semanas sin malgastar. Por debajo de 20 € aprende demasiado lento; por
encima de 40 € agotas el volumen local y empiezas a pagar clics de menos
intención. Revisar y escalar tras 3-4 semanas con datos.

---

## 2. Estructura de la campaña

**1 campaña de Búsqueda: `TVH — Vender — Garraf`**, con grupos de anuncios
temáticos y muy cerrados (cada grupo = una intención):

- **AG1 · Vender vivienda** — quien quiere vender ya.
- **AG2 · Valoración / cuánto vale** — quien tantea el precio (top del embudo).
- **AG3 · Inmobiliaria + vender** — quien busca agencia.
- **AG4 · Català** — las mismas intenciones en catalán.

Concordancia: **frase** y **exacta** (nada de amplia al principio).

---

## 3. Palabras clave

### AG1 — Vender vivienda (ES)
```
"vender piso vilanova"        [vender casa vilanova]
"vender piso sitges"          "vender casa sitges"
"vender piso cubelles"        "vender piso sant pere de ribes"
"vender casa canyelles"       "vender piso garraf"
"como vender mi piso"         "vender mi casa vilanova"
```
### AG2 — Valoración (ES)
```
"cuanto vale mi casa"         "cuanto vale mi piso vilanova"
"valoracion piso vilanova"    "valorar mi casa"
"tasacion piso vilanova"      "precio de mi casa vilanova"
```
### AG3 — Inmobiliaria (ES)
```
"inmobiliaria vilanova vender"   "mejor inmobiliaria vilanova"
"inmobiliaria sitges"            "agencia inmobiliaria garraf"
```
### AG4 — Català
```
"vendre pis vilanova"   "vendre casa vilanova"   "vendre pis sitges"
"quant val el meu pis"  "quant val casa meva"    "valoració pis vilanova"
"immobiliària vilanova vendre"
```

---

## 4. Palabras clave negativas (críticas — evitan malgastar)

Quien NO es un vendedor de tu zona:
```
alquiler, alquilar, lloguer, alquilar piso
comprar, compra, en venta, se vende, busco piso, busco casa   (compradores)
particular, entre particulares, sin comision, sin inmobiliaria, por mi cuenta   (quieren evitar agencia)
gratis, plantilla, modelo contrato
trabajo, empleo, feina, ofertas, curso, formacion, franquicia   (buscan empleo/negocio)
hipoteca, subasta, embargo, okupas, herencia impuestos
idealista, fotocasa, habitaclia   (buscan el portal, no a ti)
```
Revisar el **informe de términos de búsqueda** cada semana y seguir añadiendo.

---

## 5. Segmentación geográfica

- **Ubicaciones**: Vilanova i la Geltrú, Sant Pere de Ribes (incl. Les
  Roquetes), Sitges, Cubelles, Canyelles, Olivella. *(Alternativa: radio de
  ~10 km alrededor de Vilanova.)*
- **Opción de ubicación**: **«Presencia: personas que se encuentran o suelen
  estar en tus zonas»** — NUNCA «interés». Esto evita clics de fuera que solo
  «buscan sobre» esas zonas.
- Idiomas: Español y Catalán.

---

## 6. Estrategia de puja

1. **Semanas 1-3**: **Maximizar clics** con un límite de CPC de ~1,20 € (o CPC
   manual). Objetivo: reunir clics y las primeras conversiones.
2. **Cuando `generate_lead` haya saltado ~15 veces**: cambiar a **Maximizar
   conversiones**.
3. **Con ~30 conversiones/mes estables**: pasar a **CPA objetivo** con el coste
   por lead que te salga rentable.

No empezar en «Maximizar conversiones» sin historial: sin datos, puja a ciegas.

---

## 7. Recursos / extensiones (súbelos todos — suben CTR y Quality Score)

- **Enlaces de sitio (4)**: «Cómo te acompañamos» → `/vende-tu-casa#como`,
  «Quiénes somos» → `/quienes-somos`, «Ver propiedades» → `/propiedades`,
  «Valoración online» → `/valoracion`.
- **Textos destacados**: Valoración gratuita · Un solo asesor · Reportaje
  profesional incluido · Sin permanencias · Precio real de mercado ·
  Respuesta en 24 h.
- **Fragmentos estructurados** (tipo «Servicios»): Fotografía profesional,
  Tour virtual, Vídeo, Plano, Home staging, Difusión en portales.
- **Extensión de llamada**: 936 061 800 (y marca la conversión de llamada).
- **Ubicación**: vincula el perfil de Google Business.
- **Imágenes**: 2-3 de la landing (equipo / vivienda).

---

## 8. Anuncios (Responsive Search Ads)

### Castellano — Titulares (máx. 30 car.)
```
Vender tu casa en el Garraf
Valoración gratuita y real
Precio real, sin inflar
Un solo asesor, de A a Z
Reportaje profesional incluido
¿Cuánto vale tu casa?
Inmobiliaria en Vilanova
Vender bien no es suerte
Sin permanencias eternas
Te respondemos en 24 h
Fotos, vídeo y tour virtual
Agencia destacada en Idealista
Vender con tranquilidad
Tu casa, tratada como única
Valora tu casa sin compromiso
```
### Castellano — Descripciones (máx. 90 car.)
```
Valoración gratuita con cierres reales de tu zona. Un asesor, de la visita a la firma.
Precio real desde el primer día. Reportaje profesional incluido y sin permanencias.
Fotografía, vídeo y tour virtual en todas las casas. Te respondemos en menos de 24 h.
Inmobiliaria en Vilanova i la Geltrú. Vendemos tu casa como si fuera la única.
```
Ruta visible: `/vende-tu-casa` · URL final: `https://www.thevilahome.com/vende-tu-casa`

### Català — Titulars (màx. 30 car.)
```
Ven casa teva al Garraf
Valoració gratuïta i real
Preu real, sense inflar
Un sol assessor, de cap a peus
Reportatge professional inclòs
Quant val casa teva?
Immobiliària a Vilanova
Vendre bé no és sort
Sense permanències eternes
Et responem en 24 h
Fotos, vídeo i tour virtual
Agència destacada a Idealista
Vendre amb tranquil·litat
Casa teva, com si fos única
Valora-la sense compromís
```
### Català — Descripcions (màx. 90 car.)
```
Valoració gratuïta amb dades reals de la teva zona. Un assessor, de la visita a la signatura.
Preu real des del primer dia. Reportatge professional inclòs i sense permanències.
Fotografia, vídeo i tour virtual a totes les cases. Et responem en menys de 24 h.
Immobiliària a Vilanova i la Geltrú. Venem casa teva com si fos l'única.
```
URL final català: `https://www.thevilahome.com/vende-tu-casa?lang=ca`

> El `?lang=ca` hace que la landing (y el correo de confirmación) salgan en
> catalán. Concordancia anuncio↔landing = mejor Quality Score = menor coste.

---

## 9. Primera semana — checklist

- [ ] `NEXT_PUBLIC_GA_ID` en Vercel + redeploy.
- [ ] `generate_lead` marcado como conversión en GA4 e importado en Ads.
- [ ] Lead de prueba → confirmado en GA4 Tiempo real y en el email.
- [ ] Campaña creada con los 4 grupos, keywords y negativas.
- [ ] Geo por «presencia» + idiomas ES/CA.
- [ ] 2 RSA por grupo (ES) + grupo català.
- [ ] Todas las extensiones subidas.
- [ ] Puja en «Maximizar clics», 25 €/día.
- [ ] A los 7 días: revisar términos de búsqueda y añadir negativas.

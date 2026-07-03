# Landing de captación de vendedores — /vender (The Vila Home)

Documento resumen para explicar a una IA/chat cómo está construida esta landing y qué contiene.

## Qué es
Landing para **captar vendedores** (propietarios que quieren vender su casa) de la inmobiliaria The Vila Home (Vilanova i la Geltrú, Garraf/Penedès). Objetivo: transmitir **confianza, profesionalidad y cercanía**, explicar cómo trabajan y **convertir** (que dejen sus datos).

## Tecnología
- **Next.js 16 (App Router) + React 19 + TypeScript**.
- **Tailwind CSS v4** (estilos con clases utilitarias; colores como valores arbitrarios inline).
- Ruta: **`/vender`**. La página (`src/app/vender/page.tsx`) es un *server component*: define el SEO (metadata), obtiene las reseñas reales de Google y envuelve todo en el proveedor de idioma. Renderiza el componente cliente **`VenderContent`** (`src/components/vender/VenderContent.tsx`), donde vive toda la interfaz.
- Se despliega en Vercel (la web principal está conectada por Git).

## Idiomas (i18n)
- **4 idiomas: Español, Catalán, Inglés, Francés.**
- Todo el texto vive en **`src/lib/vender-content.ts`** (un objeto estructurado por idioma).
- **Autodetección**: si el visitante no ha elegido idioma, se muestra en el de su navegador; también se puede forzar por URL con `?lang=ca` / `?lang=en` / `?lang=fr` (útil para anuncios ya en un idioma). Selector manual ES·CA·EN·FR en la cabecera.

## Diseño / estilo
- **Hero (portada) oscuro y cinematográfico**: foto real del equipo a pantalla completa (a sangre), con degradado oscuro y **titular gigante en tipografía serif** (DM Serif Display). El titular va en 3 líneas. Debajo, un párrafo honesto, botón principal y **cifras animadas** (cuentan al aparecer): +450 familias, 4.9 ★, nº de reseñas reales. Estrellas de Google en **dorado**.
- **Cabecera fija** que cambia sola: transparente sobre el hero y **sólida (clara)** al hacer scroll (el logo pasa de blanco a negro).
- **Cuerpo en tono claro cálido** (piedra/greige), texto en tinta negra. Paleta sobria y **monocroma** (sin dorado "de escaparate" ni verde); el único color es el **dorado de las estrellas de Google**. El color real lo ponen las fotografías.
- **Tipografías**: DM Serif Display (titulares) + DM Sans (cuerpo). Sin cursivas.
- **Animaciones de aparición** al hacer scroll en casi todas las secciones.

## Secciones (de arriba a abajo)
1. **Hero** — titular + párrafo honesto + CTA + cifras animadas + reseña Google.
2. **Marquee** — banda con frases clave que se desplaza (precio real, un asesor, reportaje incluido, zonas donde trabajan, etc.).
3. **Cómo trabajamos (el método)** — 6 pasos numerados (01…06), cada uno con "qué hacemos" y "qué ganas tú".
4. **Cómo mostramos tu casa al mundo (marketing)** — carrusel horizontal de inmuebles + mockup de **web (PC)** y **reel de Instagram** con números reales (60.000 visualizaciones · 700 comentarios). Lista de entregables (foto pro, vídeo, plano, home staging, dron…) y canales de difusión.
5. **Tour 3D (Matterport)** — visor de **tour virtual navegable en 3D** (interactivo, se carga al hacer clic). Ahora con una demo; se sustituirá por los tours reales de los inmuebles.
6. **Qué incluye** — rejilla de servicios incluidos (precio real, un asesor, reportaje, difusión, informes, papeleo).
7. **Equipo** — fotos reales de las 3 personas (Ariadna, Sofía, Xavier) + enlace a Quiénes somos.
8. **Honestidad** — cita fuerte + puntos (precio real, sin exclusivas eternas, informes claros…).
9. **Reseñas reales** — se traen de la ficha de Google (API), se muestran **solo las de 5 estrellas** y el total/valoración son los reales.
10. **Contacto** — formulario de lead + vías alternativas (valoración online, WhatsApp, teléfono).
11. **Footer**.

## Conversión (llevar al formulario)
- **5 accesos al formulario**: cabecera, hero, tras el método, tras el tour, y un **botón flotante** siempre visible al bajar ("¿Cuánto vale tu casa?").
- El **botón flotante abre el formulario en una ventana emergente (modal)**, para rellenarlo desde cualquier punto sin bajar; se cierra con la X, tocando fuera o con Escape.
- El resto de botones hacen **scroll suave** hasta el formulario del final.

## Formulario (lead) — `LeadForm` + API `/api/vender-lead`
- Primero un selector de situación: *Quiero vender ahora / En los próximos meses / Solo estoy explorando / Ya está a la venta*.
- Campos: **Nombre, Teléfono, Correo electrónico, Zona** (obligatorios) y **Mensaje** (opcional). Etiquetas cortas + textos de ejemplo cercanos dentro de cada casilla.
- Protección **anti-bots (honeypot)** y limitación de envíos por IP.
- Al enviar, la API manda un **email** (vía Resend) a `info@thevilahome.com` con los datos, y muestra confirmación al usuario ("Recibido, gracias").

## Datos reales vs. placeholders
- **Reales**: reseñas de Google (5★, total y valoración en vivo), +450 familias, equipo, teléfono/WhatsApp, números del reel (60.000 · 700).
- **Placeholders pendientes de sustituir**: fotos de inmuebles (carrusel y mockup de web) y la **URL del tour real de Matterport**.

## Ficheros clave
- `src/app/vender/page.tsx` — página (SEO + datos + proveedores).
- `src/components/vender/VenderContent.tsx` — toda la landing (hero, secciones, modal, flotante).
- `src/components/vender/LeadForm.tsx` — formulario.
- `src/lib/vender-content.ts` — todos los textos en 4 idiomas.
- `src/app/api/vender-lead/route.ts` — envío del lead por email (Resend).
- `src/context/LanguageContext.tsx` — idioma + autodetección.
- `src/lib/googlePlaces.ts` — reseñas reales de Google.
- `src/components/ui/AnimateIn.tsx` y `CountUp.tsx` — animaciones de aparición y cifras que cuentan.

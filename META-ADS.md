# Meta Ads — configuración de conversiones (The Vila Home)

Guía operativa del seguimiento de conversiones de Meta (Facebook/Instagram) en la web.
El objetivo no es un número mágico de conversión, sino **medir de forma limpia y
completa** para que el algoritmo optimice por leads reales y baje el coste por lead.

## Cómo está montado (arquitectura)

Cada lead se mide por **dos vías con el mismo `eventId`**, así Meta deduplica y no
cuenta dos veces:

1. **Pixel de navegador** (`fbq`) — carga solo con consentimiento de marketing
   (cookie `tvh_consent`). Ver [`CookieConsentContext.tsx`](src/context/CookieConsentContext.tsx).
2. **Conversions API (CAPI), server-side** — envía el evento desde nuestro servidor
   con la PII hasheada (SHA-256). Recupera el 20-40 % de conversiones que el pixel de
   navegador pierde (iOS, bloqueadores). Ver [`meta-capi.ts`](src/lib/meta-capi.ts).

## Eventos que se disparan

| Página | Evento Meta | Vía | Dedup CAPI |
|---|---|---|---|
| `/vender` (form) | `Lead` | Pixel + CAPI | ✅ (`eventId`) |
| `/vende-tu-casa` (form Ads) | `Lead` | Pixel + CAPI | ✅ (`eventId`) |
| `/contacto` (clic tel/WhatsApp/email) | `Contact` | Pixel navegador | — (clic, sin server) |
| `/valoracion` (widget Idealista) | *pendiente de decidir* | — | — |

> `/valoracion` es un widget de terceros (Idealista) en shadow DOM: el lead se envía
> dentro del iframe/widget y no tenemos un evento de finalización fiable. **No se
> dispara `Lead` ahí** para no meter conversiones falsas que engañen al algoritmo.

## Variables de entorno (Vercel → Production + Preview)

```
NEXT_PUBLIC_META_PIXEL_ID   # ID del pixel/dataset (público; navegador + CAPI)
META_CAPI_ACCESS_TOKEN      # token de la Conversions API (secreto; solo servidor)
META_TEST_EVENT_CODE        # (opcional) para depurar en Events Manager → Test events
```

Mientras estas tres estén vacías, **todo el seguimiento está dormido** (no-op silencioso).
En cuanto se rellenen `NEXT_PUBLIC_META_PIXEL_ID` + `META_CAPI_ACCESS_TOKEN`, `/vender` y
`/vende-tu-casa` empiezan a medir sin tocar código.

## Convención de UTMs en los anuncios (IMPORTANTE)

El `fbclid` **no distingue** Instagram de Facebook. Para que en **Ora** se vea de dónde
entró cada lead, hay que añadir UTMs en el **parámetro de URL** de cada anuncio en Meta
Ads Manager (Ad level → *Website URL parameters*). Usar los parámetros dinámicos de Meta:

```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

- `utm_source={{site_source_name}}` → Meta lo rellena con `fb` (Facebook), `ig`
  (Instagram), `msg` (Messenger) o `an` (Audience Network). **Esto es lo que permite a
  Ora decir «entró por Instagram» vs «por Facebook» sin tocar código.**
- `utm_medium=paid_social` → marca el lead como Meta de pago (para agrupar en Ora).
- `{{campaign.name}}` / `{{ad.name}}` → campaña y anuncio concretos.

La web **ya captura y reenvía** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`
y `fbclid` a Ora en cada lead (ver [`attribution.ts`](src/lib/attribution.ts) y
[`api/vender-lead/route.ts`](src/app/api/vender-lead/route.ts)). No hace falta cambiar
nada en la web: basta con poner estas UTMs en los anuncios.

En **Ora** (repo `ora-nueva`), el listado de leads mapea el origen así:
`utm_medium=paid_social` + `utm_source=ig` → «Instagram (Ads)»; `…=fb` → «Facebook (Ads)»;
`gclid` presente → «Google Ads»; `fbclid` sin UTMs → «Meta»; nada → «Directo».

## Consentimiento (RGPD)

- El Pixel y el envío de identificadores de click (`fbclid`, `_fbp`, `_fbc`) solo se
  activan con **consentimiento de marketing** (banner de cookies → `tvh_consent`).
- La CAPI solo envía PII hasheada si hay ese consentimiento (`hasMarketingConsent`).
- La política de privacidad (4 idiomas) ya declara el uso de Meta Pixel + CAPI.

## Verificación tras enchufar

1. Events Manager → **Test events**: poner el código en `META_TEST_EVENT_CODE`, enviar
   un lead de prueba y confirmar que llega **un solo** `Lead` (Pixel + CAPI deduplicados).
2. Comprobar **Event Match Quality** del evento `Lead` (objetivo: bueno/alto — sube con
   email + teléfono + IP + user agent, que ya se envían).
3. Quitar `META_TEST_EVENT_CODE` cuando esté validado.

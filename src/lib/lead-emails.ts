/**
 * Plantillas de correo para los leads de captación (/vender).
 *
 *  1. Autorespuesta al vendedor  → confirmación inmediata, tono premium TVH,
 *     en su idioma. Responder rápido es lo que gana el encargo.
 *  2. Aviso interno al equipo     → todos los datos + atribución de campaña,
 *     para llamar en caliente y saber de qué anuncio viene.
 */

import type { Lang } from "@/lib/i18n";
import type { StoredLead } from "@/lib/leads-store";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Etiquetas legibles de la situación (por idioma) ──────────────────────────

const SITUATION_LABELS: Record<string, Record<Lang, string>> = {
  ahora: {
    es: "Quiere vender ahora",
    ca: "Vol vendre ara",
    en: "Wants to sell now",
    fr: "Veut vendre maintenant",
  },
  meses: {
    es: "Vende en los próximos meses",
    ca: "Ven en els pròxims mesos",
    en: "Selling in the coming months",
    fr: "Vend dans les prochains mois",
  },
  explorando: {
    es: "Está explorando, aún no lo tiene claro",
    ca: "Està explorant, encara no ho té clar",
    en: "Exploring, not decided yet",
    fr: "Se renseigne, pas encore décidé",
  },
  en_venta: {
    es: "Ya está a la venta (otra agencia o por su cuenta)",
    ca: "Ja està a la venda (altra agència o pel seu compte)",
    en: "Already listed (another agency or on their own)",
    fr: "Déjà en vente (autre agence ou par lui-même)",
  },
};

export function situationLabel(key: string, lang: Lang = "es"): string {
  return SITUATION_LABELS[key]?.[lang] ?? SITUATION_LABELS[key]?.es ?? "No especificada";
}

// ── Autorespuesta al vendedor ────────────────────────────────────────────────

interface AutoReplyCopy {
  subject: string;
  greeting: (name: string) => string;
  intro: string;
  reassure: string;
  next: string;
  meanwhile: string;
  siteCta: string;
  siteUrl: string;
  signoff: string;
  team: string;
  legal: string;
}

const AUTO_REPLY: Record<Lang, AutoReplyCopy> = {
  es: {
    subject: "Hemos recibido tu solicitud — The Vila Home",
    greeting: (n) => `Hola ${n},`,
    intro:
      "Gracias por escribirnos. Hemos recibido tu solicitud y ya está sobre nuestra mesa.",
    reassure:
      "No somos un call center: te atenderá una persona de nuestro equipo, no un número de expediente.",
    next: "Te llamaremos o escribiremos en menos de 24 horas laborables para entender tu caso y contarte, con honestidad, cómo te ayudaríamos.",
    meanwhile: "Mientras tanto, si quieres una primera idea del valor de tu casa:",
    siteCta: "Valoración online al instante",
    siteUrl: "https://www.thevilahome.com/valoracion",
    signoff: "Un saludo,",
    team: "El equipo de The Vila Home",
    legal: "Recibes este correo porque solicitaste información en thevilahome.com. No compartimos tus datos ni te llenamos el buzón de spam.",
  },
  ca: {
    subject: "Hem rebut la teva sol·licitud — The Vila Home",
    greeting: (n) => `Hola ${n},`,
    intro:
      "Gràcies per escriure'ns. Hem rebut la teva sol·licitud i ja la tenim sobre la taula.",
    reassure:
      "No som un call center: t'atendrà una persona del nostre equip, no un número d'expedient.",
    next: "Et trucarem o escriurem en menys de 24 hores laborables per entendre el teu cas i explicar-te, amb honestedat, com t'ajudaríem.",
    meanwhile: "Mentrestant, si vols una primera idea del valor de casa teva:",
    siteCta: "Valoració online a l'instant",
    siteUrl: "https://www.thevilahome.com/valoracion",
    signoff: "Una salutació,",
    team: "L'equip de The Vila Home",
    legal: "Reps aquest correu perquè vas sol·licitar informació a thevilahome.com. No compartim les teves dades ni t'omplim la bústia de spam.",
  },
  en: {
    subject: "We've received your request — The Vila Home",
    greeting: (n) => `Hi ${n},`,
    intro:
      "Thanks for reaching out. We've received your request and it's on our desk.",
    reassure:
      "We're not a call center: you'll be looked after by a real person from our team, not a case number.",
    next: "We'll call or write within 24 working hours to understand your case and tell you, honestly, how we'd help.",
    meanwhile: "In the meantime, if you'd like a first idea of what your home is worth:",
    siteCta: "Instant online valuation",
    siteUrl: "https://www.thevilahome.com/valoracion",
    signoff: "Best,",
    team: "The Vila Home team",
    legal: "You're receiving this email because you requested information at thevilahome.com. We don't share your data or fill your inbox with spam.",
  },
  fr: {
    subject: "Nous avons reçu votre demande — The Vila Home",
    greeting: (n) => `Bonjour ${n},`,
    intro:
      "Merci de nous avoir écrit. Nous avons bien reçu votre demande, elle est sur notre bureau.",
    reassure:
      "Nous ne sommes pas un call center : vous serez suivi par une vraie personne de notre équipe, pas un numéro de dossier.",
    next: "Nous vous appellerons ou écrirons sous 24 heures ouvrées pour comprendre votre cas et vous dire, en toute honnêteté, comment nous aiderions.",
    meanwhile: "En attendant, si vous voulez une première idée de la valeur de votre maison :",
    siteCta: "Estimation en ligne instantanée",
    siteUrl: "https://www.thevilahome.com/valoracion",
    signoff: "Cordialement,",
    team: "L'équipe The Vila Home",
    legal: "Vous recevez cet e-mail car vous avez demandé des informations sur thevilahome.com. Nous ne partageons pas vos données et n'inondons pas votre boîte de spam.",
  },
};

/** HTML de la autorespuesta al vendedor, en su idioma. */
export function buildAutoReplyEmail(name: string, lang: Lang): { subject: string; html: string } {
  const c = AUTO_REPLY[lang] ?? AUTO_REPLY.es;
  const firstName = escapeHtml((name.trim().split(/\s+/)[0] || name).trim());

  const html = `
  <div style="margin:0;padding:0;background:#f4f2ec">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1a18">
      <div style="text-align:center;margin-bottom:28px">
        <img src="https://www.thevilahome.com/images/email/logo.png" alt="The Vila Home" width="160" height="51" style="display:inline-block;width:160px;height:auto;border:0" />
      </div>
      <div style="background:#ffffff;border:1px solid #e6e4dd;border-radius:16px;padding:32px 28px">
        <p style="font-size:16px;margin:0 0 16px">${c.greeting(firstName)}</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#3a382f">${c.intro}</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 14px;color:#3a382f">${c.reassure}</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 22px;color:#3a382f"><strong style="color:#1a1a18">${c.next}</strong></p>
        <p style="font-size:14px;line-height:1.6;margin:0 0 14px;color:#6a6658">${c.meanwhile}</p>
        <p style="margin:0 0 8px">
          <a href="${c.siteUrl}" style="display:inline-block;background:#1c1913;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:999px">${c.siteCta}</a>
        </p>
        <p style="font-size:15px;line-height:1.6;margin:26px 0 0;color:#3a382f">${c.signoff}<br/><strong style="color:#1a1a18">${c.team}</strong></p>
      </div>
      <p style="font-size:11px;line-height:1.5;color:#a8a294;text-align:center;margin:20px 8px 0">${c.legal}</p>
    </div>
  </div>`;

  return { subject: c.subject, html };
}

// ── Aviso interno al equipo ──────────────────────────────────────────────────

// Idioma del lead (nombre nativo), para saber en qué idioma llamar.
const LANG_NAMES: Record<string, string> = {
  es: "Español",
  ca: "Català",
  en: "English",
  fr: "Français",
};

// Urgencia por situación: color del badge y microcopy de prioridad.
const SITUATION_URGENCY: Record<string, { bg: string; fg: string; tag: string }> = {
  ahora: { bg: "#0f7a4f", fg: "#ffffff", tag: "🔥 PRIORIDAD ALTA · llamar hoy" },
  en_venta: { bg: "#b0451e", fg: "#ffffff", tag: "⚡ Ya a la venta · llamar hoy" },
  meses: { bg: "#b8860b", fg: "#ffffff", tag: "Seguimiento · próximos meses" },
  explorando: { bg: "#5b6470", fg: "#ffffff", tag: "Nutrir · aún explorando" },
};

// Sólo dígitos, con prefijo 34 si parece un móvil español de 9 cifras.
function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 9) return "34" + digits;
  return digits;
}

function attrRow(label: string, value?: string): string {
  if (!value) return "";
  return `<tr><td style="padding:4px 14px 4px 0;color:#8a8578;font-size:12px;white-space:nowrap">${label}</td><td style="padding:4px 0;color:#2a281f;font-size:12px"><strong>${escapeHtml(value)}</strong></td></tr>`;
}

/** HTML del aviso al equipo, con todos los datos y la atribución de campaña. */
export function buildTeamEmail(lead: StoredLead): { subject: string; html: string } {
  const situation = situationLabel(lead.situation, "es");
  const urgency = SITUATION_URGENCY[lead.situation] ?? SITUATION_URGENCY.explorando;
  const langKey = (lead.lang || "es").toLowerCase();
  const langName = LANG_NAMES[langKey] ?? (lead.lang || "—");

  const source =
    lead.utm_source ||
    (lead.fbclid ? "facebook/instagram (fbclid)" : "") ||
    (lead.gclid ? "google (gclid)" : "") ||
    (lead.referrer ? "referido" : "directo/orgánico");

  const attrTable = [
    attrRow("Origen", source),
    attrRow("Campaña", lead.utm_campaign),
    attrRow("Anuncio / contenido", lead.utm_content),
    attrRow("Término", lead.utm_term),
    attrRow("Medio", lead.utm_medium),
    attrRow("Referrer", lead.referrer),
    attrRow("Landing", lead.landing),
  ]
    .filter(Boolean)
    .join("");

  const phone = escapeHtml(lead.phone);
  const wa = waNumber(lead.phone);
  const btn =
    "display:inline-block;text-decoration:none;font-size:14px;font-weight:600;padding:11px 18px;border-radius:999px;margin:0 8px 8px 0";

  const html = `
  <div style="margin:0;padding:0;background:#f4f2ec">
    <div style="max-width:600px;margin:0 auto;padding:32px 20px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1a18">

      <!-- Cabecera -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <span style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8a8578">The Vila Home · Captación</span>
      </div>

      <!-- Badge de urgencia -->
      <div style="margin-bottom:14px">
        <span style="display:inline-block;background:${urgency.bg};color:${urgency.fg};font-size:12px;font-weight:700;letter-spacing:0.04em;padding:6px 14px;border-radius:999px">${urgency.tag}</span>
      </div>

      <div style="background:#ffffff;border:1px solid #e6e4dd;border-radius:16px;padding:26px 24px">

        <h1 style="margin:0 0 2px;font-size:24px;line-height:1.2;color:#1a1a18">${escapeHtml(lead.name)}</h1>
        <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#4a473c">${escapeHtml(situation)}</p>
        <p style="margin:0 0 20px;font-size:13px;color:#8a8578">
          <span style="display:inline-block;background:#f4f2ec;border:1px solid #e6e4dd;border-radius:999px;padding:2px 10px;font-weight:600;color:#4a473c">Idioma: ${escapeHtml(langName)}</span>
          &nbsp;·&nbsp;${escapeHtml(new Date(lead.ts).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }))}
        </p>

        <!-- Acciones rápidas -->
        <div style="margin:0 0 18px">
          <a href="tel:${phone}" style="${btn};background:#1c1913;color:#ffffff">📞 Llamar</a>
          ${wa ? `<a href="https://wa.me/${wa}" style="${btn};background:#128c4a;color:#ffffff">💬 WhatsApp</a>` : ""}
          <a href="mailto:${escapeHtml(lead.email)}" style="${btn};background:#ffffff;color:#1c1913;border:1px solid #d9d6cd">✉️ Email</a>
        </div>

        <!-- Datos de contacto -->
        <table style="border-collapse:collapse;width:100%;font-size:14px">
          <tr><td style="padding:5px 14px 5px 0;color:#8a8578;width:96px">Teléfono</td><td style="padding:5px 0"><a href="tel:${phone}" style="color:#1c1913;font-weight:600;text-decoration:none">${phone}</a></td></tr>
          <tr><td style="padding:5px 14px 5px 0;color:#8a8578">Email</td><td style="padding:5px 0"><a href="mailto:${escapeHtml(lead.email)}" style="color:#1c1913;font-weight:600;text-decoration:none">${escapeHtml(lead.email)}</a></td></tr>
          ${lead.zone ? `<tr><td style="padding:5px 14px 5px 0;color:#8a8578;vertical-align:top">Zona</td><td style="padding:5px 0;color:#2a281f;font-weight:600">${escapeHtml(lead.zone)}</td></tr>` : ""}
        </table>

        ${
          lead.message
            ? `<div style="margin:16px 0 0;padding:14px 16px;background:#faf9f4;border-left:3px solid #c9c4b4;border-radius:0 8px 8px 0">
                 <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8a8578">Mensaje</p>
                 <p style="margin:0;font-size:14px;line-height:1.55;color:#2a281f">${escapeHtml(lead.message).replace(/\n/g, "<br/>")}</p>
               </div>`
            : ""
        }
      </div>

      <!-- Atribución -->
      <div style="margin-top:14px;padding:16px 20px;background:#efece3;border-radius:12px">
        <p style="color:#8a8578;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px">Atribución</p>
        <table style="border-collapse:collapse">${attrTable || attrRow("Origen", "directo/orgánico")}</table>
      </div>

      <p style="text-align:center;color:#b0ab9c;font-size:11px;margin:16px 0 0">Lead #${escapeHtml(lead.id)}</p>
    </div>
  </div>`;

  return {
    subject: `Nuevo lead (vender): ${lead.name} — ${situation}`,
    html,
  };
}

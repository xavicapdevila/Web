/**
 * Plantillas de correo para los leads de captación (/vender).
 *
 *  1. Autorespuesta al vendedor  → confirmación inmediata, tono premium TVH,
 *     en su idioma. Responder rápido es lo que gana el encargo.
 *  2. Aviso interno al equipo     → todos los datos + atribución de campaña,
 *     para llamar en caliente y saber de qué anuncio viene.
 */

import type { Lang } from "@/lib/i18n";
import type { Lead } from "@/lib/lead";

export function escapeHtml(s: string): string {
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
  headline: (name: string) => string;
  intro: string;
  next: string;
  meanwhileLabel: string;
  meanwhile: string;
  siteCta: string;
  siteUrl: string;
  disclaimer: string;
  signoff: string;
  team: string;
  legal: string;
}

const AUTO_REPLY: Record<Lang, AutoReplyCopy> = {
  es: {
    subject: "Hemos recibido tu solicitud — The Vila Home",
    headline: (n) => `Recibido, ${n}.`,
    intro: "Gracias por escribirnos. Ya tenemos tu mensaje.",
    next: "En menos de 24 horas laborables te llamamos o escribimos para conocer tu caso con calma y ver cómo podemos ayudarte. Sin compromiso.",
    meanwhileLabel: "Mientras tanto",
    meanwhile: "Calcula una primera estimación del valor de tu casa en un minuto.",
    siteCta: "Ver mi valoración",
    siteUrl: "https://www.thevilahome.com/valoracion",
    disclaimer:
      "Es una estimación automática y orientativa. Cuando conozcamos tu casa, te daremos nuestra recomendación de precio.",
    signoff: "Un saludo,",
    team: "El equipo de The Vila Home",
    legal: "Recibes este correo porque solicitaste información en thevilahome.com.<br/>No compartimos tus datos ni te llenamos el buzón de spam.",
  },
  ca: {
    subject: "Hem rebut la teva sol·licitud — The Vila Home",
    headline: (n) => `Rebut, ${n}.`,
    intro: "Gràcies per escriure'ns. Ja tenim el teu missatge.",
    next: "En menys de 24 hores laborables et truquem o escrivim per conèixer el teu cas amb calma i veure com podem ajudar-te. Sense compromís.",
    meanwhileLabel: "Mentrestant",
    meanwhile: "Calcula una primera estimació del valor de casa teva en un minut.",
    siteCta: "Veure la meva valoració",
    siteUrl: "https://www.thevilahome.com/valoracion",
    disclaimer:
      "És una estimació automàtica i orientativa. Quan coneguem casa teva, et donarem la nostra recomanació de preu.",
    signoff: "Una salutació,",
    team: "L'equip de The Vila Home",
    legal: "Reps aquest correu perquè vas sol·licitar informació a thevilahome.com.<br/>No compartim les teves dades ni t'omplim la bústia de spam.",
  },
  en: {
    subject: "We've received your request — The Vila Home",
    headline: (n) => `Got it, ${n}.`,
    intro: "Thanks for reaching out. We've got your message.",
    next: "Within 24 working hours we'll call or write to understand your case calmly and see how we can help. No commitment.",
    meanwhileLabel: "In the meantime",
    meanwhile: "Get a first estimate of your home's value in a minute.",
    siteCta: "See my valuation",
    siteUrl: "https://www.thevilahome.com/valoracion",
    disclaimer:
      "It's an automatic, indicative estimate. Once we get to know your home, we'll give you our recommended price.",
    signoff: "Best,",
    team: "The Vila Home team",
    legal: "You're receiving this email because you requested information at thevilahome.com.<br/>We don't share your data or fill your inbox with spam.",
  },
  fr: {
    subject: "Nous avons reçu votre demande — The Vila Home",
    headline: (n) => `Bien reçu, ${n}.`,
    intro: "Merci de nous avoir écrit. Nous avons bien votre message.",
    next: "En moins de 24 heures ouvrées, nous vous appelons ou écrivons pour comprendre votre situation en toute tranquillité et voir comment nous pouvons vous aider. Sans engagement.",
    meanwhileLabel: "En attendant",
    meanwhile: "Obtenez une première estimation de la valeur de votre maison en une minute.",
    siteCta: "Voir mon estimation",
    siteUrl: "https://www.thevilahome.com/valoracion",
    disclaimer:
      "C'est une estimation automatique et indicative. Une fois que nous connaîtrons votre maison, nous vous donnerons notre recommandation de prix.",
    signoff: "Cordialement,",
    team: "L'équipe The Vila Home",
    legal: "Vous recevez cet e-mail car vous avez demandé des informations sur thevilahome.com.<br/>Nous ne partageons pas vos données et n'inondons pas votre boîte de spam.",
  },
};

const BODY_FONT = "font-family:'Inter','Helvetica Neue',Arial,sans-serif";
const DISPLAY_FONT = "font-family:'Inter Tight','Helvetica Neue',Arial,sans-serif";

const REGLA = `<div style="height:1px;background:#ececec;margin:34px 0;font-size:0;line-height:0">&nbsp;</div>`;

/**
 * Maqueta compartida de las autorespuestas (logo, tipografía, regla, firma y
 * pie legal). Cada correo aporta solo su `cuerpo`: así un retoque de marca se
 * hace una vez y vale para todos.
 */
function shellAutoReply(o: {
  headline: string;
  cuerpo: string;
  signoff: string;
  team: string;
  legal: string;
}): string {
  return `
  <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700;800&display=swap');</style>
  <div style="margin:0;padding:0;background:#ececec">
    <div style="max-width:560px;margin:0 auto;padding:36px 18px">
      <div style="background:#ffffff;border-radius:6px;overflow:hidden">
        <div style="height:4px;background:#111111;font-size:0;line-height:0">&nbsp;</div>
        <div style="padding:44px 42px 36px;${BODY_FONT};color:#454545">

          <img src="https://www.thevilahome.com/images/email/logo.png" alt="The Vila Home" width="150" style="display:block;width:150px;height:auto;border:0" />

          <div style="height:1px;background:#ececec;margin:28px 0 32px;font-size:0;line-height:0">&nbsp;</div>

          <p style="${DISPLAY_FONT};font-size:30px;font-weight:600;letter-spacing:-.025em;line-height:1.15;margin:0 0 22px;color:#111111">${o.headline}</p>
${o.cuerpo}
          <div style="height:1px;background:#ececec;margin:34px 0 26px;font-size:0;line-height:0">&nbsp;</div>

          <p style="font-size:15px;line-height:1.6;margin:0;color:#454545">${o.signoff}<br/><strong style="color:#111111;font-weight:600">${o.team}</strong></p>

        </div>
      </div>
      <p style="${BODY_FONT};font-size:11px;line-height:1.6;color:#9a9a9a;text-align:center;margin:22px 12px 0">${o.legal}</p>
    </div>
  </div>`;
}

/** Nombre de pila, escapado. */
function primerNombre(name: string): string {
  return escapeHtml((name.trim().split(/\s+/)[0] || name).trim());
}

/** HTML de la autorespuesta al vendedor, en su idioma. */
export function buildAutoReplyEmail(name: string, lang: Lang): { subject: string; html: string } {
  const c = AUTO_REPLY[lang] ?? AUTO_REPLY.es;

  const cuerpo = `
          <p style="font-size:15px;line-height:1.75;margin:0 0 15px;color:#454545">${c.intro}</p>
          <p style="font-size:15px;line-height:1.75;margin:0;color:#454545">${c.next}</p>

          ${REGLA}

          <p style="font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#9a9a9a;margin:0 0 8px">${c.meanwhileLabel}</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#454545">${c.meanwhile}</p>
          <a href="${c.siteUrl}" style="display:inline-block;${DISPLAY_FONT};background:#111111;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:.01em;padding:15px 30px;border-radius:8px">${c.siteCta}&nbsp;&rarr;</a>
          <p style="font-size:13px;line-height:1.6;margin:16px 0 0;color:#8f8f8f">${c.disclaimer}</p>
`;

  return {
    subject: c.subject,
    html: shellAutoReply({
      headline: c.headline(primerNombre(name)),
      cuerpo,
      signoff: c.signoff,
      team: c.team,
      legal: c.legal,
    }),
  };
}

// ── Acuse de recibo de una candidatura (/links → «Treballa amb nosaltres») ────

type JobsReplyCopy = {
  subject: string;
  headline: (name: string) => string;
  intro: string;
  next: string;
  signoff: string;
  team: string;
  legal: string;
};

/**
 * A propósito NO promete responder a todo el mundo ni dar una negativa: solo
 * dice que si encaja, se le escribe. Prometer lo que no se va a cumplir es peor
 * que no prometer nada.
 */
const JOBS_REPLY: Record<Lang, JobsReplyCopy> = {
  es: {
    subject: "Hemos recibido tu CV — The Vila Home",
    headline: (n) => `Recibido, ${n}.`,
    intro: "Gracias por pensar en nosotros. Tu CV ya está en nuestras manos.",
    next: "Lo leemos con calma, uno a uno. Si encaja con lo que buscamos, nos ponemos en contacto contigo.",
    signoff: "Un saludo,",
    team: "El equipo de The Vila Home",
    legal: "Recibes este correo porque nos enviaste tu candidatura desde thevilahome.com.<br/>Conservamos tu CV un máximo de 12 meses para este proceso de selección.",
  },
  ca: {
    subject: "Hem rebut el teu CV — The Vila Home",
    headline: (n) => `Rebut, ${n}.`,
    intro: "Gràcies per pensar en nosaltres. Ja tenim el teu CV.",
    next: "El llegim amb calma, un a un. Si encaixa amb el que busquem, ens posem en contacte amb tu.",
    signoff: "Una salutació,",
    team: "L'equip de The Vila Home",
    legal: "Reps aquest correu perquè ens vas enviar la teva candidatura des de thevilahome.com.<br/>Conservem el teu CV un màxim de 12 mesos per a aquest procés de selecció.",
  },
  en: {
    subject: "We've received your CV — The Vila Home",
    headline: (n) => `Got it, ${n}.`,
    intro: "Thanks for thinking of us. Your CV is in our hands.",
    next: "We read every one carefully. If it's a fit for what we're looking for, we'll get in touch.",
    signoff: "Best,",
    team: "The Vila Home team",
    legal: "You're receiving this email because you sent us your application at thevilahome.com.<br/>We keep your CV for a maximum of 12 months for this selection process.",
  },
  fr: {
    subject: "Nous avons bien reçu votre CV — The Vila Home",
    headline: (n) => `Bien reçu, ${n}.`,
    intro: "Merci d'avoir pensé à nous. Nous avons bien votre CV.",
    next: "Nous le lisons attentivement, un par un. S'il correspond à ce que nous cherchons, nous vous contactons.",
    signoff: "Cordialement,",
    team: "L'équipe The Vila Home",
    legal: "Vous recevez cet e-mail car vous nous avez envoyé votre candidature sur thevilahome.com.<br/>Nous conservons votre CV pendant 12 mois maximum pour ce processus de recrutement.",
  },
};

/** Acuse de recibo al candidato, en su idioma. Sin CTA: no hay nada que venderle. */
export function buildJobsReplyEmail(name: string, lang: Lang): { subject: string; html: string } {
  const c = JOBS_REPLY[lang] ?? JOBS_REPLY.es;

  const cuerpo = `
          <p style="font-size:15px;line-height:1.75;margin:0 0 15px;color:#454545">${c.intro}</p>
          <p style="font-size:15px;line-height:1.75;margin:0;color:#454545">${c.next}</p>
`;

  return {
    subject: c.subject,
    html: shellAutoReply({
      headline: c.headline(primerNombre(name)),
      cuerpo,
      signoff: c.signoff,
      team: c.team,
      legal: c.legal,
    }),
  };
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
  ahora: { bg: "#111111", fg: "#ffffff", tag: "Prioridad alta · llamar hoy" },
  en_venta: { bg: "#b0451e", fg: "#ffffff", tag: "Ya a la venta · llamar hoy" },
  meses: { bg: "#5b6470", fg: "#ffffff", tag: "Seguimiento · próximos meses" },
  explorando: { bg: "#9a9a9a", fg: "#ffffff", tag: "Nutrir · aún explorando" },
};

// Sólo dígitos, con prefijo 34 si parece un móvil español de 9 cifras.
function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 9) return "34" + digits;
  return digits;
}

// Etiqueta legible del formulario de origen (qué landing generó el lead).
const SOURCE_LABELS: Record<string, string> = {
  "como-trabajamos": "Web · Pon tu precio",
  "vender-preview": "Web · Vender",
  vender: "Web · Vender",
};

// Origen legible del lead (de dónde viene), a partir de UTMs / click ids.
function originLabel(lead: Lead): string {
  const s = (lead.utm_source || "").toLowerCase();
  if (s.includes("google")) return "Google";
  if (s.includes("insta")) return "Instagram";
  if (s.includes("facebook") || s === "fb" || s === "meta") return "Facebook";
  if (s.includes("bing")) return "Bing";
  if (s.includes("tiktok")) return "TikTok";
  if (s) return s.charAt(0).toUpperCase() + s.slice(1);
  if (lead.gclid) return "Google Ads";
  if (lead.fbclid) return "Instagram / Facebook";
  if (lead.referrer) return "Web referida";
  return "Directo / orgánico";
}

/** HTML del aviso al equipo, con todos los datos y la atribución de campaña. */
export function buildTeamEmail(lead: Lead): { subject: string; html: string } {
  const situation = situationLabel(lead.situation, "es");
  const urgency = SITUATION_URGENCY[lead.situation] ?? SITUATION_URGENCY.explorando;
  const langKey = (lead.lang || "es").toLowerCase();
  const langName = LANG_NAMES[langKey] ?? (lead.lang || "—");

  // El origen prioriza el formulario (landing) sobre la atribución de campaña.
  const sourceKey = (lead.source || "").toLowerCase();
  const origin = escapeHtml(SOURCE_LABELS[sourceKey] ?? originLabel(lead));
  const campaign = lead.utm_campaign ? escapeHtml(lead.utm_campaign) : "";

  const phone = escapeHtml(lead.phone);
  const wa = waNumber(lead.phone);
  const body = "font-family:'Inter','Helvetica Neue',Arial,sans-serif";
  const display = "font-family:'Inter Tight','Helvetica Neue',Arial,sans-serif";
  const btn =
    "display:inline-block;" + body + ";text-decoration:none;font-size:13px;font-weight:600;padding:11px 20px;border-radius:8px;margin:0 8px 8px 0";

  const html = `
  <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700;800&display=swap');</style>
  <div style="margin:0;padding:0;background:#ececec">
    <div style="max-width:600px;margin:0 auto;padding:32px 18px;${body};color:#454545">

      <p style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#9a9a9a;margin:0 0 14px">The Vila Home · Captación</p>

      <div style="background:#ffffff;border-radius:6px;overflow:hidden">
        <div style="height:4px;background:#111111;font-size:0;line-height:0">&nbsp;</div>
        <div style="padding:32px 30px">

          <div style="margin-bottom:16px">
            <span style="display:inline-block;background:${urgency.bg};color:${urgency.fg};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;padding:6px 14px;border-radius:999px">${urgency.tag}</span>
          </div>

          <h1 style="${display};margin:0 0 4px;font-size:28px;font-weight:600;letter-spacing:-0.02em;line-height:1.15;color:#111111">${escapeHtml(lead.name)}</h1>
          <p style="margin:0 0 14px;font-size:15px;font-weight:500;color:#454545">${escapeHtml(situation)}</p>

          <p style="margin:0 0 22px;font-size:12px;color:#9a9a9a">
            <span style="display:inline-block;background:#f4f4f3;border:1px solid #e6e6e4;border-radius:999px;padding:2px 10px;font-weight:600;color:#454545">${escapeHtml(langName)}</span>
            &nbsp;·&nbsp;${escapeHtml(new Date(lead.ts).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }))}
          </p>

          <div style="margin:0 0 20px">
            <a href="tel:${phone}" style="${btn};background:#111111;color:#ffffff">Llamar</a>
            ${wa ? `<a href="https://wa.me/${wa}" style="${btn};background:#12a150;color:#ffffff">WhatsApp</a>` : ""}
            <a href="mailto:${escapeHtml(lead.email)}" style="${btn};background:#ffffff;color:#111111;border:1px solid #d9d9d6">Email</a>
          </div>

          <div style="height:1px;background:#ececec;margin:0 0 18px;font-size:0;line-height:0">&nbsp;</div>

          <table style="border-collapse:collapse;width:100%;font-size:14px">
            <tr><td style="padding:5px 14px 5px 0;color:#9a9a9a;width:90px">Teléfono</td><td style="padding:5px 0"><a href="tel:${phone}" style="color:#111111;font-weight:600;text-decoration:none">${phone}</a></td></tr>
            <tr><td style="padding:5px 14px 5px 0;color:#9a9a9a">Email</td><td style="padding:5px 0"><a href="mailto:${escapeHtml(lead.email)}" style="color:#111111;font-weight:600;text-decoration:none">${escapeHtml(lead.email)}</a></td></tr>
            ${lead.zone ? `<tr><td style="padding:5px 14px 5px 0;color:#9a9a9a;vertical-align:top">Zona</td><td style="padding:5px 0;color:#222222;font-weight:600">${escapeHtml(lead.zone)}</td></tr>` : ""}
            ${lead.precio ? `<tr><td style="padding:5px 14px 5px 0;color:#9a9a9a;vertical-align:top">Precio pensado</td><td style="padding:5px 0;color:#222222;font-weight:600">${escapeHtml(lead.precio)}</td></tr>` : ""}
          </table>

          ${
            lead.message
              ? `<div style="margin:18px 0 0;padding:16px 18px;background:#f7f7f6;border-radius:6px">
                   <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;font-weight:600;color:#9a9a9a">Mensaje</p>
                   <p style="margin:0;font-size:14px;line-height:1.6;color:#222222">${escapeHtml(lead.message).replace(/\n/g, "<br/>")}</p>
                 </div>`
              : ""
          }
        </div>
      </div>

      <div style="margin-top:14px;padding:16px 20px;background:#e4e4e2;border-radius:6px">
        <span style="color:#8a8a8a;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;font-weight:600">Origen</span>
        <span style="margin-left:12px;font-size:14px;font-weight:600;color:#222222">${origin}</span>${campaign ? `<span style="margin-left:8px;font-size:13px;color:#9a9a9a">· ${campaign}</span>` : ""}
      </div>

      <p style="text-align:center;color:#b0b0b0;font-size:11px;margin:16px 0 0">Lead #${escapeHtml(lead.id)}</p>
    </div>
  </div>`;

  const subjectTag = SOURCE_LABELS[sourceKey] ?? "Web · Vender";
  return {
    subject: `Nuevo lead · ${subjectTag}: ${lead.name}${lead.precio ? ` — ${lead.precio}` : ` — ${situation}`}`,
    html,
  };
}

// ── Aviso interno «Dinos tu precio» (landing de campaña) ─────────────────────

/** Etiquetas legibles del «¿Cuándo te lo planteas?» (para el equipo, en ES). */
export const TIMELINE_LABELS: Record<string, string> = {
  vender_ya: "Quiere venderla ya",
  venta_activa: "Ya está en venta",
  proximos_meses: "Próximos meses",
  solo_curiosidad: "Solo quiere saberlo",
};

const TIMELINE_URGENCY: Record<string, { bg: string; fg: string; tag: string }> = {
  vender_ya: { bg: "#111111", fg: "#ffffff", tag: "🔥 Vender YA · llamar ahora" },
  venta_activa: { bg: "#b0451e", fg: "#ffffff", tag: "Ya a la venta · llamar hoy" },
  proximos_meses: { bg: "#5b6470", fg: "#ffffff", tag: "Seguimiento · próximos meses" },
  solo_curiosidad: { bg: "#9a9a9a", fg: "#ffffff", tag: "Curiosidad · nutrir" },
};

/**
 * Aviso al equipo de un lead de la landing «Dinos tu precio». El asunto sigue
 * el formato `💰 {precio} € · {municipio} · {cuándo}` con prefijo 🔥 si quiere
 * vender ya. El form no pide email (a propósito): contacto solo por
 * teléfono/WhatsApp.
 */
export function buildTuPrecioTeamEmail(lead: Lead): { subject: string; html: string } {
  const timeline = TIMELINE_LABELS[lead.situation] ?? lead.situation;
  const urgency = TIMELINE_URGENCY[lead.situation] ?? TIMELINE_URGENCY.solo_curiosidad;
  const langKey = (lead.lang || "es").toLowerCase();
  const langName = LANG_NAMES[langKey] ?? (lead.lang || "—");

  const precio = (lead.precio_esperado ?? 0).toLocaleString("es-ES");
  const origin = escapeHtml(originLabel(lead));
  const campaign = lead.utm_campaign ? escapeHtml(lead.utm_campaign) : "";
  const adName = lead.utm_content ? escapeHtml(lead.utm_content) : "";

  const phone = escapeHtml(lead.phone);
  const wa = waNumber(lead.phone);
  const body = "font-family:'Inter','Helvetica Neue',Arial,sans-serif";
  const display = "font-family:'Inter Tight','Helvetica Neue',Arial,sans-serif";
  const btn =
    "display:inline-block;" + body + ";text-decoration:none;font-size:13px;font-weight:600;padding:11px 20px;border-radius:8px;margin:0 8px 8px 0";

  const html = `
  <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700;800&display=swap');</style>
  <div style="margin:0;padding:0;background:#ececec">
    <div style="max-width:600px;margin:0 auto;padding:32px 18px;${body};color:#454545">

      <p style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#9a9a9a;margin:0 0 14px">The Vila Home · Campaña «Dinos tu precio»</p>

      <div style="background:#ffffff;border-radius:6px;overflow:hidden">
        <div style="height:4px;background:#111111;font-size:0;line-height:0">&nbsp;</div>
        <div style="padding:32px 30px">

          <div style="margin-bottom:16px">
            <span style="display:inline-block;background:${urgency.bg};color:${urgency.fg};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;padding:6px 14px;border-radius:999px">${urgency.tag}</span>
          </div>

          <h1 style="${display};margin:0 0 2px;font-size:34px;font-weight:700;letter-spacing:-0.02em;line-height:1.1;color:#111111">${precio}&nbsp;€</h1>
          <p style="margin:0 0 14px;font-size:15px;font-weight:500;color:#454545">${escapeHtml(lead.zone)} · ${escapeHtml(lead.tipo ?? "—")}</p>

          <p style="margin:0 0 22px;font-size:12px;color:#9a9a9a">
            <span style="display:inline-block;background:#f4f4f3;border:1px solid #e6e6e4;border-radius:999px;padding:2px 10px;font-weight:600;color:#454545">${escapeHtml(langName)}</span>
            &nbsp;·&nbsp;${escapeHtml(new Date(lead.ts).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }))}
          </p>

          <div style="margin:0 0 20px">
            <a href="tel:${phone}" style="${btn};background:#111111;color:#ffffff">Llamar</a>
            ${wa ? `<a href="https://wa.me/${wa}" style="${btn};background:#12a150;color:#ffffff">WhatsApp</a>` : ""}
          </div>

          <div style="height:1px;background:#ececec;margin:0 0 18px;font-size:0;line-height:0">&nbsp;</div>

          <table style="border-collapse:collapse;width:100%;font-size:14px">
            <tr><td style="padding:5px 14px 5px 0;color:#9a9a9a;width:110px">Nombre</td><td style="padding:5px 0;color:#111111;font-weight:600">${escapeHtml(lead.name)}</td></tr>
            <tr><td style="padding:5px 14px 5px 0;color:#9a9a9a">Móvil</td><td style="padding:5px 0"><a href="tel:${phone}" style="color:#111111;font-weight:600;text-decoration:none">${phone}</a></td></tr>
            <tr><td style="padding:5px 14px 5px 0;color:#9a9a9a">Precio esperado</td><td style="padding:5px 0;color:#111111;font-weight:600">${precio} €</td></tr>
            <tr><td style="padding:5px 14px 5px 0;color:#9a9a9a">Municipio</td><td style="padding:5px 0;color:#222222;font-weight:600">${escapeHtml(lead.zone)}</td></tr>
            <tr><td style="padding:5px 14px 5px 0;color:#9a9a9a">Tipo</td><td style="padding:5px 0;color:#222222;font-weight:600">${escapeHtml(lead.tipo ?? "—")}</td></tr>
            <tr><td style="padding:5px 14px 5px 0;color:#9a9a9a">Cuándo</td><td style="padding:5px 0;color:#222222;font-weight:600">${escapeHtml(timeline)}</td></tr>
          </table>
        </div>
      </div>

      <div style="margin-top:14px;padding:16px 20px;background:#e4e4e2;border-radius:6px">
        <span style="color:#8a8a8a;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;font-weight:600">Origen</span>
        <span style="margin-left:12px;font-size:14px;font-weight:600;color:#222222">${origin}</span>${campaign ? `<span style="margin-left:8px;font-size:13px;color:#9a9a9a">· ${campaign}</span>` : ""}${adName ? `<span style="margin-left:8px;font-size:13px;color:#9a9a9a">· ${adName}</span>` : ""}
      </div>

      <p style="text-align:center;color:#b0b0b0;font-size:11px;margin:16px 0 0">Lead #${escapeHtml(lead.id)} · ${escapeHtml(lead.landing ?? "")}</p>
    </div>
  </div>`;

  const hot = lead.situation === "vender_ya" ? "🔥 " : "";
  return {
    subject: `${hot}💰 ${precio} € · ${lead.zone} · ${timeline}`,
    html,
  };
}

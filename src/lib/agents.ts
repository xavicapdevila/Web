/**
 * Single source of truth for agent contact information.
 * Used by PropertyCard, the property detail page, and any other component
 * that needs to display or contact a specific agent.
 */

export interface AgentInfo {
  name: string;
  photo: string;
  /** WhatsApp-compatible number (no + or spaces, e.g. "34638359612") */
  mobile: string;
}

/** Known agents, keyed by their email address. */
export const AGENTS: Record<string, AgentInfo> = {
  "a.garcia@thevilahome.com": {
    name:   "Ariadna Garcia",
    photo:  "/images/agents/ariadna.jpg",
    mobile: "34680526196",
  },
  "x.capdevila@thevilahome.com": {
    name:   "Xavier Capdevila",
    photo:  "/images/agents/xavier.jpg",
    mobile: "34638359612",
  },
  "s.pascual@thevilahome.com": {
    name:   "Sofía Pascual",
    photo:  "/images/agents/sofia.jpg",
    mobile: "34679876331",
  },
};

/** Fallback when the property has no agent or an unrecognised email. */
export const DEFAULT_AGENT: AgentInfo = {
  name:   "The Vila Home",
  photo:  "/images/agents/equipo.jpg",
  mobile: "34638359612",
};

/**
 * Returns the agent info for the given email, falling back to DEFAULT_AGENT.
 * Also returns the contact email to use for enquiries.
 */
export function getAgentInfo(email?: string): AgentInfo & { contactEmail: string } {
  const agent = email ? (AGENTS[email] ?? null) : null;
  return {
    ...(agent ?? DEFAULT_AGENT),
    contactEmail: agent ? email! : "info@thevilahome.com",
  };
}

/**
 * Builds the WhatsApp deep-link URL for a property enquiry directed to the
 * responsible agent (or the generic office number if agent is unknown).
 */
export function buildAgentWhatsApp(
  agentEmail: string | undefined,
  propertyTitulo: string,
  propertyRef: string,
  propertyUrl: string,
): string {
  const { mobile } = getAgentInfo(agentEmail);
  const text = encodeURIComponent(
    `Hola, he visto la propiedad ${propertyTitulo} (Ref. ${propertyRef}) en vuestra web y me gustaría recibir más información.\n\n${propertyUrl}`,
  );
  return `https://wa.me/${mobile}?text=${text}`;
}

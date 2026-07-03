import sanitizeHtml from "sanitize-html";

/**
 * Allow-list sanitizer for blog rich-text HTML (authored in the admin Tiptap
 * editor). Strips <script>, event handlers, javascript: URLs, <iframe>, etc.
 * so stored content can never become a stored-XSS vector when rendered with
 * dangerouslySetInnerHTML.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "blockquote", "pre", "code",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "strong", "b", "em", "i", "u", "s", "sub", "sup", "mark", "small",
    "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td",
    "span", "div",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    "*": ["class", "style"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  // Links that open in a new tab get a safe rel.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
  // Inline styles limited to a harmless subset (no url()/expression()).
  allowedStyles: {
    "*": {
      "text-align": [/^(left|right|center|justify)$/],
      // Full-match regexes: an open-ended /^rgb\(/ would accept anything after
      // the paren (e.g. extra declarations smuggled into the value).
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\(\s*\d{1,3}(\s*,\s*\d{1,3}){2}(\s*,\s*(0|1|0?\.\d+))?\s*\)$/i],
      "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgba?\(\s*\d{1,3}(\s*,\s*\d{1,3}){2}(\s*,\s*(0|1|0?\.\d+))?\s*\)$/i],
    },
  },
};

export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS);
}

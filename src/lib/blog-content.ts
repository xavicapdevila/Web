/**
 * Normalises the HTML body of a blog post before it is rendered.
 *
 * Posts authored in the admin (Tiptap) sometimes contain internal links as
 * absolute URLs — and inconsistently with or without the `www.` host. Those
 * cause an extra 301 hop (non-www → www) and are fragile if the domain ever
 * changes. We rewrite every internal `thevilahome.com` link to a relative path
 * so it resolves to 200 on the current host with no redirect.
 *
 * Runs on the server so the HTML that Google crawls already carries clean,
 * relative links (no dependency on client hydration).
 */
export function normalizeBlogContent(html: string): string {
  if (!html) return html;

  return html
    // Internal absolute link with a path → keep just the path (drops www/non-www hop)
    .replace(/https?:\/\/(?:www\.)?thevilahome\.com(\/[^\s"'<>]*)/gi, "$1")
    // Bare origin (no path) → homepage
    .replace(/https?:\/\/(?:www\.)?thevilahome\.com(?=["'\s<>])/gi, "/");
}

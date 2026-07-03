import { NextRequest, NextResponse } from "next/server";

/**
 * Canonicaliza el host (dominio antiguo o sin www → www.thevilahome.com) y
 * añade x-pathname para quien lo necesite. NOTA: el layout raíz ya NO lee
 * este header (lo haría dinámico); el chrome se decide en <PublicChrome>.
 */

// Dominios propios antiguos: 301 al dominio canónico para consolidar SEO y
// matar las webs zombi del índice de Google. Para que funcione, cada dominio
// debe estar dado de alta en el proyecto de Vercel y su DNS apuntando allí.
const LEGACY_HOSTS = [
  "thevilahome.es",
  "www.thevilahome.es",
  "thevilahomebcn.com",
  "www.thevilahomebcn.com",
];

export function middleware(request: NextRequest) {
  const hostname =
    request.headers.get("x-forwarded-host")?.split(",")[0].trim() ||
    request.headers.get("host")?.split(":")[0] ||
    request.nextUrl.hostname;

  if (hostname === "thevilahome.com" || LEGACY_HOSTS.includes(hostname)) {
    const url = request.nextUrl.clone();
    url.hostname = "www.thevilahome.com";
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url.toString(), 301);
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: "/:path*",
};

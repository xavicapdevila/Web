import { NextRequest, NextResponse } from "next/server";

/**
 * Adds x-pathname header so Server Component layouts can read the
 * current path (needed to hide public Navbar/Footer on /admin routes).
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (host === "thevilahome.com") {
    const url = new URL(request.url);
    url.host = "www.thevilahome.com";
    return NextResponse.redirect(url.toString(), 301);
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: "/:path*",
};

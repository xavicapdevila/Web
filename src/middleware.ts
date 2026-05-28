import { NextRequest, NextResponse } from "next/server";

/**
 * Adds x-pathname header so Server Component layouts can read the
 * current path (needed to hide public Navbar/Footer on /admin routes).
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: "/:path*",
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_SESION, verificarToken } from "@/lib/auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_SESION)?.value;
  const sesion = token ? await verificarToken(token) : null;

  const esLogin = pathname === "/admin" || pathname === "/admin/";

  if (esLogin) {
    if (sesion) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!sesion) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};

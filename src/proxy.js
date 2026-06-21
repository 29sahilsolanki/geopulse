import { auth0 } from "./lib/auth0";
import { NextResponse } from "next/server";

export async function proxy(request) {
  const authResponse = await auth0.middleware(request);
  const session = await auth0.getSession(request);

  const { pathname } = request.nextUrl;

  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/worker", request.url));
  }

  const isProtectedRoute =
    pathname.startsWith("/worker") || pathname.startsWith("/manager");

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return authResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

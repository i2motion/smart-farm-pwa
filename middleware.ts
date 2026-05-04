import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";

function isAuthed(req: NextRequest) {
  return req.cookies.get(AUTH_COOKIE_NAME)?.value === "1";
}

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/sensors",
  "/devices",
  "/cameras",
  "/auto-manual",
  "/alarms",
  "/work",
  "/weather",
  "/greenhouses",
  "/alarms-work",
  "/auction",
  "/settings",
] as const;

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = isAuthed(req);

  if (isProtectedPath(pathname)) {
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/login") {
    if (authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = authed ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/sensors",
    "/sensors/:path*",
    "/devices",
    "/devices/:path*",
    "/cameras",
    "/cameras/:path*",
    "/auto-manual",
    "/auto-manual/:path*",
    "/alarms",
    "/alarms/:path*",
    "/work",
    "/work/:path*",
    "/weather",
    "/weather/:path*",
    "/greenhouses",
    "/greenhouses/:path*",
    "/auction",
    "/auction/:path*",
    "/settings",
    "/settings/:path*",
    "/alarms-work",
    "/alarms-work/:path*",
  ],
};

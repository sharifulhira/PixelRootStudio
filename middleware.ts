import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "pixelroot-studio-secret-key-change-in-production-32chars"
);

const COOKIE_NAME = "pixelroot_session";
const PROTECTED_PATHS = ["/admin"];
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    
    const expiresAt = new Date(payload.expiresAt as string);
    if (new Date() > expiresAt) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if path needs protection
  const isProtectedPath = PROTECTED_PATHS.some((p) => path.startsWith(p));
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) => path === p);
  
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get(COOKIE_NAME)?.value;
  
  // Allow public admin paths (login page)
  if (isPublicAdminPath) {
    // If already logged in, redirect to admin dashboard
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }
  
  // Check for valid session
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  
  const payload = await verifyToken(token);
  
  if (!payload) {
    // Invalid or expired session
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
  
  // Session is valid, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

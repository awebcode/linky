import { Role } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { verifyJwt } from "./lib/utils";
const LOGIN_ROUTES = ["/"]; // Routes that require no authentication
const PROTECTED_ROUTES = ["/chat"]; // Routes that require authentication
const ADMIN_ROUTES = ["/admin", "/dashboard"]; // Admin-specific routes
const PUBLIC_ROUTES = ["/reset-password", "/forgot-password"]; // Public routes

// Middleware wrapped with auth to get user data from req.auth
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const payload = await verifyJwt({
    token: token as string,
    secret: process.env.AUTH_SECRET!,
  }) 
 
  const isLoggedIn = !!payload?.id; // Check if user is logged in
  const isAdmin = payload?.role === Role.ADMIN; // Check if user has admin role
  const urlPath = req.nextUrl.pathname;
  // Allow public routes to be accessed without authentication
  if (PUBLIC_ROUTES.includes(urlPath)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users from protected routes like /chat
  if (!isLoggedIn && PROTECTED_ROUTES.includes(urlPath)) {
    return NextResponse.redirect(new URL("/?tab=login", req.url));
  }

  // Redirect authenticated users from login routes (e.g., /sign-in, /sign-up)
  if (isLoggedIn && LOGIN_ROUTES.includes(urlPath)) {
    return NextResponse.redirect(new URL("/chat", req.url)); // Redirect to /chat or other page
  }

  // Redirect non-admins from admin routes
  if (ADMIN_ROUTES.includes(urlPath) && !isAdmin) {
    return NextResponse.redirect(new URL("/chat", req.url)); // Redirect to /chat or another page for non-admins
  }

  // Allow access to protected routes for authenticated users or admins
  return NextResponse.next();
}

// Middleware configuration to match all routes except API, static, and images
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

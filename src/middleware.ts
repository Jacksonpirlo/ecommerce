import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const allowedOrigins = [
  'http://localhost:3000',        // Web development
  'http://localhost:8081',        // React Native Metro
  'https://ecommerce-drab-six.vercel.app', // Production web
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;
    const origin = req.headers.get('origin');

    // Determine CORS origin for native apps or allowed origins
    const corsOrigin = 
      (typeof origin === "string" && allowedOrigins.includes(origin)) 
        ? origin 
        : origin === null || !origin
          ? allowedOrigins[0]
          : null;

    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
      const preflightRes = NextResponse.json({}, { status: 204 });
      
      if (corsOrigin) {
        preflightRes.headers.set('Access-Control-Allow-Origin', corsOrigin);
        preflightRes.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        preflightRes.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        preflightRes.headers.set('Access-Control-Allow-Credentials', 'true');
      }
      
      return preflightRes;
    }

    const res = NextResponse.next();

    // Apply CORS headers to actual request
    if (corsOrigin) {
      res.headers.set('Access-Control-Allow-Origin', corsOrigin);
      res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    if (pathname.startsWith('/api/auth/')) {
      return res;
    }

    if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return res;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/api/auth/')) {
          return true;
        }
        return true;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",      
    "/auth/login",
    "/auth/register",
    "/api/auth/:path*",
    "/api/:path*",
  ],
};
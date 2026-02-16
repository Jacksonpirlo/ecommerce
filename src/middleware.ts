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

    const res = NextResponse.next();

    // CORS for allowed origins OR native apps (without origin or null)
    if (
      (typeof origin === "string" && allowedOrigins.includes(origin)) ||
      origin === null ||
      !origin
    ) {
      // If origin exists and is in the list, use that origin
      // If no origin (native app), use a valid origin from the list
      const corsOrigin = origin && allowedOrigins.includes(origin) 
        ? origin 
        : allowedOrigins[0];

      res.headers.set('Access-Control-Allow-Origin', corsOrigin);
      res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: res.headers });
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
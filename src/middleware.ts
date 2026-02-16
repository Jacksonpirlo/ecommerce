import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const allowedOrigins = [
  'http://localhost:3000',        // Dev web
  'http://localhost:8081',        // React Native Metro
  'https://ecommerce-drab-six.vercel.app', // Producción web
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;
    const origin = req.headers.get('origin');

    const res = NextResponse.next();

    if (typeof origin === "string" && allowedOrigins.includes(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin);
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
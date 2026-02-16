import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const allowedOrigins = [
  'http://localhost:3000',        // Dev web
  'http://localhost:8081',        // React Native
  'http://localhost:19006',       // Expo web
  // 'exp://127.0.0.1:19000',        // Expo dev
  'https://ecommerce-drab-six.vercel.app', // Producción web
];



export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;
    const origin = req.headers.get('origin');

    // Logs para debugging (opcional, puedes comentar después)
    console.log('🔍 Middleware ejecutado para:', pathname);
    console.log('🌐 Origin:', origin);
    console.log('✅ Origin permitido?', origin ? allowedOrigins.includes(origin) : false);

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

    if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return res; // Devuelve la respuesta con CORS aplicada
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir rutas de callback sin token
        if (req.nextUrl.pathname.startsWith('/auth/callback')) {
          return true;
        }
        return true; // Manejo de autorización en el middleware
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
    "/auth/callback/:path*",  // Rutas de callback de NextAuth
    "/api/:path*",             // Todas las rutas de API para CORS
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8081',
  'https://ecommerce-drab-six.vercel.app',
];

function applyCorsHeaders(res: NextResponse, origin: string | null) {
  if (typeof origin === "string" && allowedOrigins.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get('origin');

  // Handle CORS for all API routes
  if (pathname.startsWith('/api/')) {
    if (req.method === 'OPTIONS') {
      const preflightRes = new NextResponse(null, { status: 200 });
      return applyCorsHeaders(preflightRes, origin);
    }
    
    const res = NextResponse.next();
    return applyCorsHeaders(res, origin);
  }

  // Handle authentication for non-API routes
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",      
    "/auth/login",
    "/auth/register",
    "/api/auth/:path*",
    "/api/:path*",
  ],
};
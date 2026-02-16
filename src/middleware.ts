import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = [
  'http://localhost:3000',        // Web development
  'http://localhost:8081',        // React Native Metro
  'https://ecommerce-drab-six.vercel.app', // Production web
];

function applyCorsHeaders(res: NextResponse, origin: string | null) {
  let corsOrigin: string | null = null;
  let allowCredentials = true;

  if (typeof origin === "string" && allowedOrigins.includes(origin)) {
    corsOrigin = origin;
  } else if (origin === null || !origin) {
    // For native apps without origin, use wildcard
    corsOrigin = '*';
    allowCredentials = false; // Cannot use credentials with wildcard
  }

  if (corsOrigin) {
    res.headers.set('Access-Control-Allow-Origin', corsOrigin);
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (allowCredentials) {
      res.headers.set('Access-Control-Allow-Credentials', 'true');
    }
  }
  
  return res;
}

function handleApiRoutes(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get('origin');

  if (pathname.startsWith('/api/')) {
    if (req.method === 'OPTIONS') {
      const preflightRes = new NextResponse(null, { status: 204 });
      return applyCorsHeaders(preflightRes, origin);
    }
    
    const res = NextResponse.next();
    return applyCorsHeaders(res, origin);
  }

  return null;
}

export default withAuth(
  function middleware(req) {
    // Handle API routes (including NextAuth) before withAuth processing
    const apiResponse = handleApiRoutes(req as NextRequest);
    if (apiResponse) {
      return apiResponse;
    }

    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req }) => {
        // Always allow API routes
        if (req.nextUrl.pathname.startsWith('/api/')) {
          return true;
        }
        // Allow all other routes (handle auth in middleware function)
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
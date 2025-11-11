import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    // Si está logeado y trata de ir al login o register, redirigir al dashboard
    if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Si NO está logeado y trata de ir al dashboard u otra ruta protegida
    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Si pasa todas las condiciones, continúa
    return NextResponse.next();
  },
  {
    callbacks: {
      // Autoriza todas las peticiones, pero el middleware arriba maneja las redirecciones
      authorized: ({ token }) => true,
    },
    pages: {
      signIn: "/auth/login", // Página de login personalizada
    },
  }
);

// Indica qué rutas van a pasar por este middleware
export const config = {
  matcher: [
    "/dashboard/:path*", // Protege todas las rutas del dashboard
    "/auth/login",       // Controla el acceso al login
    "/auth/register",    // Controla el acceso al registro
  ],
};

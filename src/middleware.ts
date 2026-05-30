import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Proteger ruta de configuración (Solo ADMIN)
    if (path.startsWith("/configuracion") && token?.rol !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Definir qué rutas requieren autenticación
export const config = {
  matcher: [
    "/((?!api|login|public|static|.*\\..*|favicon.ico).*)",
  ],
};

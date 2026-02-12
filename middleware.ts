import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Proteção de Admin
    if (path.startsWith("/admin/usuarios") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // 2. BLOQUEIO DE SENHA PADRÃO
    // Se a senha for a padrão, força ir para a página de troca
    if (
      token?.isDefaultPassword === true &&
      !path.startsWith("/admin/perfil/senha") &&
      !path.startsWith("/api/auth/signout") // Permite logout
    ) {
      return NextResponse.redirect(new URL("/admin/perfil/senha", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin/login")) return true;
        return !!token;
      },
    },
    pages: { signIn: "/admin/login" },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

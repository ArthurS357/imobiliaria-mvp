import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // REGRA EXTRA DE SEGURANÇA:
    // Se o usuário tentar acessar a gestão de usuários (/admin/usuarios)
    // mas não for um ADMIN, redireciona ele para o Dashboard.
    if (
      req.nextUrl.pathname.startsWith("/admin/usuarios") &&
      req.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        // 1. Se for a página de login, PERMITIR acesso sempre
        // Usamos startsWith para garantir que /admin/login/ não quebre
        if (path.startsWith("/admin/login")) {
          return true;
        }

        // 2. Para qualquer outra rota dentro do matcher, EXIGIR token (estar logado)
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    // Protege todo o painel administrativo
    "/admin/:path*",
    // Protege rotas de API admin
    "/api/admin/:path*",
  ],
};
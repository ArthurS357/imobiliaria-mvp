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

        // 1. Se for a página de login, PERMITIR acesso sempre (evita loop infinito)
        if (path === "/admin/login") {
          return true;
        }

        // 2. Para qualquer outra rota dentro do matcher, EXIGIR token (estar logado)
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login", // Define a página de login customizada
    },
  }
);

export const config = {
  matcher: [
    // Protege todo o painel administrativo (incluindo sub-rotas)
    "/admin/:path*",
    
    // Protege também as rotas de API administrativas para evitar acesso direto
    "/api/admin/:path*",
  ],
};
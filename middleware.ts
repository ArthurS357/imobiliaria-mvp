import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  // Protege todas as rotas que começam com /admin
  matcher: ["/admin/:path*"],
};
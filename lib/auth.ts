import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { DEFAULT_USER_PASSWORD } from "@/lib/constants";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validação dos dados de entrada (Zod)
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          throw new Error("Dados inválidos.");
        }

        const { email, password } = result.data;

        // 2. Busca o usuário no banco
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Credenciais inválidas.");
        }

        // 3. Verifica a senha fornecida
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Credenciais inválidas.");
        }

        // 4. LÓGICA SEM BANCO DE DADOS (ZERO DB CHANGES):
        // Verifica se a senha atual do usuário é igual à senha padrão do sistema.
        // Se for igual, marcaremos a flag isDefaultPassword como true.
        let isDefaultPassword = false;

        if (DEFAULT_USER_PASSWORD) {
          isDefaultPassword = await bcrypt.compare(
            DEFAULT_USER_PASSWORD,
            user.password,
          );
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isDefaultPassword: isDefaultPassword, // Passamos a flag para o token
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Atualização inicial no login
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isDefaultPassword = user.isDefaultPassword;
      }

      // Suporte para atualizar a sessão via cliente (update())
      // Útil quando o usuário acaba de trocar a senha e queremos remover o bloqueio sem relogar
      if (trigger === "update" && session) {
        token.isDefaultPassword = session.isDefaultPassword;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isDefaultPassword = token.isDefaultPassword;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

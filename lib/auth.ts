import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations"; // <--- Importamos o schema de validação

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                // 1. Validação de Segurança com Zod
                // Verifica se o formato do email e tamanho da senha estão corretos antes de ir ao banco
                const result = loginSchema.safeParse(credentials);

                if (!result.success) {
                    throw new Error("Dados inválidos. Verifique email e senha.");
                }

                const { email, password } = result.data;

                // 2. Busca no Banco de Dados
                const user = await prisma.user.findUnique({
                    where: { email }
                });

                if (!user || !user.password) {
                    throw new Error("Usuário não encontrado.");
                }

                // 3. Verifica a Senha (Hash)
                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Senha incorreta.");
                }

                // 4. Retorna o usuário para a sessão
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/admin/login", // Página customizada de login
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
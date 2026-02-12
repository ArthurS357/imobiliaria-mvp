import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

const DEFAULT_PASSWORD_CHECK = "Mat026!"; // A mesma senha usada no reset

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                const result = loginSchema.safeParse(credentials);
                if (!result.success) throw new Error("Dados inválidos.");

                const { email, password } = result.data;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password) throw new Error("Credenciais inválidas.");

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) throw new Error("Credenciais inválidas.");

                // LÓGICA SEM BANCO DE DADOS:
                // Verifica se a senha atual é igual à senha padrão
                const isDefaultPassword = await bcrypt.compare(
                    DEFAULT_PASSWORD_CHECK,
                    user.password,
                );

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isDefaultPassword: isDefaultPassword, // Passamos isso para frente
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.isDefaultPassword = user.isDefaultPassword;
            }
            // Atualização via client-side
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

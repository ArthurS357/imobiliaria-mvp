import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
    try {
        // Busca as variáveis configuradas no painel da Vercel
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            return NextResponse.json({
                error: "ERRO: Variáveis ADMIN_EMAIL ou ADMIN_PASSWORD não encontradas.",
                solucao: "Vá em Settings > Environment Variables na Vercel e adicione essas chaves."
            }, { status: 400 });
        }

        // Criptografa a senha
        const passwordHash = await hash(password, 10);

        // Cria ou Atualiza o usuário no Banco de Dados
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: passwordHash,
                role: "ADMIN",
            },
            create: {
                email,
                name: "Admin Recuperado",
                password: passwordHash,
                role: "ADMIN",
            },
        });

        return NextResponse.json({
            success: true,
            message: "✅ Usuário Admin criado com sucesso!",
            dados: {
                email: user.email,
                role: user.role,
                aviso: "Agora tente fazer login. Depois, apague este arquivo por segurança."
            }
        });

    } catch (error) {
        return NextResponse.json({
            error: "Erro ao conectar no banco de dados",
            details: String(error)
        }, { status: 500 });
    }
}
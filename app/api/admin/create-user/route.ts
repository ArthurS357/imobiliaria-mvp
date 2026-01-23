import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { getServerSession } from "next-auth"; // Importar sessão
import { authOptions } from "../../auth/[...nextauth]/route"; // Importar configs

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        // 1. SEGURANÇA: Pegar sessão do servidor
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        // Verificar se é ADMIN de verdade (via Banco ou Sessão)
        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Acesso negado. Apenas administradores." },
                { status: 403 }
            );
        }

        const data = await request.json();
        const { email, name } = data; // NÃO precisamos mais receber currentUserId

        // 2. Verificar se o email já existe
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return NextResponse.json(
                { error: "Este e-mail já está cadastrado." },
                { status: 400 }
            );
        }

        // 3. Gerar senha e criar usuário (Igual ao anterior)
        const generatedPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: "FUNCIONARIO",
            },
        });

        // 4. Enviar e-mail (Igual ao anterior)
        await resend.emails.send({
            from: "Imobiliaria MVP <onboarding@resend.dev>", // Use o domínio de teste do Resend se não tiver um próprio ainda
            to: email,
            subject: "Acesso ao Sistema Imobiliário",
            html: `<p>Login: ${email} <br /> Senha: ${generatedPassword}</p>`,
        });

        return NextResponse.json({
            message: "Usuário criado com segurança!",
            userId: newUser.id
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Importação corrigida
import { prisma } from "@/lib/prisma";    // Importação corrigida

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        // 1. SEGURANÇA: Pegar sessão do servidor
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Acesso negado. Apenas administradores." },
                { status: 403 }
            );
        }

        const data = await request.json();
        const { email, name } = data;

        // 2. Verificar duplicidade
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return NextResponse.json(
                { error: "Este e-mail já está cadastrado." },
                { status: 400 }
            );
        }

        // 3. Criar usuário
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

        // 4. Enviar e-mail
        await resend.emails.send({
            from: "Imobiliaria MVP <onboarding@resend.dev>", // Altere para seu domínio verificado quando tiver
            to: email,
            subject: "Acesso ao Sistema Imobiliário",
            html: `<p>Olá ${name},<br/>Login: ${email} <br /> Senha: ${generatedPassword}</p>`,
        });

        return NextResponse.json({
            message: "Usuário criado com sucesso!",
            userId: newUser.id
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}
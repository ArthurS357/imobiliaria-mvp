import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, name, currentUserId } = data; // currentUserId vem da sessão do frontend

    // 1. SEGURANÇA: Verificar se quem está chamando é ADMIN
    const requester = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (!requester || requester.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem criar contas." },
        { status: 403 }
      );
    }

    // 2. Verificar se o email já existe
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 400 }
      );
    }

    // 3. Gerar senha aleatória (8 caracteres)
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // 4. Criar o usuário no Banco de Dados
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "FUNCIONARIO", // Padrão é funcionário
      },
    });

    // 5. Enviar e-mail automático com o Resend
    await resend.emails.send({
      from: "Imobiliaria MVP <nao-responda@seudominio.com>", // Configure seu domínio no Resend
      to: email,
      subject: "Bem-vindo à Equipe! Suas credenciais de acesso.",
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h1>Olá, ${name}!</h1>
          <p>Sua conta foi criada com sucesso no sistema da imobiliária.</p>
          <p>Aqui estão seus dados de acesso:</p>
          <ul>
            <li><strong>Login:</strong> ${email}</li>
            <li><strong>Senha Provisória:</strong> ${generatedPassword}</li>
          </ul>
          <p>Recomendamos que você troque sua senha no primeiro acesso.</p>
          <a href="https://seu-site-mvp.vercel.app/login" style="background-color: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Acessar Sistema</a>
        </div>
      `,
    });

    return NextResponse.json({ 
      message: "Usuário criado e e-mail enviado com sucesso!",
      userId: newUser.id 
    });

  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
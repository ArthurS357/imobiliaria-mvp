import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Resend } from "resend";
import { DEFAULT_USER_PASSWORD } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // 1. Segurança: Apenas ADMIN pode criar usuários
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // 2. Verificação de Integridade do Sistema
    // Garante que a senha padrão foi carregada do .env antes de prosseguir
    if (!DEFAULT_USER_PASSWORD) {
      console.error("ERRO CRÍTICO: DEFAULT_USER_PASSWORD não definida no .env");
      return NextResponse.json(
        {
          error: "Erro de configuração no servidor. Contate o suporte.",
        },
        { status: 500 },
      );
    }

    const data = await request.json();
    // Removemos 'password' da desestruturação pois usaremos a padrão
    const { name, email, role, creci } = data;

    // Validação básica
    if (!email || !name) {
      return NextResponse.json(
        { error: "Nome e Email são obrigatórios" },
        { status: 400 },
      );
    }

    // Verifica se já existe
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 },
      );
    }

    // 3. Cria o usuário no banco com a Senha Padrão
    // Custo do hash aumentado para 12 conforme requisitos de segurança
    const hashedPassword = await hash(DEFAULT_USER_PASSWORD, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "FUNCIONARIO",
        creci: creci || null,
      },
    });

    // 4. Envia o Email de Boas-Vindas
    let emailSent = false;

    const fromEmail = process.env.EMAIL_FROM || "contato@matielloimoveis.com.br";
    const fromName = "Matiello Imóveis";
    const appUrl = process.env.NEXTAUTH_URL || "https://matielloimoveis.com.br";

    try {
      const { error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        subject: "Bem-vindo à Equipe! Suas credenciais de acesso",
        html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #1e3a8a; padding: 24px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Bem-vindo, ${name}!</h1>
                    </div>
                    <div style="padding: 32px;">
                        <p style="font-size: 16px; line-height: 1.5;">Olá,</p>
                        <p style="font-size: 16px; line-height: 1.5;">É um prazer ter você em nossa equipe. Sua conta foi criada com sucesso pelo administrador.</p>
                        <p style="font-size: 16px; line-height: 1.5;">Aqui estão suas informações para acessar o painel:</p>
                        
                        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 24px 0;">
                            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 0;"><strong>Senha Provisória:</strong> ${DEFAULT_USER_PASSWORD}</p>
                            ${creci ? `<p style="margin: 10px 0 0 0;"><strong>CRECI:</strong> ${creci}</p>` : ""}
                        </div>
                        
                        <p style="font-size: 14px; color: #666;">
                            ⚠️ <strong>Importante:</strong> Por segurança, você será solicitado a alterar esta senha no seu primeiro acesso.
                        </p>
                        
                        <div style="text-align: center; margin-top: 32px;">
                            <a href="${appUrl}/admin/login" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Acessar Sistema</a>
                        </div>
                    </div>
                    <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
                        <p>© 2026 Imobiliária MVP. Todos os direitos reservados.</p>
                    </div>
                </div>
            `,
      });

      if (error) {
        console.error("Resend API Error:", error);
        emailSent = false;
      } else {
        console.log("Email de boas-vindas enviado para:", email);
        emailSent = true;
      }
    } catch (emailError) {
      console.error("Erro inesperado no envio de email:", emailError);
      emailSent = false;
    }

    // 5. Retorna sucesso
    return NextResponse.json({
      success: true,
      emailSent: emailSent,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar usuário" },
      { status: 500 },
    );
  }
}

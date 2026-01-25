import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        // 1. Segurança: Apenas ADMIN pode criar usuários
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const data = await request.json();
        const { name, email, password, role, creci } = data;

        // Validação básica
        if (!email || !password || !name) {
            return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
        }

        // Verifica se já existe
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
        }

        // 2. Cria o usuário no banco
        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "FUNCIONARIO",
                creci: creci || null,
            },
        });

        // 3. Envia o Email de Boas-Vindas
        let emailSent = false;

        // Define o remetente: usa variável de ambiente ou fallback para o teste
        // Em produção, configure EMAIL_FROM=nao-responda@seudominio.com.br
        const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
        const fromName = "Matiello Imóveis";

        try {
            const { error } = await resend.emails.send({
                from: `${fromName} <${fromEmail}>`,
                to: email,
                subject: 'Bem-vindo à Equipe! Suas credenciais de acesso',
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
                            <p style="margin: 0;"><strong>Senha Provisória:</strong> ${password}</p>
                            ${creci ? `<p style="margin: 10px 0 0 0;"><strong>CRECI:</strong> ${creci}</p>` : ''}
                        </div>
                        
                        <p style="font-size: 14px; color: #666;">Recomendamos que você anote essas informações com carinho ou troque sua senha no primeiro acesso.</p>
                        
                        <div style="text-align: center; margin-top: 32px;">
                            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/login" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Acessar Sistema</a>
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

        // 4. Retorna sucesso da criação + status do email
        return NextResponse.json({
            success: true,
            emailSent: emailSent, // O frontend pode usar isso para exibir um alerta se for false
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });

    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return NextResponse.json({ error: "Erro interno ao criar usuário" }, { status: 500 });
    }
}
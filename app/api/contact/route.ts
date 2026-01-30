import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";
import { Resend } from "resend";

// Inicializa o Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Validação
        const validation = leadSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { name, email, phone, message } = validation.data;

        // 2. Salva no Banco de Dados
        const lead = await prisma.lead.create({
            data: { name, email, phone, message },
        });

        // 3. Envia Notificação por E-mail
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Matiello Imóveis <nao-responda@matielloimoveis.com.br>',

                // Envia para o email profissional E para o backup
                to: ['contato@matielloimoveis.com.br', 'matielloimoveis07@gmail.com'],

                // CORREÇÃO: Usar 'replyTo' em vez de 'reply_to'
                replyTo: email,

                subject: `🔔 Novo Lead: ${name}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f5; padding: 20px; border-radius: 8px;">
                        <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h2 style="color: #1a202c; margin-top: 0;">Novo Cliente Interessado 🎉</h2>
                            <p style="color: #4a5568; font-size: 16px;">Você recebeu uma nova mensagem através do site.</p>
                            
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                            
                            <div style="margin-bottom: 16px;">
                                <p style="margin: 0; font-size: 12px; color: #718096; text-transform: uppercase; letter-spacing: 0.05em;">Nome</p>
                                <p style="margin: 4px 0 0; font-size: 16px; color: #2d3748; font-weight: 600;">${name}</p>
                            </div>

                            <div style="margin-bottom: 16px;">
                                <p style="margin: 0; font-size: 12px; color: #718096; text-transform: uppercase; letter-spacing: 0.05em;">Contato</p>
                                <p style="margin: 4px 0 0; font-size: 16px; color: #2d3748;">
                                    <a href="mailto:${email}" style="color: #3182ce; text-decoration: none;">${email}</a>
                                </p>
                                <p style="margin: 4px 0 0; font-size: 14px; color: #4a5568;">${phone || "Telefone não informado"}</p>
                            </div>

                            <div style="margin-bottom: 24px;">
                                <p style="margin: 0; font-size: 12px; color: #718096; text-transform: uppercase; letter-spacing: 0.05em;">Mensagem</p>
                                <div style="margin-top: 8px; background-color: #edf2f7; padding: 12px; border-radius: 4px; border-left: 4px solid #3182ce; color: #2d3748;">
                                    ${message}
                                </div>
                            </div>
                            
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                            
                            <p style="font-size: 12px; color: #a0aec0; text-align: center;">
                                Este e-mail foi enviado automaticamente pelo site Matiello Imóveis.
                            </p>
                        </div>
                    </div>
                `
            });
        }

        return NextResponse.json(lead, { status: 201 });
    } catch (error) {
        console.error("Erro no contato:", error);
        return NextResponse.json(
            { error: "Erro ao processar solicitação" },
            { status: 500 }
        );
    }
}
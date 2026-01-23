import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validação básica
        if (!data.name || !data.email || !data.message) {
            return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
        }

        const lead = await prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                message: data.message,
            },
        });

        return NextResponse.json(lead);
    } catch (error) {
        console.error("Erro ao salvar lead:", error);
        return NextResponse.json({ error: "Erro interno ao salvar mensagem." }, { status: 500 });
    }
}
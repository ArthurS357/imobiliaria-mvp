import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations"; // Importe o Zod

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // VALIDAÇÃO ZOD
        const validation = leadSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { name, email, phone, message } = validation.data;

        const lead = await prisma.lead.create({
            data: { name, email, phone, message },
        });

        return NextResponse.json(lead, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 });
    }
}
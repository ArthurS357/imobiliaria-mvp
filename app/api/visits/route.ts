import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { visitSchema } from "@/lib/validations";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // LOG PARA DEBUG (Veja isso no seu terminal do VS Code)
        console.log("Dados recebidos:", body);

        const validation = visitSchema.safeParse(body);

        if (!validation.success) {
            // LOG DO ERRO DE VALIDAÇÃO
            console.error("Erro Zod:", JSON.stringify(validation.error.format(), null, 2));

            return NextResponse.json(
                {
                    error: "Dados inválidos",
                    details: validation.error.format()
                },
                { status: 400 }
            );
        }

        const { propertyId, date, timeOfDay, name, email, phone } = validation.data;

        const newVisit = await prisma.visit.create({
            data: {
                propertyId,
                date: new Date(date),
                timeOfDay,
                name,
                email,
                phone: phone || null, // Garante que string vazia vire null
                status: "PENDENTE",
            },
        });

        return NextResponse.json(newVisit, { status: 201 });

    } catch (error) {
        console.error("Erro ao agendar visita:", error);
        return NextResponse.json({ error: "Erro interno ao agendar" }, { status: 500 });
    }
}

// O método GET permanece igual ao anterior...
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }
        const where = session.user.role === "ADMIN" ? {} : { assignedToId: session.user.id };
        const visits = await prisma.visit.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { property: { select: { titulo: true, bairro: true } } }
        });
        return NextResponse.json(visits);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar visitas" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { visitSchema } from "@/lib/validations";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // LOG PARA DEBUG
        console.log("Dados recebidos:", body);

        const validation = visitSchema.safeParse(body);

        if (!validation.success) {
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

        // 1. BUSCAR O IMÓVEL PARA SABER QUEM É O CORRETOR (DONO)
        // Isso é crucial para que o corretor veja a visita no painel dele automaticamente
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { corretorId: true }
        });

        if (!property) {
            return NextResponse.json({ error: "Imóvel não encontrado para agendamento." }, { status: 404 });
        }

        // 2. CRIAR A VISITA JÁ ATRIBUÍDA AO CORRETOR DO IMÓVEL
        const newVisit = await prisma.visit.create({
            data: {
                propertyId,
                date: new Date(date),
                timeOfDay,
                name,
                email,
                phone: phone || null,
                status: "PENDENTE",
                // AQUI ESTÁ A MÁGICA: Atribui direto ao dono do imóvel
                assignedToId: property.corretorId
            },
        });

        return NextResponse.json(newVisit, { status: 201 });

    } catch (error) {
        console.error("Erro ao agendar visita:", error);
        return NextResponse.json({ error: "Erro interno ao agendar" }, { status: 500 });
    }
}

// O método GET permanece igual, pois ele já filtra pelo assignedToId corretamente
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // Se for ADMIN, vê tudo. Se for CORRETOR, vê só o que foi atribuído a ele (pela lógica acima)
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
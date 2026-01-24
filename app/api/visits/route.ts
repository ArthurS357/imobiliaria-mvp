import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST: Criar uma nova visita (Público - usado pelo VisitScheduler)
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { propertyId, date, timeOfDay, name, email, phone } = data;

        // Validação básica
        if (!propertyId || !date || !timeOfDay || !name || !email) {
            return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
        }

        const newVisit = await prisma.visit.create({
            data: {
                propertyId,
                date: new Date(date), // Converte string "YYYY-MM-DD" para Date
                timeOfDay,
                name,
                email,
                phone,
                status: "PENDENTE", // Padrão
            },
        });

        return NextResponse.json(newVisit, { status: 201 });
    } catch (error) {
        console.error("Erro ao agendar visita:", error);
        return NextResponse.json({ error: "Erro interno ao agendar" }, { status: 500 });
    }
}

// GET: Listar visitas (Protegido - Apenas Admin ou Corretor)
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // Se for ADMIN vê todas, se for FUNCIONARIO vê apenas as suas
        const where = session.user.role === "ADMIN"
            ? {}
            : { assignedToId: session.user.id };

        const visits = await prisma.visit.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                property: {
                    select: { titulo: true, bairro: true }
                }
            }
        });

        return NextResponse.json(visits);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar visitas" }, { status: 500 });
    }
}
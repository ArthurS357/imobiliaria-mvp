import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { visitSchema } from "@/lib/validations"; // Importando o Schema Zod

// POST: Criar uma nova visita (Público - usado pelo VisitScheduler)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. VALIDAÇÃO DE SEGURANÇA COM ZOD
        // Verifica todos os campos (formato de data, email, etc) antes de processar
        const validation = visitSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Dados inválidos",
                    details: validation.error.format()
                },
                { status: 400 }
            );
        }

        // 2. Dados validados e seguros
        const { propertyId, date, timeOfDay, name, email, phone } = validation.data;

        // 3. Criação no Banco de Dados
        const newVisit = await prisma.visit.create({
            data: {
                propertyId,
                date: new Date(date), // O Zod já validou que é uma string de data válida
                timeOfDay,
                name,
                email,
                phone,
                status: "PENDENTE",
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

        // 1. Segurança: Apenas usuários logados
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // 2. Filtro de Permissão
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
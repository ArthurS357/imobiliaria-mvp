import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Next.js 15: Params é Promise
) {
    try {
        const { id } = await params;

        // 1. Descobrir qual é o tipo do imóvel atual (ex: Casa, Apto)
        const currentProperty = await prisma.property.findUnique({
            where: { id },
            select: { tipo: true },
        });

        if (!currentProperty) {
            return NextResponse.json({ error: "Imóvel original não encontrado" }, { status: 404 });
        }

        // 2. Buscar imóveis similares
        const related = await prisma.property.findMany({
            where: {
                tipo: currentProperty.tipo, // Mesmo tipo
                status: "DISPONIVEL",       // Apenas disponíveis
                NOT: {
                    id: id,                   // Exclui o próprio imóvel da lista
                },
            },
            take: 3,                      // Limite de 3 sugestões
            orderBy: {
                createdAt: "desc",          // Mais recentes primeiro
            },
        });

        return NextResponse.json(related);
    } catch (error) {
        console.error("Erro ao buscar relacionados:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
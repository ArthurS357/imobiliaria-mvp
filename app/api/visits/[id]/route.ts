import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 1. Segurança: Só quem está logado pode mexer aqui
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await request.json(); // Ex: "CONFIRMADA", "CANCELADA"

        // 2. Atualiza o status no banco
        const visit = await prisma.visit.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(visit);
    } catch (error) {
        console.error("Erro ao atualizar visita:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
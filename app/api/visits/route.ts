import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 1. Segurança: Só admin/corretor logado pode alterar
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await request.json(); // Ex: "CONFIRMADA" ou "CANCELADA"

        // 2. Atualiza no Banco
        const visit = await prisma.visit.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(visit);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar visita" }, { status: 500 });
    }
}
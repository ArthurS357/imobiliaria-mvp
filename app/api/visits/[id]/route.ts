import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ATUALIZAR STATUS (PUT)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await request.json();

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

// EXCLUIR VISITA (DELETE)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;

        // Verifica se a visita existe
        const visit = await prisma.visit.findUnique({ where: { id } });
        if (!visit) {
            return NextResponse.json({ error: "Visita não encontrada" }, { status: 404 });
        }

        // Deleta
        await prisma.visit.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir visita:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
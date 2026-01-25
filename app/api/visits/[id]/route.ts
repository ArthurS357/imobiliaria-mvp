import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT: Atualizar Status da Visita
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await request.json();

        // 1. Busca a visita existente para verificar permissões
        const existingVisit = await prisma.visit.findUnique({
            where: { id }
        });

        if (!existingVisit) {
            return NextResponse.json({ error: "Visita não encontrada" }, { status: 404 });
        }

        // 2. Regra de Segurança:
        // - Admin pode tudo.
        // - Corretor só pode alterar se a visita for atribuída a ele (assignedToId).
        const isAdmin = session.user.role === "ADMIN";
        const isOwner = existingVisit.assignedToId === session.user.id;

        if (!isAdmin && !isOwner) {
            return NextResponse.json({
                error: "Você não tem permissão para alterar esta visita."
            }, { status: 403 });
        }

        // 3. Atualiza o status
        const updatedVisit = await prisma.visit.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updatedVisit);

    } catch (error) {
        console.error("Erro ao atualizar visita:", error);
        return NextResponse.json({ error: "Erro interno ao atualizar visita" }, { status: 500 });
    }
}

// DELETE: Excluir Visita (Apenas ADMIN)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        // Verificação de segurança estrita para exclusão
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Apenas administradores podem excluir visitas." }, { status: 403 });
        }

        const { id } = await params;

        // Verifica se existe antes de tentar deletar (boa prática para feedback)
        const visit = await prisma.visit.findUnique({ where: { id } });
        if (!visit) {
            return NextResponse.json({ error: "Visita não encontrada" }, { status: 404 });
        }

        await prisma.visit.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Erro ao excluir visita:", error);
        // Tratamento para erro de chave estrangeira (caso futuramente existam registros ligados)
        return NextResponse.json({ error: "Erro ao excluir visita. Tente novamente." }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT: Atualizar Status do Lead
// Permissão: Admin OU Corretor Responsável
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const { id } = await params;
        const { status } = await request.json();

        const lead = await prisma.lead.findUnique({ where: { id } });

        // Segurança: Só Admin ou o Dono do Lead podem mudar o status
        if (session.user.role !== "ADMIN" && lead?.assignedToId !== session.user.id) {
            return NextResponse.json({ error: "Você não é o responsável por este lead." }, { status: 403 });
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updatedLead);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar lead" }, { status: 500 });
    }
}

// DELETE: Excluir Lead Permanentemente
// Permissão: SOMENTE ADMIN (Segurança Reforçada)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        // 1. Verifica se está logado
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // 2. Verifica se é ADMIN (Só admin pode deletar)
        if (session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Apenas administradores podem excluir mensagens." }, { status: 403 });
        }

        const { id } = await params;

        // 3. Deleta do banco de dados
        await prisma.lead.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Mensagem excluída com sucesso." });

    } catch (error) {
        console.error("Erro ao excluir lead:", error);
        return NextResponse.json({ error: "Erro interno ao excluir mensagem." }, { status: 500 });
    }
}
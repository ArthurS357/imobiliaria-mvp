import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // 1. Segurança: Só ADMIN pode atribuir leads
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const data = await request.json();
        const { leadId, userId } = data; // userId é o ID do corretor (ou null para limpar)

        // 2. Atualiza o Lead
        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: {
                assignedToId: userId === "null" ? null : userId
            },
        });

        return NextResponse.json(updatedLead);
    } catch (error) {
        console.error("Erro ao atribuir lead:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
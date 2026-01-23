import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
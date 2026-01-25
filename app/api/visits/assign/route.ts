import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Segurança: Apenas ADMIN pode atribuir visitas
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { visitId, userId } = await request.json();

        if (!visitId) {
            return NextResponse.json({ error: "ID da visita obrigatório" }, { status: 400 });
        }

        // Se o valor for "null" (string vinda do select), salvamos null no banco
        const assignedToId = userId === "null" ? null : userId;

        const updatedVisit = await prisma.visit.update({
            where: { id: visitId },
            data: {
                assignedToId: assignedToId
            }
        });

        return NextResponse.json(updatedVisit);

    } catch (error) {
        console.error("Erro ao atribuir visita:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
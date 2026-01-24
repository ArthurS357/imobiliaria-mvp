import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    // SEGURANÇA: Somente ADMIN pode excluir
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    try {
        const { id } = await params;
        await prisma.lead.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
    }
}
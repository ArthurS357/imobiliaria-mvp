import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

// PUT: Atualizar usuário (Senha, Email, Cargo)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const updateData: any = {
        name: data.name,
        email: data.email,
        role: data.role
    };

    // Se enviou senha nova, faz o hash
    if (data.password && data.password.trim() !== "") {
        updateData.password = await hash(data.password, 10);
    }

    try {
        const user = await prisma.user.update({
            where: { id },
            data: updateData
        });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar. Email já existe?" }, { status: 400 });
    }
}

// DELETE: Excluir usuário
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Impede que o admin se exclua
    if (id === session.user.id) {
        return NextResponse.json({ error: "Você não pode excluir sua própria conta." }, { status: 400 });
    }

    try {
        // Atenção: Isso falhará se o usuário tiver imóveis vinculados, a menos que configuremos delete cascade no Prisma
        // ou deletemos os imóveis antes. Por segurança, vamos apenas deletar o usuário.
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir. O usuário possui imóveis vinculados?" }, { status: 400 });
    }
}
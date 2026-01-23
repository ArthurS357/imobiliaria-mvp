import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const { targetUserId, currentUserId } = await request.json();

    // 1. Verificar se quem está pedindo É ADMIN
    const requester = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (!requester || requester.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Apenas administradores podem promover usuários." },
        { status: 403 }
      );
    }

    // 2. Atualizar o cargo do funcionário alvo para ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: "ADMIN" },
    });

    return NextResponse.json({
      message: `O usuário ${updatedUser.name} agora é um Administrador.`,
      user: updatedUser,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao promover usuário." },
      { status: 500 }
    );
  }
}
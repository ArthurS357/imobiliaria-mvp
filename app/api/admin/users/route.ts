import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs"; // Certifique-se de ter bcryptjs instalado

// GET: Listar todos os usuários (Apenas Admin)
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true }, // Não retornamos a senha
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(users);
}
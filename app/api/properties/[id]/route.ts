import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Ajuste o caminho se necessário (ex: ../../../lib/auth)
import { prisma } from "@/lib/prisma";    // Ajuste o caminho se necessário

// GET: Buscar um único imóvel (Para página de detalhes ou edição)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Correção para Next.js 15+ (params é Promise)
) {
    try {
        const { id } = await params;
        const property = await prisma.property.findUnique({
            where: { id },
            include: { corretor: { select: { name: true, email: true } } },
        });

        if (!property) {
            return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 });
        }

        return NextResponse.json(property);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// PUT: Atualizar Imóvel (Editar dados ou Aprovar Status)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const { id } = await params;
        const data = await request.json();

        // Verificação de Segurança
        const existingProperty = await prisma.property.findUnique({ where: { id } });
        if (!existingProperty) return NextResponse.json({ error: "Imóvel não existe" }, { status: 404 });

        // Regra: Apenas ADMIN pode mudar o status para DISPONIVEL (Aprovação)
        // Se um funcionário tentar mudar status, ignoramos ou damos erro.
        let newStatus = data.status;
        if (data.status === "DISPONIVEL" && session.user.role !== "ADMIN") {
            newStatus = "PENDENTE"; // Força manter pendente se não for admin
        }

        // Tratamento de fotos (Array -> String) se vier no update
        let fotosString = existingProperty.fotos;
        if (data.fotos && Array.isArray(data.fotos)) {
            fotosString = data.fotos.join(";");
        } else if (data.fotos && typeof data.fotos === 'string') {
            fotosString = data.fotos;
        }

        const updatedProperty = await prisma.property.update({
            where: { id },
            data: {
                titulo: data.titulo,
                descricao: data.descricao,
                tipo: data.tipo,
                preco: data.preco ? parseFloat(data.preco) : undefined,
                cidade: data.cidade,
                bairro: data.bairro,
                endereco: data.endereco,
                quarto: data.quarto ? parseInt(data.quarto) : undefined,
                banheiro: data.banheiro ? parseInt(data.banheiro) : undefined,
                garagem: data.garagem ? parseInt(data.garagem) : undefined,
                area: data.area ? parseFloat(data.area) : undefined,
                fotos: fotosString,
                status: newStatus, // Status tratado
                destaque: data.destaque,
            },
        });

        return NextResponse.json(updatedProperty);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

// DELETE: Remover Imóvel
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const { id } = await params;

        // Opcional: Verificar se o usuário é dono do imóvel ou ADMIN
        const property = await prisma.property.findUnique({ where: { id } });

        if (!property) return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 });

        if (session.user.role !== "ADMIN" && property.corretorId !== session.user.id) {
            return NextResponse.json({ error: "Você não tem permissão para excluir este imóvel." }, { status: 403 });
        }

        await prisma.property.delete({ where: { id } });

        return NextResponse.json({ message: "Imóvel excluído com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
    }
}
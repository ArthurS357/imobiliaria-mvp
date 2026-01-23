import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Buscar um único imóvel (Para página de detalhes ou edição)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
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
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        // 1. Tratamento de fotos (Array -> String única com separador ;)
        let fotosString = undefined;
        if (data.fotos && Array.isArray(data.fotos)) {
            fotosString = data.fotos.join(";");
        } else if (data.fotos && typeof data.fotos === 'string') {
            fotosString = data.fotos;
        }

        // 2. SEGURANÇA CRÍTICA: Proteção de Campos Administrativos
        // Se o usuário NÃO for ADMIN, removemos status e destaque do objeto de atualização.
        // Isso impede que um corretor force a aprovação enviando um JSON modificado.
        if (session.user.role !== "ADMIN") {
            delete data.status;
            delete data.destaque;
        }

        // 3. Atualização no Banco de Dados
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

                // Atualiza fotos apenas se fotosString foi definido
                ...(fotosString !== undefined && { fotos: fotosString }),

                // Status e Destaque só atualizam se não tiverem sido deletados pela regra de segurança acima
                ...(data.status && { status: data.status }),
                ...(data.destaque !== undefined && { destaque: data.destaque }),

                // --- NOVOS CAMPOS DO MAPA ---
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,
            },
        });

        return NextResponse.json(updatedProperty);
    } catch (error) {
        console.error("Erro ao atualizar imóvel:", error);
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

        // Verifica se o imóvel existe
        const property = await prisma.property.findUnique({ where: { id } });

        if (!property) return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 });

        // Regra de Propriedade:
        // Apenas o dono do imóvel (corretorId) ou um ADMIN podem excluir.
        if (session.user.role !== "ADMIN" && property.corretorId !== session.user.id) {
            return NextResponse.json({ error: "Você não tem permissão para excluir este imóvel." }, { status: 403 });
        }

        await prisma.property.delete({ where: { id } });

        return NextResponse.json({ message: "Imóvel excluído com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
    }
}
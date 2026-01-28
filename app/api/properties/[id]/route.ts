import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Buscar um único imóvel
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

        // 1. Busca o imóvel existente para verificar permissão
        const existingProperty = await prisma.property.findUnique({ where: { id } });

        if (!existingProperty) {
            return NextResponse.json({ error: "Imóvel não existe" }, { status: 404 });
        }

        // 2. SEGURANÇA DE PROPRIEDADE:
        if (session.user.role !== "ADMIN" && existingProperty.corretorId !== session.user.id) {
            return NextResponse.json({ error: "Você não tem permissão para editar este imóvel." }, { status: 403 });
        }

        // 3. SEGURANÇA DE CAMPOS ADMINISTRATIVOS:
        // Apenas Admin altera Status, Destaque e Tipo de Contrato
        if (session.user.role !== "ADMIN") {
            delete data.status;
            delete data.destaque;
            delete data.tipoContrato; // Novo campo restrito
        }

        // 4. Tratamento de fotos (Array -> String)
        let fotosString = undefined;
        if (data.fotos && Array.isArray(data.fotos)) {
            fotosString = data.fotos.join(";");
        } else if (data.fotos && typeof data.fotos === 'string') {
            fotosString = data.fotos;
        }

        // 5. Tratamento de Features (Array -> String)
        let featuresString = undefined;
        if (data.features && Array.isArray(data.features)) {
            featuresString = data.features.join(",");
        }

        // 6. Atualização no Banco de Dados
        const updatedProperty = await prisma.property.update({
            where: { id },
            data: {
                // DADOS BÁSICOS
                titulo: data.titulo,
                descricao: data.descricao,
                sobreTitulo: data.sobreTitulo,
                tipo: data.tipo,
                finalidade: data.finalidade, // NOVO

                // VALORES
                preco: data.preco ? parseFloat(data.preco) : undefined,
                tipoValor: data.tipoValor, // NOVO
                periodoPagamento: data.periodoPagamento, // NOVO
                depositoSeguranca: data.depositoSeguranca ? parseFloat(data.depositoSeguranca) : undefined, // NOVO

                valorCondominio: data.valorCondominio ? parseFloat(data.valorCondominio) : undefined, // NOVO
                periodicidadeCondominio: data.periodicidadeCondominio, // NOVO

                // ENDEREÇO
                cidade: data.cidade,
                bairro: data.bairro,
                endereco: data.endereco,
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,

                // DETALHES FÍSICOS
                quarto: data.quarto ? parseInt(data.quarto) : undefined,
                suites: data.suites ? parseInt(data.suites) : undefined, // NOVO
                banheiro: data.banheiro ? parseInt(data.banheiro) : undefined,

                // VAGAS DETALHADAS
                garagem: data.garagem ? parseInt(data.garagem) : undefined,
                vagasCobertas: data.vagasCobertas ? parseInt(data.vagasCobertas) : undefined, // NOVO
                vagasDescobertas: data.vagasDescobertas ? parseInt(data.vagasDescobertas) : undefined, // NOVO
                vagasSubsolo: data.vagasSubsolo !== undefined ? data.vagasSubsolo : undefined, // NOVO

                // ÁREAS
                area: data.area ? parseFloat(data.area) : undefined,
                areaTerreno: data.areaTerreno ? parseFloat(data.areaTerreno) : undefined,

                // DETALHES DE MERCADO
                statusMercado: data.statusMercado, // NOVO
                condicaoImovel: data.condicaoImovel, // NOVO
                anoConstrucao: data.anoConstrucao ? parseInt(data.anoConstrucao) : null, // NOVO

                // CAMPOS ADMINISTRATIVOS (Atualizam só se não foram deletados no passo 3)
                ...(data.tipoContrato && { tipoContrato: data.tipoContrato }), // NOVO
                ...(data.status && { status: data.status }),
                ...(data.destaque !== undefined && { destaque: data.destaque }),

                // STRINGS ESPECIAIS E PRIVACIDADE
                ...(fotosString !== undefined && { fotos: fotosString }),
                ...(featuresString !== undefined && { features: featuresString }),
                ...(data.displayAddress !== undefined && { displayAddress: data.displayAddress }),
                ...(data.displayDetails !== undefined && { displayDetails: data.displayDetails }),
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

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({
                error: "Permissão negada. Apenas administradores podem excluir imóveis do sistema."
            }, { status: 403 });
        }

        const { id } = await params;

        const property = await prisma.property.findUnique({ where: { id } });
        if (!property) {
            return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 });
        }

        await prisma.property.delete({ where: { id } });

        return NextResponse.json({ message: "Imóvel excluído com sucesso (Admin)" });

    } catch (error) {
        console.error("Erro ao excluir imóvel:", error);
        return NextResponse.json({ error: "Erro interno ao excluir" }, { status: 500 });
    }
}
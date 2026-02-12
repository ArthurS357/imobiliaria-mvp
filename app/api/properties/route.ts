import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Listar imóveis com Filtros Avançados e Segurança de Role
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // 🔒 SECURITY CHECK: Apenas usuários autenticados
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const isAdmin = session.user.role === "ADMIN";
        const userId = session.user.id;

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const tipo = searchParams.get("tipo");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const quartos = searchParams.get("quartos");
        const garagem = searchParams.get("garagem");
        const finalidade = searchParams.get("finalidade");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        // 🔒 ROLE FILTER: Se não for admin, força o filtro por corretorId
        // Isso garante que corretores/funcionários vejam APENAS seus próprios imóveis
        if (!isAdmin) {
            where.corretorId = userId;
        }

        if (status && status !== "TODOS") {
            where.status = status;
        }

        if (tipo && tipo !== "Todos") {
            where.tipo = tipo;
        }

        if (finalidade) {
            where.finalidade = finalidade;
        }

        if (minPrice || maxPrice) {
            where.preco = {};
            if (minPrice) where.preco.gte = Number(minPrice);
            if (maxPrice) where.preco.lte = Number(maxPrice);
        }

        if (quartos && Number(quartos) > 0) {
            where.quarto = { gte: Number(quartos) };
        }

        if (garagem && Number(garagem) > 0) {
            where.garagem = { gte: Number(garagem) };
        }

        const properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                corretor: {
                    select: { name: true, email: true },
                },
            },
        });

        return NextResponse.json(properties);
    } catch (error) {
        console.error("Erro na API GET properties:", error);
        return NextResponse.json({ error: "Erro ao buscar imóveis" }, { status: 500 });
    }
}

// POST: Cadastrar novo imóvel
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const data = await request.json();

        // Regra de Negócio: Admin publica direto, Corretores vão para revisão (PENDENTE)
        const initialStatus = session.user.role === "ADMIN" ? "DISPONIVEL" : "PENDENTE";

        // Tratamento de Arrays para String (banco SQLite/Simples)
        const fotosString = Array.isArray(data.fotos) ? data.fotos.join(";") : "";
        const featuresString = Array.isArray(data.features) ? data.features.join(",") : "";

        const property = await prisma.property.create({
            data: {
                // DADOS BÁSICOS
                titulo: data.titulo,
                sobreTitulo: data.sobreTitulo || "",
                descricao: data.descricao,
                tipo: data.tipo,
                finalidade: data.finalidade || "Venda",

                // VALORES
                preco: parseFloat(data.preco),
                precoLocacao: data.precoLocacao ? parseFloat(data.precoLocacao) : 0,
                tipoValor: data.tipoValor,
                periodoPagamento: data.periodoPagamento,
                depositoSeguranca: data.depositoSeguranca ? parseFloat(data.depositoSeguranca) : 0,
                valorCondominio: data.valorCondominio ? parseFloat(data.valorCondominio) : 0,
                periodicidadeCondominio: data.periodicidadeCondominio,

                // ENDEREÇO
                cidade: data.cidade,
                bairro: data.bairro,
                endereco: data.endereco,
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,

                // DETALHES FÍSICOS
                quarto: parseInt(data.quarto),
                suites: data.suites ? parseInt(data.suites) : 0,
                banheiro: parseInt(data.banheiro),
                garagem: parseInt(data.garagem),
                vagasCobertas: data.vagasCobertas ? parseInt(data.vagasCobertas) : 0,
                vagasDescobertas: data.vagasDescobertas ? parseInt(data.vagasDescobertas) : 0,
                vagasSubsolo: data.vagasSubsolo ?? false,

                // ÁREAS
                area: parseFloat(data.area),
                areaTerreno: data.areaTerreno ? parseFloat(data.areaTerreno) : 0,

                // DETALHES DE MERCADO
                statusMercado: data.statusMercado,
                condicaoImovel: data.condicaoImovel,
                anoConstrucao: data.anoConstrucao ? parseInt(data.anoConstrucao) : null,
                tipoContrato: data.tipoContrato,

                // MÍDIA E SISTEMA
                fotos: fotosString,
                features: featuresString,
                status: initialStatus,
                destaque: false,
                displayAddress: data.displayAddress ?? true,
                displayDetails: data.displayDetails ?? true,

                // VINCULAÇÃO AO USUÁRIO LOGADO
                corretorId: session.user.id,
            },
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error("Erro ao cadastrar imóvel:", error);
        return NextResponse.json({ error: "Erro ao criar imóvel" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Listar imóveis com Filtros Avançados
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const status = searchParams.get("status");
        const tipo = searchParams.get("tipo");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const quartos = searchParams.get("quartos");
        const garagem = searchParams.get("garagem");
        const finalidade = searchParams.get("finalidade"); // Filtro novo opcional

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (tipo && tipo !== "Todos") {
            where.tipo = tipo;
        }

        // Filtro de Finalidade (Venda / Locação)
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

// POST: Cadastrar novo imóvel (COMPLETO)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const data = await request.json();

        const initialStatus = session.user.role === "ADMIN" ? "DISPONIVEL" : "PENDENTE";
        const fotosString = Array.isArray(data.fotos) ? data.fotos.join(";") : "";
        const featuresString = Array.isArray(data.features) ? data.features.join(",") : "";

        const property = await prisma.property.create({
            data: {
                // DADOS BÁSICOS
                titulo: data.titulo,
                sobreTitulo: data.sobreTitulo || "",
                descricao: data.descricao,
                tipo: data.tipo,
                finalidade: data.finalidade || "Venda", // NOVO

                // VALORES
                preco: parseFloat(data.preco),
                tipoValor: data.tipoValor, // NOVO
                periodoPagamento: data.periodoPagamento, // NOVO (Locação)
                depositoSeguranca: data.depositoSeguranca ? parseFloat(data.depositoSeguranca) : 0, // NOVO

                valorCondominio: data.valorCondominio ? parseFloat(data.valorCondominio) : 0, // NOVO
                periodicidadeCondominio: data.periodicidadeCondominio, // NOVO

                // ENDEREÇO
                cidade: data.cidade,
                bairro: data.bairro,
                endereco: data.endereco,
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,

                // DETALHES FÍSICOS
                quarto: parseInt(data.quarto),
                suites: data.suites ? parseInt(data.suites) : 0, // NOVO
                banheiro: parseInt(data.banheiro),

                // VAGAS
                garagem: parseInt(data.garagem), // Total
                vagasCobertas: data.vagasCobertas ? parseInt(data.vagasCobertas) : 0, // NOVO
                vagasDescobertas: data.vagasDescobertas ? parseInt(data.vagasDescobertas) : 0, // NOVO
                vagasSubsolo: data.vagasSubsolo ?? false, // NOVO

                // ÁREAS
                area: parseFloat(data.area),
                areaTerreno: data.areaTerreno ? parseFloat(data.areaTerreno) : 0,

                // DETALHES DE MERCADO
                statusMercado: data.statusMercado, // NOVO
                condicaoImovel: data.condicaoImovel, // NOVO
                anoConstrucao: data.anoConstrucao ? parseInt(data.anoConstrucao) : null, // NOVO
                tipoContrato: data.tipoContrato, // NOVO

                // MÍDIA E SISTEMA
                fotos: fotosString,
                features: featuresString,
                status: initialStatus,
                destaque: false,
                displayAddress: data.displayAddress ?? true,
                displayDetails: data.displayDetails ?? true,

                corretorId: session.user.id,
            },
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error("Erro ao cadastrar imóvel:", error);
        return NextResponse.json({ error: "Erro ao criar imóvel" }, { status: 500 });
    }
}
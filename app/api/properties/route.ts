import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Listar imóveis com Filtros Avançados
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Captura os parâmetros da URL
        const status = searchParams.get("status");
        const tipo = searchParams.get("tipo");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const quartos = searchParams.get("quartos");
        const garagem = searchParams.get("garagem");

        // Monta o objeto de filtro dinamicamente
        const where: any = {};

        // 1. Filtro de Status (Ex: ?status=PENDENTE ou ?status=DISPONIVEL)
        if (status) {
            where.status = status;
        }

        // 2. Filtro de Tipo (Ex: Casa, Apartamento...)
        if (tipo && tipo !== "Todos") {
            where.tipo = tipo;
        }

        // 3. Filtro de Faixa de Preço
        if (minPrice || maxPrice) {
            where.preco = {};
            if (minPrice) where.preco.gte = Number(minPrice); // Maior ou igual
            if (maxPrice) where.preco.lte = Number(maxPrice); // Menor ou igual
        }

        // 4. Filtro de Quartos (Pelo menos X quartos)
        if (quartos && Number(quartos) > 0) {
            where.quarto = {
                gte: Number(quartos)
            };
        }

        // 5. Filtro de Vagas de Garagem (Pelo menos X vagas)
        if (garagem && Number(garagem) > 0) {
            where.garagem = {
                gte: Number(garagem)
            };
        }

        const properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                corretor: {
                    select: { name: true, email: true }, // Mantém o nome do corretor para o card
                },
            },
        });

        return NextResponse.json(properties);
    } catch (error) {
        console.error("Erro na API GET properties:", error);
        return NextResponse.json({ error: "Erro ao buscar imóveis" }, { status: 500 });
    }
}

// POST: Cadastrar novo imóvel (Mantido conforme sua referência)
export async function POST(request: Request) {
    try {
        // 1. Segurança: Quem está cadastrando?
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const data = await request.json();

        // 2. Regra de Negócio (Contrato 2.2):
        // Se for ADMIN, já pode criar como DISPONIVEL. Se for FUNCIONARIO, entra como PENDENTE.
        const initialStatus = session.user.role === "ADMIN" ? "DISPONIVEL" : "PENDENTE";

        // 3. Tratamento das Fotos (Array -> String única para SQLite)
        const fotosString = Array.isArray(data.fotos) ? data.fotos.join(";") : "";

        const property = await prisma.property.create({
            data: {
                titulo: data.titulo,
                descricao: data.descricao,
                tipo: data.tipo,
                preco: parseFloat(data.preco), // Garante que é número
                cidade: data.cidade,
                bairro: data.bairro,
                endereco: data.endereco,
                quarto: parseInt(data.quarto),
                banheiro: parseInt(data.banheiro),
                garagem: parseInt(data.garagem),
                area: parseFloat(data.area),
                fotos: fotosString,
                status: initialStatus,
                corretorId: session.user.id, // Vincula ao usuário logado
            },
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error("Erro ao cadastrar imóvel:", error);
        return NextResponse.json({ error: "Erro ao criar imóvel" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Listar imóveis (Para o Dashboard e Site)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status"); // ex: ?status=PENDENTE

        const where = status ? { status } : {};

        const properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                corretor: {
                    select: { name: true, email: true }, // Traz o nome do corretor
                },
            },
        });

        return NextResponse.json(properties);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar imóveis" }, { status: 500 });
    }
}

// POST: Cadastrar novo imóvel
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
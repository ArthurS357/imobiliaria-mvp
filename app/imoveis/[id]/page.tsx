import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyDetailsClient } from "@/components/PropertyDetailsClient";
import { cache } from "react"; // OTIMIZAÇÃO: Importação do cache

// OTIMIZAÇÃO: Cache da requisição para evitar duplicidade de query (Metadata + Page)
// O Next.js deduplica automaticamente chamadas com a mesma entrada dentro do ciclo de renderização
const getProperty = cache(async (id: string) => {
    return await prisma.property.findUnique({
        where: { id },
        include: {
            corretor: {
                select: {
                    name: true,
                    email: true,
                    creci: true
                },
            },
        },
    });
});

// Gera os metadados para SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    // Usa a função cacheada (se a página já chamou, aqui pega do cache instantaneamente)
    const property = await getProperty(id);

    if (!property) return { title: "Imóvel não encontrado" };

    const capa = property.fotos ? property.fotos.split(";")[0] : "";
    const preco = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(property.preco));

    return {
        title: `${property.titulo} | Imobiliária MVP`,
        description: `Confira este imóvel em ${property.cidade}. Valor: ${preco}. ${property.descricao.substring(0, 100)}...`,
        openGraph: {
            title: property.titulo,
            description: `Oportunidade em ${property.cidade}: ${preco}`,
            images: capa ? [capa] : [],
        },
    };
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // 1. Busca o imóvel com TODOS os dados (usando cache)
    const property = await getProperty(id);

    if (!property) return notFound();

    // Campos necessários para renderizar o card de relacionados (Payload menor)
    const cardSelect = {
        id: true,
        titulo: true,
        preco: true,
        precoLocacao: true,
        tipoValor: true,
        cidade: true,
        bairro: true,
        tipo: true,
        quarto: true,
        suites: true,
        banheiro: true,
        garagem: true,
        area: true,
        fotos: true,
        status: true,
        finalidade: true,
        destaque: true
    };

    // 2. Busca imóveis relacionados (prioridade: mesma cidade E mesmo tipo)
    let relatedProperties = await prisma.property.findMany({
        where: {
            AND: [
                { id: { not: property.id } }, // Não mostrar o próprio imóvel
                { cidade: property.cidade },  // Mesma cidade (Relevância local)
                { tipo: property.tipo },      // Mesmo tipo (Casa, Apto...)
                { status: "DISPONIVEL" },
            ],
        },
        take: 3, // Limita a 3 sugestões
        orderBy: { createdAt: "desc" },
        select: cardSelect, // OTIMIZAÇÃO: Traz apenas campos necessários
    });

    // Fallback: Se não encontrar nada na mesma cidade, busca apenas pelo mesmo tipo em qualquer lugar
    if (relatedProperties.length === 0) {
        relatedProperties = await prisma.property.findMany({
            where: {
                tipo: property.tipo,
                status: "DISPONIVEL",
                NOT: { id: property.id },
            },
            take: 3,
            orderBy: { createdAt: "desc" },
            select: cardSelect, // OTIMIZAÇÃO: Traz apenas campos necessários
        });
    }

    // 3. Serialização: O Prisma retorna objetos Date e Decimal que o Next.js (Client Component) não aceita diretamente.
    const serializedProperty = JSON.parse(JSON.stringify(property));
    const serializedRelated = JSON.parse(JSON.stringify(relatedProperties));

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-500 overflow-x-hidden">
            <Header />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Passamos os dados completos para o Client Component */}
                <PropertyDetailsClient
                    property={serializedProperty}
                    relatedProperties={serializedRelated}
                />
            </main>

            <Footer />
        </div>
    );
}
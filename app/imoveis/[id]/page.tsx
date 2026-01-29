import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyDetailsClient } from "@/components/PropertyDetailsClient";

// Gera os metadados para SEO (Título da aba, descrição Google, imagem de compartilhamento)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    const property = await prisma.property.findUnique({
        where: { id },
        // Selecionamos apenas o necessário para o SEO
        select: { titulo: true, descricao: true, fotos: true, preco: true, cidade: true }
    });

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

    // 1. Busca o imóvel com TODOS os dados (incluindo novos campos como precoLocacao, suites, etc)
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            corretor: {
                select: {
                    name: true,
                    email: true,
                    creci: true // Importante para exibir no card do corretor
                },
            },
        },
    });

    if (!property) return notFound();

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
        });
    }

    // 3. Serialização: O Prisma retorna objetos Date e Decimal que o Next.js (Client Component) não aceita diretamente.
    // O JSON.parse(JSON.stringify) converte tudo para string/number simples.
    const serializedProperty = JSON.parse(JSON.stringify(property));
    const serializedRelated = JSON.parse(JSON.stringify(relatedProperties));

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-500 overflow-x-hidden">
            <Header />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Passamos os dados completos para o Client Component.
                   É lá no 'PropertyDetailsClient' que vamos renderizar o Checklist, 
                   a Área do Terreno e aplicar a lógica de privacidade.
                */}
                <PropertyDetailsClient
                    property={serializedProperty}
                    relatedProperties={serializedRelated}
                />
            </main>

            <Footer />
        </div>
    );
}
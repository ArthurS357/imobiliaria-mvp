import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyDetailsClient } from "@/components/PropertyDetailsClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const property = await prisma.property.findUnique({
        where: { id },
        select: { titulo: true, descricao: true, fotos: true, preco: true, cidade: true }
    });

    if (!property) return { title: "Imóvel não encontrado" };

    const capa = property.fotos ? property.fotos.split(";")[0] : "";
    const preco = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(property.preco));

    return {
        title: `${property.titulo} | Matiello Imóveis`,
        description: `Confira este imóvel em ${property.cidade} por ${preco}.`,
        openGraph: {
            title: property.titulo,
            description: `Oportunidade única: ${preco}`,
            images: capa ? [capa] : [],
        },
    };
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Busca o imóvel e os dados do corretor (incluindo CRECI)
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            corretor: {
                select: {
                    name: true,
                    email: true,
                    creci: true // <--- Busca o CRECI do banco
                },
            },
        },
    });

    if (!property) return notFound();

    const relatedProperties = await prisma.property.findMany({
        where: {
            tipo: property.tipo,
            status: "DISPONIVEL",
            NOT: { id: property.id },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
    });

    // Serialização para passar objetos Date e Decimal do Prisma para o Client Component
    const serializedProperty = JSON.parse(JSON.stringify(property));
    const serializedRelated = JSON.parse(JSON.stringify(relatedProperties));

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-500 overflow-x-hidden">
            <Header />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PropertyDetailsClient
                    property={serializedProperty}
                    relatedProperties={serializedRelated}
                />
            </main>
            <Footer />
        </div>
    );
}
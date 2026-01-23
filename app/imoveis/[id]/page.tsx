import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PropertyDetailsClient } from "@/components/PropertyDetailsClient"; // Importa o visual
import { notFound } from "next/navigation";

// --- A MÁGICA DO WHATSAPP ACONTECE AQUI (SEO) ---
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    const property = await prisma.property.findUnique({
        where: { id },
        select: { titulo: true, descricao: true, fotos: true, preco: true, cidade: true }
    });

    if (!property) return { title: "Imóvel não encontrado" };

    const capa = property.fotos ? property.fotos.split(";")[0] : "";

    // CORREÇÃO AQUI: Envolvemos property.preco em Number()
    const preco = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(property.preco));

    return {
        title: `${property.titulo} | Imobiliária MVP`,
        description: `Confira este imóvel em ${property.cidade} por ${preco}. ${property.descricao.substring(0, 100)}...`,
        openGraph: {
            title: property.titulo,
            description: `Oportunidade única: ${preco}`,
            images: capa ? [capa] : [],
        },
    };
}

// --- BUSCA DE DADOS (SERVIDOR) ---
export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // 1. Busca o Imóvel
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            corretor: {
                select: { name: true, email: true },
            },
        },
    });

    if (!property) {
        notFound();
    }

    // 2. Busca os Relacionados
    const relatedProperties = await prisma.property.findMany({
        where: {
            tipo: property.tipo,
            status: "DISPONIVEL",
            NOT: { id: property.id },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
    });

    // CORREÇÃO PARA O CLIENTE: O Prisma Decimal não passa direto para Client Components.
    // O JSON.stringify converte o Decimal automaticamente para string/number seguro.
    const serializedProperty = JSON.parse(JSON.stringify(property));
    const serializedRelated = JSON.parse(JSON.stringify(relatedProperties));

    // Renderiza a parte visual
    return (
        <PropertyDetailsClient
            property={serializedProperty}
            relatedProperties={serializedRelated}
        />
    );
}
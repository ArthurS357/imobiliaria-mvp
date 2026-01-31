import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Define a URL base do site. Tenta usar a variável de ambiente, senão usa o domínio de produção.
    // IMPORTANTE: Certifique-se de definir NEXT_PUBLIC_BASE_URL no seu arquivo .env
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.matielloimoveis.com.br';

    // 1. Definição das Rotas Estáticas Principais
    const staticRoutes = [
        '',           // Home
        '/imoveis',   // Listagem
        '/mapa',      // Busca por Mapa
        '/sobre',     // Sobre Nós
        '/contato',   // Fale Conosco
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8, // Home tem prioridade máxima (1.0)
    }));

    // 2. Geração Dinâmica das Rotas de Imóveis
    // Buscamos apenas o ID e a data de atualização para ser mais rápido
    const properties = await prisma.property.findMany({
        where: {
            status: 'DISPONIVEL', // Apenas imóveis ativos aparecem no Google
        },
        select: {
            id: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    const propertyRoutes = properties.map((property) => ({
        url: `${baseUrl}/imoveis/${property.id}`,
        lastModified: property.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9, // Páginas de detalhes de imóvel têm alta prioridade
    }));

    // Retorna a combinação de todas as rotas
    return [...staticRoutes, ...propertyRoutes];
}
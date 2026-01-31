import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    // Usa variável de ambiente pública ou fallback para o domínio final
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.matielloimoveis.com.br';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',      // Painel administrativo
                '/api/',        // Rotas de API
                '/private/',    // Rotas internas/privadas
                '/_next/',      // Arquivos de build do Next.js (não precisam ser indexados)
                '/favoritos',   // Páginas específicas de usuário
                '/perfil',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
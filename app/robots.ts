import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    // Garante que a URL do sitemap esteja correta em produção e desenvolvimento
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.matielloimoveis.com.br';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',      // Painel administrativo
                '/api/',        // Rotas de API
                '/private/',    // Rotas privadas
                '/_next/',      // Arquivos internos do build do Next.js
                '/favoritos',   // Páginas específicas do usuário não devem ser indexadas
                '/perfil',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/'], // Protege admin e API da indexação
        },
        sitemap: `${process.env.NEXTAUTH_URL}/sitemap.xml`, // Opcional se formos criar sitemap depois
    };
}
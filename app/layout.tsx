import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

// OTIMIZAÇÃO SEO: Definição completa e robusta de metadados
export const metadata: Metadata = {
  // Define a URL base para resolver caminhos relativos de imagens (OpenGraph)
  // IMPORTANTE: Configure a variável NEXT_PUBLIC_BASE_URL no seu .env
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.matielloimoveis.com.br'),

  title: {
    default: "Matiello Imóveis | Excelência em Arujá e Região",
    template: "%s | Matiello Imóveis" // Ex: "Casa no Centro | Matiello Imóveis"
  },
  description: "Encontre a casa dos seus sonhos com a Matiello Imóveis. Especialistas em venda e locação de imóveis residenciais, comerciais e rurais em Arujá.",
  keywords: ["Imobiliária", "Arujá", "Venda de Imóveis", "Locação", "Casas de Condomínio", "Apartamentos", "Terrenos", "Alto Padrão"],
  authors: [{ name: "Matiello Imóveis" }],
  creator: "Matiello Imóveis",

  // Configuração para Redes Sociais (WhatsApp, Facebook, LinkedIn)
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Matiello Imóveis",
    title: "Matiello Imóveis | Seu novo lar começa aqui",
    description: "Confira as melhores oportunidades de imóveis em Arujá e região. Agende sua visita online!",
    images: [
      {
        url: "/og-image.jpg", // Recomendo criar esta imagem (1200x630px) na pasta public
        width: 1200,
        height: 630,
        alt: "Matiello Imóveis Destaque",
      },
    ],
  },

  // Configuração para Twitter
  twitter: {
    card: "summary_large_image",
    title: "Matiello Imóveis | Imobiliária em Arujá",
    description: "Encontre o imóvel ideal com segurança e agilidade.",
    images: ["/og-image.jpg"],
  },

  // Controle de Robôs
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning é necessário para o next-themes funcionar sem erros
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
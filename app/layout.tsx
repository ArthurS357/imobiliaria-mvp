import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Matiello Imoveis | Imóveis em Arujá e Região",
  description: "Encontre a casa dos seus sonhos. Venda e locação de imóveis.",
  // REMOVA A PARTE DE "icons" AQUI. 
  // O Next.js vai detectar automaticamente o arquivo app/icon.png
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
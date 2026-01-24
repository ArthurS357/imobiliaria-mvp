import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Matiello Imoveis | Imóveis em Arujá e Região",
  description: "Encontre a casa dos seus sonhos. Venda e locação de imóveis.",
  // O Next.js detecta automaticamente o app/icon.png, não precisa configurar aqui
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
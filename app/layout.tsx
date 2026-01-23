import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers"; // <--- 1. Importe aqui

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Imobiliária MVP",
  description: "Encontre o imóvel dos seus sonhos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* 2. Envolva o children com o Providers */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* Alteração realizada:
         1. defaultTheme="dark": Define o tema inicial como escuro.
         2. enableSystem={false}: Ignora a preferência do SO (opcional, mas recomendado se você quer garantir o visual dark).
      */}
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
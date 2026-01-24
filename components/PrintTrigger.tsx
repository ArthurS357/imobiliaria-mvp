"use client"; // <--- Isso torna o componente interativo

import { Printer } from "lucide-react";

export function PrintTrigger() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-blue-900 text-white px-6 py-2 rounded font-bold hover:bg-blue-800 flex items-center gap-2 transition shadow-md"
        >
            <Printer size={20} /> Imprimir / Salvar PDF
        </button>
    );
}
"use client";

import { Printer, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function PrintTrigger() {
    const router = useRouter();

    return (
        <div className="flex gap-3">
            <button
                onClick={() => router.back()}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2 transition"
            >
                <ArrowLeft size={18} /> Voltar
            </button>

            <button
                onClick={() => window.print()}
                className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 flex items-center gap-2 transition shadow-md hover:shadow-lg"
            >
                <Printer size={18} /> Imprimir / Salvar PDF
            </button>
        </div>
    );
}
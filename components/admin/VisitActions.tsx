"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

interface VisitActionsProps {
    id: string;
    currentStatus: string;
}

export function VisitActions({ id, currentStatus }: VisitActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const updateStatus = async (status: string) => {
        setLoading(true);
        try {
            await fetch(`/api/visits/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            router.refresh(); // Atualiza a lista na tela para mostrar o novo status
        } catch (error) {
            alert("Erro ao atualizar");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader2 className="animate-spin text-gray-400" size={20} />;
    }

    // Se já estiver cancelada, apenas mostra texto
    if (currentStatus === "CANCELADA") return <span className="text-xs text-gray-400">Cancelado</span>;

    return (
        <>
            {currentStatus !== "CONFIRMADA" && (
                <button
                    onClick={() => updateStatus("CONFIRMADA")}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm"
                >
                    <Check size={16} /> Confirmar
                </button>
            )}

            {currentStatus !== "CANCELADA" && (
                <button
                    onClick={() => updateStatus("CANCELADA")}
                    className="flex-1 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition flex items-center justify-center gap-2 shadow-sm"
                >
                    <X size={16} /> Cancelar
                </button>
            )}
        </>
    );
}
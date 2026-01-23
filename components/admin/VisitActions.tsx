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
            router.refresh(); // Atualiza a página para mostrar o novo status
        } catch (error) {
            alert("Erro ao atualizar status.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader2 className="animate-spin text-gray-400" size={20} />;
    }

    // Se já foi cancelada, mostra apenas um texto discreto
    if (currentStatus === "CANCELADA") return <span className="text-xs text-red-400 font-medium">Cancelado</span>;

    return (
        <div className="flex gap-2">
            {currentStatus !== "CONFIRMADA" && (
                <button
                    onClick={() => updateStatus("CONFIRMADA")}
                    className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-full transition"
                    title="Confirmar Visita"
                >
                    <Check size={18} />
                </button>
            )}

            <button
                onClick={() => updateStatus("CANCELADA")}
                className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-full transition"
                title="Cancelar Visita"
            >
                <X size={18} />
            </button>
        </div>
    );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, Trash2 } from "lucide-react";

interface VisitActionsProps {
    id: string;
    currentStatus: string;
    isAdmin: boolean; // <--- ADICIONADO AQUI
}

export function VisitActions({ id, currentStatus, isAdmin }: VisitActionsProps) { // <--- RECEBIDO AQUI
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Função para atualizar (Confirmar/Cancelar)
    const updateStatus = async (status: string) => {
        setLoading(true);
        try {
            await fetch(`/api/visits/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            router.refresh();
        } catch (error) {
            alert("Erro ao atualizar status.");
        } finally {
            setLoading(false);
        }
    };

    // Função para EXCLUIR definitivamente
    const deleteVisit = async () => {
        if (!confirm("Tem certeza que deseja excluir esta visita permanentemente?")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/visits/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Erro ao excluir visita. Verifique se você tem permissão.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader2 className="animate-spin text-gray-400" size={20} />;
    }

    // Se já foi cancelada
    if (currentStatus === "CANCELADA") {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-red-400 font-medium">Cancelado</span>
                {/* Só mostra o botão de excluir se for ADMIN */}
                {isAdmin && (
                    <button
                        onClick={deleteVisit}
                        className="bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 p-1.5 rounded-full transition"
                        title="Excluir Visita (Admin)"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        );
    }

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

            {/* Só mostra o botão de excluir se for ADMIN */}
            {isAdmin && (
                <button
                    onClick={deleteVisit}
                    className="bg-gray-100 text-gray-500 hover:bg-gray-200 p-2 rounded-full transition ml-1"
                    title="Excluir Visita (Admin)"
                >
                    <Trash2 size={18} />
                </button>
            )}
        </div>
    );
}
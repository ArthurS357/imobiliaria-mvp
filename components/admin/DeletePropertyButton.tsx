"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Interface atualizada para aceitar onSuccess
interface DeletePropertyButtonProps {
    id: string;
    onSuccess?: () => void; // Prop opcional
}

export function DeletePropertyButton({ id, onSuccess }: DeletePropertyButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este imóvel?");
        if (!confirmDelete) return;

        setLoading(true);
        const toastId = toast.loading("Excluindo imóvel...");

        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Imóvel excluído!", { id: toastId });
                // Se a função onSuccess foi passada, executa ela
                if (onSuccess) {
                    onSuccess();
                } else {
                    // Fallback: recarrega a página se não houver callback
                    window.location.reload();
                }
            } else {
                const data = await res.json();
                toast.error(data.error || "Erro ao excluir.", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro de conexão.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition"
            title="Excluir"
        >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
        </button>
    );
}
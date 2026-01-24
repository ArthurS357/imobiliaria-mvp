"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteLeadButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja excluir esta mensagem permanentemente?")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
            if (res.ok) {
                router.refresh(); // Recarrega a lista
            } else {
                alert("Erro ao excluir.");
            }
        } catch (err) {
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition disabled:opacity-50"
            title="Excluir Conversa (Admin)"
        >
            <Trash2 size={18} />
        </button>
    );
}
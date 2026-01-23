"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeletePropertyButton({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja excluir este imóvel?")) return;

        try {
            const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
            if (res.ok) {
                router.refresh();
            } else {
                const err = await res.json();
                alert(err.error || "Erro ao excluir");
            }
        } catch (error) {
            alert("Erro de conexão");
        }
    };

    return (
        <button onClick={handleDelete} className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Excluir">
            <Trash2 size={18} />
        </button>
    );
}
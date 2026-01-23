"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LeadStatusUpdater({ id, currentStatus }: { id: string, currentStatus: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(currentStatus);

    const handleChange = async (newStatus: string) => {
        setLoading(true);
        setStatus(newStatus);
        try {
            await fetch(`/api/leads/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            router.refresh();
        } catch (error) {
            alert("Erro ao mudar status");
        } finally {
            setLoading(false);
        }
    };

    const colors: any = {
        "NOVO": "bg-blue-100 text-blue-800",
        "EM_ATENDIMENTO": "bg-yellow-100 text-yellow-800",
        "VISITA_AGENDADA": "bg-purple-100 text-purple-800",
        "FECHADO": "bg-green-100 text-green-800",
        "ARQUIVADO": "bg-gray-100 text-gray-600",
    };

    return (
        <div className="flex items-center gap-2">
            {loading && <Loader2 className="animate-spin" size={14} />}
            <select
                value={status}
                onChange={(e) => handleChange(e.target.value)}
                className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide border-none focus:ring-2 cursor-pointer ${colors[status] || "bg-gray-100"}`}
            >
                <option value="NOVO">Novo</option>
                <option value="EM_ATENDIMENTO">Em Atendimento</option>
                <option value="VISITA_AGENDADA">Visita Agendada</option>
                <option value="FECHADO">Venda Fechada</option>
                <option value="ARQUIVADO">Arquivado</option>
            </select>
        </div>
    );
}
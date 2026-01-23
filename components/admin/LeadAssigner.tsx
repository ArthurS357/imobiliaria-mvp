"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, Loader2 } from "lucide-react";

interface User {
    id: string;
    name: string;
}

interface LeadAssignerProps {
    leadId: string;
    currentAssignedId: string | null;
    brokers: User[]; // Lista de corretores disponíveis
}

export function LeadAssigner({ leadId, currentAssignedId, brokers }: LeadAssignerProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(currentAssignedId || "null");

    const handleAssign = async (newUserId: string) => {
        setLoading(true);
        setSelectedId(newUserId); // Feedback visual imediato

        try {
            await fetch("/api/leads/assign", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, userId: newUserId }),
            });
            router.refresh(); // Atualiza a página para refletir no servidor
        } catch (error) {
            alert("Erro ao atribuir lead.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {loading && <Loader2 className="animate-spin text-blue-600" size={16} />}

            <select
                value={selectedId}
                onChange={(e) => handleAssign(e.target.value)}
                disabled={loading}
                className={`text-sm border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer
          ${selectedId !== "null" ? "bg-blue-50 text-blue-900 border-blue-200 font-medium" : "bg-gray-50 text-gray-500"}
        `}
            >
                <option value="null">-- Não atribuído --</option>
                {brokers.map((broker) => (
                    <option key={broker.id} value={broker.id}>
                        {broker.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
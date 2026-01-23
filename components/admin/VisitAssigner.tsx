"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface User {
    id: string;
    name: string;
}

interface VisitAssignerProps {
    visitId: string;
    currentAssignedId: string | null;
    brokers: User[];
}

export function VisitAssigner({ visitId, currentAssignedId, brokers }: VisitAssignerProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(currentAssignedId || "null");

    const handleAssign = async (newUserId: string) => {
        setLoading(true);
        setSelectedId(newUserId);

        try {
            await fetch("/api/visits/assign", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visitId, userId: newUserId }),
            });
            router.refresh();
        } catch (error) {
            alert("Erro ao atribuir visita.");
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
                className={`text-xs border rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[150px]
          ${selectedId !== "null" ? "bg-yellow-50 text-yellow-900 border-yellow-200 font-medium" : "bg-gray-50 text-gray-500"}
        `}
            >
                <option value="null">-- Sem Corretor --</option>
                {brokers.map((broker) => (
                    <option key={broker.id} value={broker.id}>
                        {broker.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
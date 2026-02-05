"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react"; // Importação essencial
import { PropertyForm } from "@/components/admin/PropertyForm";

export default function EditPropertyPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const { data: session } = useSession(); // Pega sessão

    const [loading, setLoading] = useState(false); // Estado de salvamento
    const [fetching, setFetching] = useState(true); // Estado de carregamento inicial
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [initialData, setInitialData] = useState<any>(null);

    // 1. Busca os dados do imóvel ao carregar
    useEffect(() => {
        if (!id) return;

        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/properties/${id}`);
                if (!res.ok) throw new Error("Falha ao buscar imóvel");

                const data = await res.json();
                setInitialData(data);
            } catch (error) {
                console.error(error);
                alert("Erro ao carregar dados do imóvel. Ele pode ter sido excluído.");
                router.push("/admin/imoveis");
            } finally {
                setFetching(false);
            }
        };

        fetchProperty();
    }, [id, router]);

    // 2. Função de Atualizar (PUT)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpdateProperty = async (formData: any) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.refresh(); // Atualiza cache local
                router.push("/admin/imoveis");
            } else {
                const errorData = await res.json();
                alert(`Erro ao atualizar: ${errorData.message || "Tente novamente."}`);
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão ao atualizar.");
        } finally {
            setLoading(false);
        }
    };

    // 3. Loading State (Enquanto busca os dados)
    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center flex flex-col items-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Carregando dados do imóvel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Editar Imóvel</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Atualizando: <span className="font-semibold text-blue-600 dark:text-blue-400">{initialData?.titulo}</span>
                        </p>
                    </div>
                    <Link
                        href="/admin/imoveis"
                        className="flex items-center gap-2 px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-gray-700 dark:text-gray-200"
                    >
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                </div>

                {/* Formulário Preenchido */}
                <PropertyForm
                    initialData={initialData}
                    onSubmit={handleUpdateProperty}
                    loading={loading}
                    submitLabel="Salvar Alterações"
                    userRole={session?.user?.role as string} // Role passada aqui também
                />
            </div>
        </div>
    );
}
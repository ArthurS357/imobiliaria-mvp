"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react"; // Importação necessária para pegar a role
import { PropertyForm } from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
    const router = useRouter();
    const { data: session } = useSession(); // Pega os dados do usuário logado
    const [loading, setLoading] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCreateProperty = async (formData: any) => {
        setLoading(true);
        try {
            // Adiciona o ID do corretor automaticamente se não vier no form
            // (O backend deve validar isso, mas enviamos por garantia)
            const payload = {
                ...formData,
                corretorId: session?.user?.id
            };

            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                // Sucesso: Força atualização do cache e redireciona
                router.refresh();
                router.push("/admin/imoveis");
            } else {
                const errorData = await res.json();
                alert(`Erro ao cadastrar imóvel: ${errorData.message || "Tente novamente."}`);
            }
        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert("Erro de conexão. Verifique sua internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                {/* Cabeçalho */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Novo Imóvel</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Preencha as informações obrigatórias marcadas com <span className="text-[#eaca42] font-bold">*</span>.
                        </p>
                    </div>
                    <Link
                        href="/admin/imoveis"
                        className="flex items-center gap-2 px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-gray-700 dark:text-gray-200"
                    >
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                </div>

                {/* Formulário Reutilizável com Permissões */}
                <PropertyForm
                    onSubmit={handleCreateProperty}
                    loading={loading}
                    submitLabel="Publicar Imóvel"
                    // Passamos a role do usuário para o formulário saber o que mostrar
                    userRole={session?.user?.role as string}
                />
            </div>
        </div>
    );
}
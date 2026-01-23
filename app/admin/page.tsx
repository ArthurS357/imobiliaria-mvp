import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"; // <--- Importação Corrigida aqui
import { DashboardClient } from "@/components/admin/DashboardClient";
import { Home, TrendingUp, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma"; // <--- Usando o prisma singleton correto

export default async function AdminDashboardPage() {
    // 1. SEGURANÇA: Verifica sessão no lado do servidor
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/admin/login");
    }

    // Bloqueio extra opcional
    if (session.user.role !== "ADMIN") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-red-600 bg-gray-50">
                <h1 className="text-2xl font-bold">Acesso restrito</h1>
                <p>Esta área é exclusiva para administradores.</p>
                <a href="/" className="px-4 py-2 bg-gray-200 rounded text-gray-800 hover:bg-gray-300 transition">Voltar para o Site</a>
            </div>
        )
    }

    // 2. DADOS: Busca contadores reais do banco
    const totalImoveis = await prisma.property.count();
    const imoveisPendentes = await prisma.property.count({ where: { status: "PENDENTE" } });
    const imoveisVendidos = await prisma.property.count({ where: { status: "VENDIDO" } });

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Componente Cliente (Logout, Criar Usuário e Ações Rápidas) */}
                <DashboardClient user={session.user} />

                {/* Estatísticas Rápidas (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                    {/* Card Total */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-900 rounded-full">
                            <Home size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total de Imóveis</p>
                            <h3 className="text-2xl font-bold text-gray-900">{totalImoveis}</h3>
                        </div>
                    </div>

                    {/* Card Pendentes */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 text-yellow-700 rounded-full">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Aguardando Aprovação</p>
                            <h3 className="text-2xl font-bold text-gray-900">{imoveisPendentes}</h3>
                        </div>
                    </div>

                    {/* Card Vendidos */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-700 rounded-full">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Imóveis Vendidos</p>
                            <h3 className="text-2xl font-bold text-gray-900">{imoveisVendidos}</h3>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
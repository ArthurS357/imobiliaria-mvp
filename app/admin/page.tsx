import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Ajuste o caminho conforme sua estrutura
import { DashboardClient } from "@/components/admin/DashboardClient";
import { Home, TrendingUp, Clock } from "lucide-react";
import { PrismaClient } from "@prisma/client";

// Inicializa Prisma para contar os dados reais (Opcional agora, mas bom para o MVP)
const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
    // 1. SEGURANÇA: Verifica sessão no lado do servidor
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/admin/login");
    }

    // Se quiser bloquear não-admins de verem essa tela:
    if (session.user.role !== "ADMIN") {
        return (
            <div className="p-8 text-center text-red-600">
                Acesso restrito a administradores. <a href="/" className="underline">Voltar</a>
            </div>
        )
    }

    [cite_start]// 2. DADOS: Busca contadores para o Dashboard (Cláusula 2.2 do contrato) [cite: 32]
    const totalImoveis = await prisma.property.count();
    const imoveisPendentes = await prisma.property.count({ where: { status: "PENDENTE" } });
    const imoveisVendidos = await prisma.property.count({ where: { status: "VENDIDO" } });

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Componente Cliente (Logout e Criar Usuário) */}
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
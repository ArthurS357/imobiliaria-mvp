import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    Building2,
    Users,
    MessageSquare,
    Calendar,
    LogOut,
    LayoutDashboard,
    TrendingUp
} from "lucide-react";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/admin/login");
    }

    const userRole = session.user.role;
    const userName = session.user.name;
    const isAdmin = userRole === 'ADMIN';

    // Busca dados estatísticos
    const totalImoveis = await prisma.property.count();
    const totalMensagens = await prisma.lead.count();
    const totalVisitas = await prisma.visit.count({ where: { status: "PENDENTE" } });

    // Estatísticas específicas do corretor (Opcional)
    const meusImoveis = !isAdmin
        ? await prisma.property.count({ where: { corretorId: session.user.id } })
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-500">

            {/* Navbar do Admin */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm transition-colors">
                <div className="flex items-center gap-3 text-blue-900 dark:text-blue-400">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <span className="font-bold text-xl tracking-tight block leading-none">Painel {isAdmin ? 'Admin' : 'Corretor'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">Bem-vindo de volta</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{userName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {userRole}
                        </p>
                    </div>
                    <Link
                        href="/api/auth/signout"
                        className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                        title="Sair"
                    >
                        <LogOut size={20} />
                    </Link>
                </div>
            </header>

            <main className="flex-grow p-6 max-w-7xl mx-auto w-full animate-enter">

                {/* Métricas (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Imóveis Cadastrados</p>
                            <p className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                                {isAdmin ? totalImoveis : meusImoveis}
                            </p>
                            {!isAdmin && <p className="text-xs text-gray-400 mt-1">Do total de {totalImoveis}</p>}
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-blue-600 dark:text-blue-400">
                            <Building2 size={28} />
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Visitas Pendentes</p>
                            <p className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">{totalVisitas}</p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-xl text-yellow-600 dark:text-yellow-400">
                            <Calendar size={28} />
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Novos Leads</p>
                            <p className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">{totalMensagens}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl text-green-600 dark:text-green-400">
                            <MessageSquare size={28} />
                        </div>
                    </div>
                </div>

                {/* Menu de Ações Rápidas */}
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={20} className="text-blue-900 dark:text-blue-400" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gerenciamento Rápido</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Card: Meus Imóveis */}
                    <Link href="/admin/imoveis" className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
                            <Building2 size={32} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">Gerenciar Imóveis</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Adicionar, editar ou remover imóveis do portfólio.</p>
                        </div>
                    </Link>

                    {/* Card: Visitas */}
                    <Link href="/admin/visitas" className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-yellow-500 dark:hover:border-yellow-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-transparent dark:from-yellow-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-5 rounded-full text-yellow-600 dark:text-yellow-400 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative z-10">
                            <Calendar size={32} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">Agenda de Visitas</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Confirmar horários ou reagendar visitas.</p>
                        </div>
                    </Link>

                    {/* Card: Leads */}
                    <Link href="/admin/mensagens" className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="bg-green-50 dark:bg-green-900/30 p-5 rounded-full text-green-600 dark:text-green-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
                            <MessageSquare size={32} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">Central de Leads</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Responder contatos vindos do site.</p>
                        </div>
                    </Link>

                    {/* Card: Usuários (Admin Only) */}
                    {isAdmin && (
                        <Link href="/admin/usuarios" className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-3 right-3 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-purple-200 dark:border-purple-700 z-20">
                                ADMIN
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/30 p-5 rounded-full text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative z-10">
                                <Users size={32} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">Gestão de Equipe</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Gerenciar corretores, acessos e senhas.</p>
                            </div>
                        </Link>
                    )}
                </div>

            </main>
        </div>
    );
}
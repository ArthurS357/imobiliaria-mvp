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
    LayoutDashboard,
    TrendingUp,
    Clock,
    ArrowRight
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/admin/LogoutButton";

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
    // Busca visitas pendentes para alertar o admin
    const totalVisitasPendentes = await prisma.visit.count({ where: { status: "PENDENTE" } });

    // Estatísticas específicas do corretor (caso não seja admin)
    const meusImoveis = !isAdmin
        ? await prisma.property.count({ where: { corretorId: session.user.id } })
        : 0;

    // Formatação da data atual (Ex: Segunda-feira, 25 de Janeiro)
    const currentDate = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date());

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-500">

            {/* Navbar do Admin */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm transition-colors">
                <div className="flex items-center gap-3 text-blue-900 dark:text-blue-400">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <span className="font-bold text-xl tracking-tight block leading-none text-gray-900 dark:text-white">
                            Matiello<span className="text-blue-600 dark:text-blue-400">Admin</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                            Painel {isAdmin ? 'Gerencial' : 'do Corretor'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    {/* Botão de Modo Escuro */}
                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    <div className="text-right hidden sm:block border-r border-gray-200 dark:border-gray-700 pr-6 mr-2">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{userName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {userRole}
                        </p>
                    </div>

                    {/* Botão de Logout (Componente Cliente) */}
                    <LogoutButton />
                </div>
            </header>

            <main className="flex-grow p-6 max-w-7xl mx-auto w-full animate-enter">

                {/* Visível apenas em Mobile (Theme Toggle) */}
                <div className="sm:hidden flex justify-end mb-4">
                    <ThemeToggle />
                </div>

                {/* Seção de Boas Vindas */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        Olá, {userName?.split(' ')[0]}! 👋
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <Clock size={16} />
                        <span className="capitalize">{currentDate}</span>
                    </div>
                </div>

                {/* Métricas (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                    {/* Card 1: Imóveis */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-all group">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                                {isAdmin ? "Total de Imóveis" : "Meus Imóveis"}
                            </p>
                            <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                {isAdmin ? totalImoveis : meusImoveis}
                            </p>
                            {!isAdmin && <p className="text-xs text-gray-400 mt-1">Do total de {totalImoveis} na imobiliária</p>}
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <Building2 size={28} />
                        </div>
                    </div>

                    {/* Card 2: Visitas (Com destaque se houver pendências) */}
                    <div className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between hover:shadow-md transition-all group relative overflow-hidden
                        ${totalVisitasPendentes > 0
                            ? 'bg-yellow-50/50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800'
                            : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'
                        }`}>
                        <div>
                            <p className={`text-sm font-medium mb-1 ${totalVisitasPendentes > 0 ? 'text-yellow-700 dark:text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                Visitas Pendentes
                            </p>
                            <div className="flex items-baseline gap-2">
                                <p className={`text-4xl font-extrabold tracking-tight ${totalVisitasPendentes > 0 ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>
                                    {totalVisitasPendentes}
                                </p>
                                {totalVisitasPendentes > 0 && (
                                    <span className="text-[10px] font-bold uppercase bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300 animate-pulse">
                                        Ação Necessária
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={`p-4 rounded-xl transition-transform duration-300 group-hover:scale-110 
                            ${totalVisitasPendentes > 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400' : 'bg-gray-50 text-gray-400 dark:bg-gray-700/50 dark:text-gray-500'}`}>
                            <Calendar size={28} />
                        </div>
                    </div>

                    {/* Card 3: Leads */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-all group">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total de Leads</p>
                            <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{totalMensagens}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                            <MessageSquare size={28} />
                        </div>
                    </div>
                </div>

                {/* Divisor */}
                <hr className="border-gray-200 dark:border-gray-700 mb-8 opacity-50" />

                {/* Menu de Ações Rápidas */}
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={20} className="text-blue-900 dark:text-blue-400" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Acesso Rápido</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Link: Imóveis */}
                    <Link href="/admin/imoveis" className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden h-full justify-between">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Building2 size={80} className="text-blue-900 dark:text-blue-400 transform rotate-12" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                                <Building2 size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Imóveis</h3>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Gerenciar portfólio</span>
                            <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
                        </div>
                    </Link>

                    {/* Link: Visitas */}
                    <Link href="/admin/visitas" className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-yellow-500 dark:hover:border-yellow-500 hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden h-full justify-between">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Calendar size={80} className="text-yellow-600 dark:text-yellow-400 transform -rotate-12" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg text-yellow-600 dark:text-yellow-400">
                                <Calendar size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Agenda</h3>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Ver solicitações</span>
                            <ArrowRight size={18} className="text-gray-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-all group-hover:translate-x-1" />
                        </div>
                    </Link>

                    {/* Link: Leads */}
                    <Link href="/admin/mensagens" className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden h-full justify-between">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MessageSquare size={80} className="text-green-600 dark:text-green-400 transform rotate-12" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg text-green-600 dark:text-green-400">
                                <MessageSquare size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Leads</h3>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Caixa de entrada</span>
                            <ArrowRight size={18} className="text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-all group-hover:translate-x-1" />
                        </div>
                    </Link>

                    {/* Link: Usuários (Admin Only) */}
                    {isAdmin && (
                        <Link href="/admin/usuarios" className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden h-full justify-between">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users size={80} className="text-purple-600 dark:text-purple-400 transform -rotate-12" />
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg text-purple-600 dark:text-purple-400">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">Equipe</h3>
                                    <span className="text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Controle de acesso</span>
                                <ArrowRight size={18} className="text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all group-hover:translate-x-1" />
                            </div>
                        </Link>
                    )}
                </div>

            </main>
        </div>
    );
}
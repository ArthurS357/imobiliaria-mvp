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
    Plus,
    LogOut,
    ShieldCheck,
    LayoutDashboard
} from "lucide-react";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/admin/login");
    }

    const userRole = session.user.role; // "ADMIN" ou "FUNCIONARIO"
    const userName = session.user.name;

    // Busca dados estatísticos
    const totalImoveis = await prisma.property.count();
    const totalMensagens = await prisma.lead.count();
    const totalVisitas = await prisma.visit.count({ where: { status: "PENDENTE" } });

    // Se for corretor, poderíamos filtrar estatísticas apenas dele aqui se quiséssemos
    // const meusImoveis = await prisma.property.count({ where: { corretorId: session.user.id } });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Navbar do Admin */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2 text-blue-900">
                    <LayoutDashboard size={24} />
                    <span className="font-bold text-xl tracking-tight">Painel {userRole === 'ADMIN' ? 'Administrativo' : 'do Corretor'}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{userName}</p>
                        <p className="text-xs text-gray-500">{userRole}</p>
                    </div>
                    <Link href="/api/auth/signout" className="p-2 text-gray-400 hover:text-red-600 transition" title="Sair">
                        <LogOut size={20} />
                    </Link>
                </div>
            </header>

            <main className="flex-grow p-6 max-w-7xl mx-auto w-full">

                {/* Métricas (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Imóveis Cadastrados</p>
                            <p className="text-3xl font-bold text-gray-800">{totalImoveis}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Building2 size={24} /></div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Visitas Pendentes</p>
                            <p className="text-3xl font-bold text-gray-800">{totalVisitas}</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-full text-yellow-600"><Calendar size={24} /></div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Novos Leads</p>
                            <p className="text-3xl font-bold text-gray-800">{totalMensagens}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-full text-green-600"><MessageSquare size={24} /></div>
                    </div>
                </div>

                {/* Menu de Ações Rápidas */}
                <h2 className="text-lg font-bold text-gray-800 mb-4">Gerenciamento</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Card: Meus Imóveis (Para todos) */}
                    <Link href="/admin/imoveis" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition flex flex-col items-center text-center gap-3">
                        <div className="bg-blue-50 p-4 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                            <Building2 size={28} />
                        </div>
                        <h3 className="font-bold text-gray-800">Gerenciar Imóveis</h3>
                        <p className="text-xs text-gray-500">Adicionar, editar ou remover imóveis do site.</p>
                    </Link>

                    {/* Card: Visitas (Para todos) */}
                    <Link href="/admin/visitas" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition flex flex-col items-center text-center gap-3">
                        <div className="bg-yellow-50 p-4 rounded-full text-yellow-600 group-hover:scale-110 transition-transform">
                            <Calendar size={28} />
                        </div>
                        <h3 className="font-bold text-gray-800">Agenda de Visitas</h3>
                        <p className="text-xs text-gray-500">Confirmar ou cancelar visitas agendadas.</p>
                    </Link>

                    {/* Card: Leads (Para todos) */}
                    <Link href="/admin/mensagens" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition flex flex-col items-center text-center gap-3">
                        <div className="bg-green-50 p-4 rounded-full text-green-600 group-hover:scale-110 transition-transform">
                            <MessageSquare size={28} />
                        </div>
                        <h3 className="font-bold text-gray-800">Mensagens (Leads)</h3>
                        <p className="text-xs text-gray-500">Ver contatos recebidos pelo site.</p>
                    </Link>

                    {/* --- ÁREA RESTRITA AO ADMIN --- */}
                    {userRole === "ADMIN" && (
                        <Link href="/admin/usuarios" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-500 hover:shadow-md transition flex flex-col items-center text-center gap-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-bl font-bold">ADMIN</div>
                            <div className="bg-purple-50 p-4 rounded-full text-purple-600 group-hover:scale-110 transition-transform">
                                <Users size={28} />
                            </div>
                            <h3 className="font-bold text-gray-800">Gestão de Equipe</h3>
                            <p className="text-xs text-gray-500">Criar contas, alterar senhas e cargos.</p>
                        </Link>
                    )}

                </div>

                {userRole === "ADMIN" && (
                    <div className="mt-8 flex justify-end">
                        <Link href="/api/admin/create-user" className="hidden text-xs text-gray-400 hover:underline">
                            Rota rápida de criação (Debug)
                        </Link>
                    </div>
                )}

            </main>
        </div>
    );
}
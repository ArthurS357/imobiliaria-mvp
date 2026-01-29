"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { UserPlus, LogOut, Save, ShieldCheck, Building, PlusCircle, List, Mail, TrendingUp, Key } from "lucide-react";

export function DashboardClient({ user }: { user: { name?: string | null; email?: string | null; role?: string } }) {
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [loadingUser, setLoadingUser] = useState(false);
    const [message, setMessage] = useState("");

    // Estados para Estatísticas
    const [stats, setStats] = useState({
        total: 0,
        disponiveis: 0,
        venda: 0,
        locacao: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    // Carregar estatísticas ao iniciar
    useEffect(() => {
        async function fetchStats() {
            try {
                // Usa a API existente com filtro de admin para pegar tudo
                const res = await fetch("/api/properties?admin=true");
                if (res.ok) {
                    const data = await res.json();
                    setStats({
                        total: data.length,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        disponiveis: data.filter((p: any) => p.status === "DISPONIVEL").length,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        venda: data.filter((p: any) => p.finalidade?.includes("Venda")).length,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        locacao: data.filter((p: any) => p.finalidade?.includes("Locação")).length,
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar estatísticas", error);
            } finally {
                setLoadingStats(false);
            }
        }
        fetchStats();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingUser(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newUserEmail, name: newUserName }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Usuário criado e e-mail enviado!");
                setNewUserEmail("");
                setNewUserName("");
            } else {
                setMessage(`❌ Erro: ${data.error}`);
            }
        } catch (error) {
            setMessage("❌ Erro ao conectar com o servidor.");
        } finally {
            setLoadingUser(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Cabeçalho do Admin */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Painel Administrativo</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Bem-vindo, <span className="font-semibold text-blue-900 dark:text-blue-400">{user.name || "Colaborador"}</span>
                    </p>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-md transition border border-transparent hover:border-red-100 dark:hover:border-red-900"
                >
                    <LogOut size={18} /> Sair
                </button>
            </div>

            {/* --- ESTATÍSTICAS RÁPIDAS --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">Total Imóveis</span>
                    <span className="text-3xl font-black text-gray-800 dark:text-white mt-1">
                        {loadingStats ? "-" : stats.total}
                    </span>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 flex flex-col items-center justify-center text-center">
                    <span className="text-green-600 dark:text-green-400 text-xs font-bold uppercase">Disponíveis</span>
                    <span className="text-3xl font-black text-green-700 dark:text-green-300 mt-1">
                        {loadingStats ? "-" : stats.disponiveis}
                    </span>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center text-center">
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase flex items-center gap-1"><TrendingUp size={14} /> Venda</span>
                    <span className="text-3xl font-black text-blue-700 dark:text-blue-300 mt-1">
                        {loadingStats ? "-" : stats.venda}
                    </span>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800 flex flex-col items-center justify-center text-center">
                    <span className="text-orange-600 dark:text-orange-400 text-xs font-bold uppercase flex items-center gap-1"><Key size={14} /> Locação</span>
                    <span className="text-3xl font-black text-orange-700 dark:text-orange-300 mt-1">
                        {loadingStats ? "-" : stats.locacao}
                    </span>
                </div>
            </div>

            {/* --- ÁREA DE GESTÃO DE IMÓVEIS --- */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 rounded-xl shadow-md p-6 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Building className="text-blue-300" /> Catálogo de Imóveis
                    </h2>
                    <p className="text-blue-100 text-sm mt-1 max-w-md">
                        Gerencie todo o seu portfólio. Cadastre novos imóveis para Venda ou Locação e mantenha os dados atualizados.
                    </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Link
                        href="/admin/imoveis"
                        className="bg-blue-700/50 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition shadow-sm flex items-center justify-center gap-2 border border-blue-500/30"
                    >
                        <List size={20} /> Listar Todos
                    </Link>

                    <Link
                        href="/admin/imoveis/novo"
                        className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <PlusCircle size={20} /> Cadastrar Novo
                    </Link>
                </div>
            </div>

            {/* --- CARD DE MENSAGENS (CRM) --- */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Caixa de Entrada (CRM)</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Acompanhe os leads e agendamentos de visitas.</p>
                    </div>
                </div>
                <Link
                    href="/admin/mensagens"
                    className="w-full md:w-auto text-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md flex items-center justify-center gap-2"
                >
                    Ver Mensagens
                </Link>
            </div>

            {/* Seção de Gestão de Equipe (Apenas Admin vê) */}
            {user.role === "ADMIN" && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <ShieldCheck className="text-blue-900 dark:text-blue-400" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Gestão de Equipe</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Formulário */}
                        <div>
                            <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <UserPlus size={20} className="text-gray-400" /> Cadastrar Novo Funcionário
                            </h3>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUserName}
                                        onChange={(e) => setNewUserName(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Ex: João Silva"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail Corporativo</label>
                                    <input
                                        type="email"
                                        required
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="joao@imobiliaria.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loadingUser}
                                    className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition"
                                >
                                    {loadingUser ? "Processando..." : <><Save size={16} /> Criar Conta</>}
                                </button>

                                {message && (
                                    <p className={`text-sm p-3 rounded-lg ${message.includes('Erro') ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                                        {message}
                                    </p>
                                )}
                            </form>
                        </div>

                        {/* Explicação */}
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl h-fit border border-gray-100 dark:border-gray-700">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Permissões de Acesso</h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-3 list-disc pl-5">
                                <li>O funcionário receberá a senha no e-mail cadastrado.</li>
                                <li>Eles poderão cadastrar imóveis, mas com status <strong>Pendente</strong>.</li>
                                <li>Você (Admin) precisará aprovar os imóveis para que apareçam no site público.</li>
                                <li>Funcionários podem ver apenas os seus próprios leads e visitas agendadas.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
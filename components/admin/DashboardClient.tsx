"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { UserPlus, LogOut, Save, ShieldCheck, Building, PlusCircle, List } from "lucide-react";

export function DashboardClient({ user }: { user: { name?: string | null; email?: string | null; role?: string } }) {
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
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
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Cabeçalho do Admin */}
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
                    <p className="text-gray-500">
                        Olá, <span className="font-semibold text-blue-900">{user.name || "Colaborador"}</span>
                    </p>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md transition border border-transparent hover:border-red-100"
                >
                    <LogOut size={18} /> Sair
                </button>
            </div>

            {/* --- ÁREA DE GESTÃO DE IMÓVEIS (Atualizada) --- */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-md p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Building className="text-blue-300" /> Catálogo de Imóveis
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                        Cadastre novos imóveis ou gerencie os anúncios existentes.
                    </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Link
                        href="/admin/imoveis"
                        className="bg-blue-700 text-white px-5 py-3 rounded font-medium hover:bg-blue-600 transition shadow-sm flex items-center justify-center gap-2 border border-blue-500"
                    >
                        <List size={20} /> Gerenciar Anúncios
                    </Link>

                    <Link
                        href="/admin/imoveis/novo"
                        className="bg-white text-blue-900 px-5 py-3 rounded font-medium hover:bg-gray-100 transition shadow-sm flex items-center justify-center gap-2 hover:scale-105 transform duration-200"
                    >
                        <PlusCircle size={20} /> Cadastrar Novo
                    </Link>
                </div>
            </div>

            {/* Seção de Gestão de Equipe (Apenas Admin vê) */}
            {user.role === "ADMIN" && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 border-b pb-4">
                        <ShieldCheck className="text-blue-900" />
                        <h2 className="text-xl font-semibold text-gray-800">Gestão de Equipe</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Formulário */}
                        <div>
                            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                <UserPlus size={20} className="text-gray-400" /> Cadastrar Novo Funcionário
                            </h3>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUserName}
                                        onChange={(e) => setNewUserName(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Ex: João Silva"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">E-mail Corporativo</label>
                                    <input
                                        type="email"
                                        required
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="joao@imobiliaria.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition"
                                >
                                    {loading ? "Processando..." : <><Save size={16} /> Criar Conta</>}
                                </button>

                                {message && (
                                    <p className={`text-sm p-2 rounded ${message.includes('Erro') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                        {message}
                                    </p>
                                )}
                            </form>
                        </div>

                        {/* Explicação */}
                        <div className="bg-gray-50 p-4 rounded-lg h-fit">
                            <h4 className="font-medium text-gray-900 mb-2">Permissões de Acesso</h4>
                            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                                <li>O funcionário receberá a senha no e-mail cadastrado.</li>
                                <li>Eles poderão cadastrar imóveis, mas com status <strong>Pendente</strong>.</li>
                                <li>Você (Admin) precisará aprovar os imóveis para irem ao site.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
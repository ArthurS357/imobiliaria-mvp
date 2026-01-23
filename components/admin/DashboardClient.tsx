"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { UserPlus, LogOut, Save, ShieldCheck } from "lucide-react";

export function DashboardClient({ user }: { user: { name?: string | null; email?: string | null } }) {
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
                    <p className="text-gray-500">Bem-vindo, {user.name || "Administrador"}</p>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md transition"
                >
                    <LogOut size={18} /> Sair
                </button>
            </div>

            {/* Seção de Gestão de Equipe (Requisito do Contrato) */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                    <ShieldCheck className="text-blue-900" />
                    <h2 className="text-xl font-semibold text-gray-800">Gestão de Equipe</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Formulário de Criação */}
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
                                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? "Processando..." : <><Save size={16} /> Criar Conta e Enviar E-mail</>}
                            </button>

                            {message && (
                                <p className={`text-sm p-2 rounded ${message.includes('Erro') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                    {message}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Lista de Explicação (Placeholder Visual) */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Como funciona o acesso?</h4>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                            <li>Ao cadastrar, uma <strong>senha provisória</strong> é gerada automaticamente.</li>
                            <li>O funcionário recebe as credenciais no e-mail informado.</li>
                            <li>O nível de acesso padrão é <strong>FUNCIONÁRIO</strong> (pode cadastrar imóveis, mas dependem de aprovação).</li>
                            <li>Somente você (Admin) pode promover alguém ou aprovar imóveis.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
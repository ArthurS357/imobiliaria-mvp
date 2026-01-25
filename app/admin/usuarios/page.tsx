"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, X, UserPlus, Shield, User as UserIcon, Loader2 } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    creci?: string | null;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para criação e edição
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Estados do formulário de criação
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "FUNCIONARIO", creci: "" });

    // Estados de Loading (Feedback visual)
    const [creating, setCreating] = useState(false); // Para o botão "Criar"
    const [isSaving, setIsSaving] = useState(false); // Para o botão "Salvar" (Edição)

    // Busca usuários
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            const res = await fetch("/api/admin/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (res.ok) {
                alert("Usuário criado com sucesso!");
                setShowCreateModal(false);
                setNewUser({ name: "", email: "", password: "", role: "FUNCIONARIO", creci: "" });
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.error || "Erro ao criar usuário.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

        const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
        if (res.ok) {
            fetchUsers();
        } else {
            const err = await res.json();
            alert(err.error || "Erro ao excluir");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setIsSaving(true); // Inicia o loading "Salvando..."

        try {
            const res = await fetch(`/api/admin/users/${editingUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingUser),
            });

            if (res.ok) {
                setEditingUser(null);
                fetchUsers();
            } else {
                alert("Erro ao atualizar");
            }
        } catch (error) {
            alert("Erro de conexão");
        } finally {
            setIsSaving(false); // Finaliza o loading
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-600 dark:text-gray-300">Carregando...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestão de Contas</h1>
                        <p className="text-gray-500 dark:text-gray-400">Gerencie corretores e administradores.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-900 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 transition flex items-center gap-2 font-bold shadow-md"
                        >
                            <UserPlus size={20} /> Novo Usuário
                        </button>
                        <Link href="/admin" className="text-gray-600 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 flex items-center gap-2 font-medium px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <ArrowLeft size={20} /> Voltar
                        </Link>
                    </div>
                </div>

                {/* --- MODAL DE CRIAÇÃO --- */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg border border-gray-100 dark:border-gray-700 animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Criar Nova Conta</h2>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                    <input required type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: João Silva" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Corporativo</label>
                                    <input required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="joao@imobiliaria.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Senha Inicial</label>
                                    <input required type="text" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" placeholder="Senha forte123" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">CRECI (Opcional)</label>
                                    <input type="text" value={newUser.creci} onChange={e => setNewUser({ ...newUser, creci: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: 12345-F" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Cargo</label>
                                    <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="FUNCIONARIO">Corretor (Padrão)</option>
                                        <option value="ADMIN">Administrador (Acesso Total)</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition">Cancelar</button>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="px-6 py-2.5 bg-blue-900 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 font-bold transition flex items-center gap-2 disabled:opacity-70 min-w-[140px] justify-center"
                                    >
                                        {creating ? <><Loader2 className="animate-spin" size={20} /> Criando...</> : "Criar Conta"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- MODAL DE EDIÇÃO --- */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Editar Usuário</h2>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                                    <input
                                        value={editingUser.name}
                                        onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <input
                                        value={editingUser.email}
                                        onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                {/* ADICIONADO: Campo CRECI no modal de edição */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CRECI</label>
                                    <input
                                        value={editingUser.creci || ""}
                                        onChange={e => setEditingUser({ ...editingUser, creci: e.target.value })}
                                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: 12345"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cargo</label>
                                    <select
                                        value={editingUser.role}
                                        onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="FUNCIONARIO">Corretor</option>
                                        <option value="ADMIN">Administrador</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t dark:border-gray-700">
                                    <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">Cancelar</button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-4 py-2 bg-blue-900 dark:bg-blue-700 text-white rounded hover:bg-blue-800 dark:hover:bg-blue-600 transition flex items-center gap-2 disabled:opacity-70 min-w-[100px] justify-center"
                                    >
                                        {isSaving ? <><Loader2 className="animate-spin" size={16} /> Salvando...</> : "Salvar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Nome</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">CRECI</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Cargo</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                                    <td className="p-4 font-medium text-gray-800 dark:text-white">{user.name}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300 font-mono text-sm">
                                        {user.creci || <span className="text-gray-400 dark:text-gray-500">-</span>}
                                    </td>
                                    <td className="p-4">
                                        {user.role === "ADMIN" ? (
                                            <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-bold">
                                                <Shield size={12} /> ADMIN
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-bold">
                                                <UserIcon size={12} /> CORRETOR
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => setEditingUser(user)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
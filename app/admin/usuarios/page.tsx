"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Edit,
    Trash2,
    X,
    UserPlus,
    Shield,
    User as UserIcon,
    Loader2,
    MailCheck,
    Search,
    UserCircle,
    Mail,
    Lock,
    FileText
} from "lucide-react";

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

    // Estado da Busca
    const [searchTerm, setSearchTerm] = useState("");

    // Estados para criação e edição
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Estados do formulário de criação
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "FUNCIONARIO", creci: "" });

    // Estados de Loading (Feedback visual)
    const [creating, setCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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

    // Lógica de Filtro
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.creci && user.creci.includes(searchTerm))
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            const res = await fetch("/api/admin/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.emailSent) {
                    alert(`Usuário ${data.user.name} criado e credenciais enviadas por e-mail!`);
                } else {
                    alert(`Usuário criado, mas houve um erro ao enviar o e-mail. Por favor, envie a senha manualmente.`);
                }

                setShowCreateModal(false);
                setNewUser({ name: "", email: "", password: "", role: "FUNCIONARIO", creci: "" });
                fetchUsers();
            } else {
                alert(data.error || "Erro ao criar usuário.");
            }
        } catch (error) {
            alert("Erro de conexão com o servidor.");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita.")) return;

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

        setIsSaving(true);

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
                const err = await res.json();
                alert(err.error || "Erro ao atualizar");
            }
        } catch (error) {
            alert("Erro de conexão");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Loader2 className="animate-spin text-blue-900 dark:text-blue-400" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">

                {/* CABEÇALHO */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestão de Contas</h1>
                        <p className="text-gray-500 dark:text-gray-400">Gerencie corretores e administradores do sistema.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin" className="text-gray-600 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 flex items-center gap-2 font-medium px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
                            <ArrowLeft size={18} /> Voltar
                        </Link>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-900 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 transition flex items-center gap-2 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <UserPlus size={18} /> Novo Usuário
                        </button>
                    </div>
                </div>

                {/* BARRA DE FERRAMENTAS (BUSCA) */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
                    <div className="relative w-full sm:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou CRECI..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Total: {users.length} usuário(s)
                    </div>
                </div>

                {/* TABELA DE USUÁRIOS */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                    {filteredUsers.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-3">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhum usuário encontrado</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Tente buscar por outro termo.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap text-sm uppercase tracking-wider">Nome</th>
                                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap text-sm uppercase tracking-wider">Email</th>
                                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap text-sm uppercase tracking-wider">CRECI</th>
                                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap text-sm uppercase tracking-wider">Cargo</th>
                                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right whitespace-nowrap text-sm uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition group">
                                            <td className="p-4 font-medium text-gray-800 dark:text-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-200 font-bold text-sm shadow-sm border border-gray-200 dark:border-gray-600">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300 text-sm">{user.email}</td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300 font-mono text-xs">
                                                {user.creci ? (
                                                    <span className="bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium">
                                                        {user.creci}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-600">-</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {user.role === "ADMIN" ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full text-xs font-bold border border-purple-100 dark:border-purple-800/50">
                                                        <Shield size={12} /> ADMIN
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800/50">
                                                        <UserIcon size={12} /> CORRETOR
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingUser(user)}
                                                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* --- MODAL DE CRIAÇÃO --- */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false) }}>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg border border-gray-100 dark:border-gray-700 relative">
                            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"><X size={24} /></button>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <UserPlus className="text-blue-900 dark:text-blue-400" /> Criar Conta
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Adicionar novo membro à equipe.</p>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input required type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" placeholder="Ex: João Silva" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Corporativo</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" placeholder="joao@imobiliaria.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Senha Inicial</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input required type="text" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-gray-900 dark:text-white" placeholder="Senha123" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"><MailCheck size={12} /> Enviada por e-mail.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">CRECI</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input type="text" value={newUser.creci} onChange={e => setNewUser({ ...newUser, creci: e.target.value })} className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" placeholder="12345-F" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Cargo</label>
                                        <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white h-[42px]">
                                            <option value="FUNCIONARIO">Corretor</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition">Cancelar</button>
                                    <button type="submit" disabled={creating} className="px-6 py-2.5 bg-blue-900 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-bold transition flex items-center gap-2 disabled:opacity-70 min-w-[140px] justify-center shadow-md">
                                        {creating ? <><Loader2 className="animate-spin" size={20} /> Criando...</> : "Criar Conta"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- MODAL DE EDIÇÃO --- */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setEditingUser(null) }}>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 relative">
                            <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"><X size={24} /></button>
                            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                                <Edit size={20} className="text-blue-900 dark:text-blue-400" /> Editar Usuário
                            </h2>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                                    <input value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CRECI</label>
                                    <input value={editingUser.creci || ""} onChange={e => setEditingUser({ ...editingUser, creci: e.target.value })} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 12345" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo</label>
                                    <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="FUNCIONARIO">Corretor</option>
                                        <option value="ADMIN">Administrador</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-2 mt-6 pt-4 border-t dark:border-gray-700">
                                    <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Cancelar</button>
                                    <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-900 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition flex items-center gap-2 disabled:opacity-70 min-w-[100px] justify-center shadow-md">
                                        {isSaving ? <><Loader2 className="animate-spin" size={16} /> Salvando...</> : "Salvar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

import { User, CreateUserData } from "./types";
import { UserToolbar } from "./components/UserToolbar";
import { UserTable } from "./components/UserTable";

import {
  CreateUserModal,
  EditUserModal,
  DeleteUserModal,
} from "./components/UserModals";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("TODOS");

  // Estados dos Modais
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // NOVO: Estado para o usuário que será excluído
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ... (useEffect e fetchUsers permanecem iguais) ...
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.sort((a: User, b: User) => a.name.localeCompare(b.name)));
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  // ... (filteredUsers permanece igual) ...
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.creci && user.creci.includes(searchTerm));
    const matchesRole = roleFilter === "TODOS" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // ... (handleCreate e handleUpdate permanecem iguais) ...
  const handleCreate = async (newUser: CreateUserData) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.emailSent) {
          toast.success(`Usuário ${data.user.name} criado! Email enviado.`);
        } else {
          toast.success(`Usuário criado!`);
        }
        setShowCreateModal(false);
        fetchUsers();
      } else {
        toast.error(data.error || "Erro ao criar usuário.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (updatedUser: User) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (res.ok) {
        toast.success("Usuário atualizado!");
        setEditingUser(null);
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao atualizar");
      }
    } catch (error) {
      toast.error("Erro de conexão");
    } finally {
      setIsSaving(false);
    }
  };

  // --- DELETE ATUALIZADO ---

  // 1. Apenas abre o modal, não deleta ainda
  const confirmDelete = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) setDeletingUser(user);
  };

  // 2. Executa a deleção de fato
  const handleDelete = async () => {
    if (!deletingUser) return;

    setIsSaving(true); // Reutilizando isSaving para loading do delete
    const toastId = toast.loading("Excluindo...");

    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Usuário excluído!", { id: toastId });
        setDeletingUser(null); // Fecha o modal
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao excluir", { id: toastId });
      }
    } catch (error) {
      toast.error("Erro de conexão", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2
          className="animate-spin text-blue-900 dark:text-blue-400"
          size={40}
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <UserToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          totalUsers={filteredUsers.length}
          onOpenCreateModal={() => setShowCreateModal(true)}
        />

        <UserTable
          users={filteredUsers}
          onEdit={setEditingUser}
          onDelete={confirmDelete} // Passa a função que abre o modal
        />

        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          isSaving={isSaving}
        />

        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdate}
          isSaving={isSaving}
        />

        {/* Novo Modal de Delete */}
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDelete}
          isDeleting={isSaving}
        />
      </div>
    </div>
  );
}

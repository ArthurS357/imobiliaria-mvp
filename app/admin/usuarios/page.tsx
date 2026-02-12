"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// Imports dos componentes refatorados
import { User, CreateUserData } from "./types";
import { UserToolbar } from "./components/UserToolbar";
import { UserTable } from "./components/UserTable";
import { CreateUserModal, EditUserModal } from "./components/UserModals";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("TODOS");

  // Controle de Modais
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  // Lógica de Filtro
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.creci && user.creci.includes(searchTerm));

    const matchesRole = roleFilter === "TODOS" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // --- ACTIONS ---

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
          toast.success(
            `Usuário ${data.user.name} criado! Email com credenciais enviado.`,
          );
        } else {
          toast.success(`Usuário criado! (Email não enviado, verifique logs)`);
        }
        setShowCreateModal(false);
        fetchUsers();
      } else {
        toast.error(data.error || "Erro ao criar usuário.");
      }
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (updatedUser: User) => {
    setIsSaving(true);
    const toastId = toast.loading("Salvando alterações...");

    try {
      const res = await fetch(`/api/admin/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        toast.success("Usuário atualizado!", { id: toastId });
        setEditingUser(null);
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao atualizar", { id: toastId });
      }
    } catch (error) {
      toast.error("Erro de conexão", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    const toastId = toast.loading("Excluindo...");
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Usuário excluído com sucesso!", { id: toastId });
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao excluir", { id: toastId });
      }
    } catch (error) {
      toast.error("Erro de conexão", { id: toastId });
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
          onDelete={handleDelete}
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
      </div>
    </div>
  );
}

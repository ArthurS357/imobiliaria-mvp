"use client";

import {
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
  Search,
  Copy,
  MoreVertical,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { ResetPasswordButton } from "@/components/admin/ResetPasswordButton";
import { User } from "../types";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!", {
      icon: <CheckCircle2 className="text-green-600" size={18} />,
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center flex flex-col items-center justify-center transition-colors animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-full mb-4">
          <Search size={40} className="text-gray-300 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Nenhum usuário encontrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Tente ajustar os termos da busca ou os filtros aplicados.
        </p>
      </div>
    );
  }

  // Helper para Badges de Cargo
  const RoleBadge = ({ role }: { role: string }) => {
    const isAdmin = role === "ADMIN";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
          isAdmin
            ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
            : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
        }`}
      >
        {isAdmin ? (
          <Shield size={12} className="fill-current opacity-25" />
        ) : (
          <UserIcon size={12} />
        )}
        {isAdmin ? "ADMINISTRADOR" : "CORRETOR"}
      </span>
    );
  };

  // Helper para Avatar
  const UserAvatar = ({ name }: { name: string }) => (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
      {name.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <>
      {/* --- VISÃO MOBILE (CARDS) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <UserAvatar name={user.name} />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white leading-tight">
                    {user.name}
                  </h4>
                  <RoleBadge role={user.role} />
                </div>
              </div>
              {/* Menu de Ações Mobile Simplificado */}
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                >
                  <Edit size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg break-all">
                <Mail size={14} className="text-gray-400 flex-shrink-0" />
                {user.email}
              </div>
              {user.creci && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    CRECI
                  </span>
                  {user.creci}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center gap-2">
              <ResetPasswordButton userId={user.id} userName={user.name} />
              <button
                onClick={() => onDelete(user.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ml-auto"
              >
                <Trash2 size={16} /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- VISÃO DESKTOP (TABELA) --- */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-gray-700/20 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="p-5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  Usuário
                </th>
                <th className="p-5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  Contato
                </th>
                <th className="p-5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  Documento
                </th>
                <th className="p-5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  Cargo
                </th>
                <th className="p-5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <UserAvatar name={user.name} />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <button
                      onClick={() => copyToClipboard(user.email)}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group/copy"
                      title="Copiar Email"
                    >
                      {user.email}
                      <Copy
                        size={12}
                        className="opacity-0 group-hover/copy:opacity-100 transition-opacity"
                      />
                    </button>
                  </td>
                  <td className="p-5">
                    {user.creci ? (
                      <span className="font-mono text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {user.creci}
                      </span>
                    ) : (
                      <span className="text-gray-300 dark:text-gray-600">
                        -
                      </span>
                    )}
                  </td>
                  <td className="p-5">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <ResetPasswordButton
                        userId={user.id}
                        userName={user.name}
                      />

                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2"></div>

                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(user.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

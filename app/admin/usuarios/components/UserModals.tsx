"use client";

import { useState, useEffect } from "react";
import {
  UserPlus,
  Edit,
  X,
  UserCircle,
  Mail,
  FileText,
  Loader2,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { User, CreateUserData } from "../types";

// Componente de Input Reutilizável para consistência visual
const InputGroup = ({
  label,
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: any;
}) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative group">
      <Icon
        className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors"
        size={18}
      />
      <input
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
        {...props}
      />
    </div>
  </div>
);

// --- CREATE MODAL ---

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserData) => Promise<void>;
  isSaving: boolean;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    role: "FUNCIONARIO",
    creci: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop com Blur */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gray-50/80 dark:bg-gray-900/50 p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <UserPlus size={20} />
              </div>
              Criar Conta
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">
              Adicionar novo membro à equipe.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="p-6 space-y-5"
        >
          <InputGroup
            label="Nome Completo"
            icon={UserCircle}
            placeholder="Ex: Ana Silva"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <InputGroup
            label="Email Corporativo"
            icon={Mail}
            type="email"
            placeholder="ana@imobiliaria.com"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-5">
            <InputGroup
              label="CRECI (Opcional)"
              icon={FileText}
              placeholder="12345-F"
              value={formData.creci}
              onChange={(e) =>
                setFormData({ ...formData, creci: e.target.value })
              }
            />

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">
                Cargo
              </label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="FUNCIONARIO">Corretor</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Criando...
                </>
              ) : (
                "Confirmar Criação"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- EDIT MODAL ---

interface EditUserModalProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (user: User) => Promise<void>;
  isSaving: boolean;
}

export function EditUserModal({
  user,
  onClose,
  onSubmit,
  isSaving,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  if (!user || !formData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
        <div className="bg-gray-50/80 dark:bg-gray-900/50 p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Edit size={20} />
              </div>
              Editar Usuário
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">
              Atualizar informações cadastrais.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="p-6 space-y-5"
        >
          <InputGroup
            label="Nome"
            icon={UserCircle}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <InputGroup
            label="Email"
            icon={Mail}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-5">
            <InputGroup
              label="CRECI"
              icon={FileText}
              value={formData.creci || ""}
              onChange={(e) =>
                setFormData({ ...formData, creci: e.target.value })
              }
            />
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">
                Cargo
              </label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="FUNCIONARIO">Corretor</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- DELETE MODAL ---

interface DeleteUserModalProps {
  user: User | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteUserModal({
  user,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteUserModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Excluir Usuário?
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Você está prestes a remover <strong>{user.name}</strong> do sistema.{" "}
            <br />
            Essa ação não pode ser desfeita e o usuário perderá o acesso
            imediatamente.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Excluindo...
                </>
              ) : (
                "Sim, Excluir"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

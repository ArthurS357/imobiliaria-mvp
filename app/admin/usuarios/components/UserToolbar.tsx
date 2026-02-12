"use client";

import { Search, Filter, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UserToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  totalUsers: number;
  onOpenCreateModal: () => void;
}

export function UserToolbar({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  totalUsers,
  onOpenCreateModal,
}: UserToolbarProps) {
  return (
    <>
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Gestão de Contas
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gerencie corretores e administradores do sistema.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 flex items-center gap-2 font-medium px-4 py-2 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
          >
            <ArrowLeft size={18} /> Voltar
          </Link>
          <button
            onClick={onOpenCreateModal}
            className="bg-blue-900 dark:bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-800 dark:hover:bg-blue-600 transition flex items-center gap-2 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <UserPlus size={18} /> Novo Usuário
          </button>
        </div>
      </div>

      {/* BARRA DE FERRAMENTAS */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center transition-colors">
        {/* Busca */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, email ou CRECI..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Filtros e Contador - Versão Melhorada */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          {/* Componente de Filtro Estilizado */}
          <div className="relative inline-flex items-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors duration-200 p-1 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md">
            <div className="flex items-center pl-2 pr-1">
              <Filter size={16} className="text-blue-500 dark:text-blue-400" />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-0 cursor-pointer py-1 pr-8 appearance-none outline-none"
            >
              <option value="TODOS">Todos os cargos</option>
              <option value="ADMIN">Administradores</option>
              <option value="FUNCIONARIO">Corretores</option>
            </select>
            {/* Ícone de seta dropdown */}
            <div className="absolute right-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Contador com Badge Estilizada */}
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
              Total
            </span>
            <span className="ml-2 text-sm font-bold text-blue-900 dark:text-blue-100">
              {totalUsers}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

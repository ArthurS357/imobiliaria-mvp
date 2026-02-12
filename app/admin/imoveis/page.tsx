"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus, Search, MapPin, Edit, Eye, Printer, X,
  Bed, Car, Ruler, Star, ArrowLeft, ChevronLeft, ChevronRight
} from "lucide-react";
import { DeletePropertyButton } from "@/components/admin/DeletePropertyButton";
import { CopySalesTextButton } from "@/components/admin/CopySalesTextButton";
import { toast, Toaster } from "react-hot-toast";

// ============================================================================
// INTERFACE
// ============================================================================
interface Property {
  id: string;
  titulo: string;
  preco: number;
  precoLocacao?: number;
  tipoValor?: string;
  cidade: string;
  bairro: string;
  status: string;
  destaque: boolean;
  fotos: string | null;
  quarto: number;
  suites: number;
  banheiro: number;
  garagem: number;
  area: number;
  finalidade: string;
  corretor: {
    name: string;
    creci: string | null;
  };
  vagasCobertas?: number;
  vagasDescobertas?: number;
  condicaoImovel?: string;
}

// ============================================================================
// HELPERS & CONSTANTS
// ============================================================================
const ITEMS_PER_PAGE = 20;

const formatMoney = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

// ============================================================================
// COMPONENTE DE LINHA (Memoizado)
// ============================================================================
const PropertyRow = React.memo(({ property }: { property: Property }) => {
  const isDual = (property.finalidade?.includes("Venda") && property.finalidade?.includes("Locação")) ||
    ((property.precoLocacao || 0) > 0 && property.preco > 0);

  // Determina se é locação pura (para definir cor Laranja) ou Venda (Azul)
  const isRentOnly = property.finalidade?.includes("Locação") && !isDual;

  // Pré-processamento da imagem (pega a primeira ou null)
  const coverImage = property.fotos ? property.fotos.split(";")[0] : null;

  return (
    <tr className={`
      transition-colors group border-b border-gray-100 dark:border-gray-700
      ${property.destaque ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : 'bg-white dark:bg-gray-800'}
      hover:bg-gray-50 dark:hover:bg-gray-700/80
    `}>
      {/* Coluna 1: Foto e Detalhes (Aumentado espaçamento p-6) */}
      <td className="p-6 align-top">
        <div className="flex items-start gap-5">
          <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600 relative">
            {coverImage ? (
              <img
                src={coverImage}
                alt={property.titulo}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-[10px] font-bold uppercase">
                Sem foto
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              {property.destaque && <Star size={16} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />}
              <p className="font-bold text-gray-800 dark:text-gray-100 truncate text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={property.titulo}>
                {property.titulo}
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3 truncate">
              <MapPin size={14} /> {property.bairro}, {property.cidade}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1.5" title="Quartos"><Bed size={16} className="text-blue-500" /> {property.quarto}</span>
              <span className="flex items-center gap-1.5" title="Vagas"><Car size={16} className="text-blue-500" /> {property.garagem}</span>
              <span className="flex items-center gap-1.5" title="Área"><Ruler size={16} className="text-blue-500" /> {property.area}m²</span>
            </div>
          </div>
        </div>
      </td>

      {/* Coluna 2: Preço (Ajuste de cores: Venda=Azul, Locação=Laranja) */}
      <td className="p-6 align-top pt-7">
        {isDual ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-0.5 rounded">VEN</span>
              <span className="text-base font-bold text-blue-700 dark:text-blue-300">{formatMoney(property.preco)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-orange-700 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-200 px-2 py-0.5 rounded">LOC</span>
              <span className="text-base font-bold text-orange-700 dark:text-orange-300">{formatMoney(property.precoLocacao || 0)}</span>
            </div>
          </div>
        ) : (
          <div>
            <div className={`text-lg font-bold ${isRentOnly ? 'text-orange-600 dark:text-orange-400' : 'text-blue-700 dark:text-blue-400'}`}>
              {formatMoney(property.preco)}
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border inline-block mt-1 
              ${isRentOnly
                ? 'text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800'
                : 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
              }
            `}>
              {property.finalidade}
            </span>
          </div>
        )}
      </td>

      {/* Coluna 3: Status */}
      <td className="p-6 align-top pt-7">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide border inline-block
          ${property.status === 'DISPONIVEL' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : ''}
          ${property.status === 'PENDENTE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' : ''}
          ${property.status === 'VENDIDO' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' : ''}
          ${property.status === 'RESERVADO' ? 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' : ''}
        `}>
          {property.status}
        </span>
      </td>

      {/* Coluna 4: Corretor */}
      <td className="p-6 align-top pt-7 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center text-xs font-bold border border-blue-200 dark:border-blue-800">
            {property.corretor?.name?.charAt(0) || "?"}
          </div>
          <span className="truncate max-w-[120px] font-medium dark:text-gray-300" title={property.corretor?.name}>
            {property.corretor?.name || "N/A"}
          </span>
        </div>
      </td>

      {/* Coluna 5: Ações */}
      <td className="p-6 align-top pt-6 text-right">
        <div className="flex items-center justify-end gap-2">
          {/* Botão de Visualizar */}
          <Link
            href={`/imoveis/${property.id}`}
            target="_blank"
            className="p-2.5 text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/30 rounded-lg transition"
            title="Ver página pública"
          >
            <Eye size={20} />
          </Link>

          <CopySalesTextButton property={property} />

          <Link
            href={`/imoveis/${property.id}/print`}
            target="_blank"
            className="p-2.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 rounded-lg transition"
            title="Imprimir"
          >
            <Printer size={20} />
          </Link>

          <Link
            href={`/admin/imoveis/editar/${property.id}`}
            className="p-2.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition"
            title="Editar"
          >
            <Edit size={20} />
          </Link>

          <DeletePropertyButton id={property.id} />
        </div>
      </td>
    </tr>
  );
});
PropertyRow.displayName = "PropertyRow";

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reseta para página 1 ao buscar
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Resetar página ao mudar filtro de status
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      // ✅ ATUALIZAÇÃO: Removido parâmetro ?admin=true
      // A API agora filtra automaticamente com base na sessão do usuário
      const res = await fetch("/api/properties");

      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      } else {
        toast.error("Erro ao carregar imóveis.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  // Filtragem
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch =
        property.titulo.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        property.cidade.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        property.bairro.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        property.corretor?.name?.toLowerCase().includes(debouncedSearch.toLowerCase());

      if (statusFilter === "DESTAQUE") {
        return matchesSearch && property.destaque;
      }

      const matchesStatus = statusFilter === "TODOS" || property.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [properties, debouncedSearch, statusFilter]);

  // Paginação Lógica
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

  // Loading Skeleton
  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-[95%] mx-auto space-y-4">
        <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse w-full max-w-md" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <Toaster position="top-right" />
      {/* Container Aumentado (90% da tela) */}
      <div className="max-w-[90%] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciar Imóveis</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Visão geral do portfólio.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2 font-medium transition">
              <ArrowLeft size={18} /> Voltar
            </Link>
            <Link href="/admin/imoveis/novo" className="bg-blue-900 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 transition flex items-center gap-2 font-bold shadow-sm">
              <Plus size={20} /> Novo Imóvel
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por título, cidade, bairro ou corretor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {["TODOS", "DISPONIVEL", "VENDIDO", "PENDENTE", "DESTAQUE"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition border flex items-center gap-1 whitespace-nowrap ${statusFilter === status
                  ? "bg-blue-900 text-white border-blue-900 dark:bg-blue-600 dark:border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                {status === "DESTAQUE" && <Star size={12} className="fill-current" />}
                {status === "TODOS" ? "Todos" : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela Otimizada */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-[500px]">
          {filteredProperties.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-16">
              <Search size={32} className="opacity-40 mb-2" />
              <p>Nenhum imóvel encontrado.</p>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-between items-center">
                <span>Total: {filteredProperties.length} imóveis</span>
                <span>Página {currentPage} de {totalPages}</span>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600 sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th className="p-6 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase w-1/2">Imóvel</th>
                      <th className="p-6 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Valor</th>
                      <th className="p-6 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                      <th className="p-6 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Corretor</th>
                      <th className="p-6 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {paginatedProperties.map((property) => (
                      <PropertyRow key={property.id} property={property} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Controles de Paginação */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-center items-center gap-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
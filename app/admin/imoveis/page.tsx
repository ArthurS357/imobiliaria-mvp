"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, MapPin, Edit, Eye, ArrowLeft, Printer, X } from "lucide-react";
import { DeletePropertyButton } from "@/components/admin/DeletePropertyButton";
import { CopySalesTextButton } from "@/components/admin/CopySalesTextButton";

// CORREÇÃO: Adicionados 'quarto' e 'area' na interface
interface Property {
  id: string;
  titulo: string;
  preco: number;
  cidade: string;
  bairro: string;
  status: string;
  fotos: string | null;
  quarto: number; // <--- Adicionado
  area: number;   // <--- Adicionado
  corretor: {
    name: string;
    creci: string | null;
  };
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties?admin=true");
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Filtragem
  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      property.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.corretor.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "TODOS" || property.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
      Carregando imóveis...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciar Imóveis</h1>
            <p className="text-gray-500 dark:text-gray-400">Visão geral do portfólio.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2 font-medium transition-colors">
              <ArrowLeft size={18} /> Voltar
            </Link>
            <Link href="/admin/imoveis/novo" className="bg-blue-900 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 transition flex items-center gap-2 font-bold shadow-md">
              <Plus size={20} /> Novo Imóvel
            </Link>
          </div>
        </div>

        {/* Barra de Ferramentas (Busca e Filtros) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between transition-colors">

          {/* Campo de Busca */}
          <div className="relative w-full lg:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por título, cidade, bairro ou corretor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filtros de Status */}
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {["TODOS", "DISPONIVEL", "VENDIDO", "PENDENTE"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap border ${statusFilter === status
                    ? "bg-blue-900 text-white border-blue-900 dark:bg-blue-600 dark:border-blue-600"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                {status === "TODOS" ? "Todos" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Imóveis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          {filteredProperties.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-full mb-4">
                <Search size={32} className="opacity-40" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Nenhum imóvel encontrado</h3>
              <p className="text-sm">Tente ajustar os filtros de busca.</p>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {filteredProperties.length} imóveis encontrados
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600">
                    <tr>
                      <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm w-1/3">Imóvel</th>
                      <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Preço</th>
                      <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Status</th>
                      <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Corretor</th>
                      <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition group">

                        {/* Foto e Título */}
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600 relative group-hover:scale-105 transition-transform">
                              {property.fotos ? (
                                <img src={property.fotos.split(";")[0]} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-300 dark:text-gray-500 text-[10px] uppercase font-bold">Sem foto</div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1 text-sm md:text-base">{property.titulo}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin size={12} /> {property.bairro}, {property.cidade}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Preço */}
                        <td className="p-4 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span className={`text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border
                            ${property.status === 'DISPONIVEL' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : ''}
                            ${property.status === 'PENDENTE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' : ''}
                            ${property.status === 'VENDIDO' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' : ''}
                            ${property.status === 'RESERVADO' ? 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' : ''}
                            `}>
                            {property.status}
                          </span>
                        </td>

                        {/* Corretor */}
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold border border-blue-200 dark:border-blue-800">
                              {property.corretor.name.charAt(0)}
                            </div>
                            <div>
                              <span className="block font-medium line-clamp-1">{property.corretor.name}</span>
                              {property.corretor.creci && (
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 block">
                                  CRECI: {property.corretor.creci}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Ações */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* O componente agora receberá o objeto 'property' com todos os campos necessários */}
                            <CopySalesTextButton property={property} />

                            <Link
                              href={`/imoveis/${property.id}/print`}
                              target="_blank"
                              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                              title="Imprimir Ficha (PDF)"
                            >
                              <Printer size={18} />
                            </Link>
                            {property.status === 'DISPONIVEL' && (
                              <Link href={`/imoveis/${property.id}`} target="_blank" className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded" title="Ver Página">
                                <Eye size={18} />
                              </Link>
                            )}
                            <Link href={`/admin/imoveis/editar/${property.id}`} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition" title="Editar">
                              <Edit size={18} />
                            </Link>
                            <DeletePropertyButton id={property.id} />
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
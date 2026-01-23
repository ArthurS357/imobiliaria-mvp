"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, CheckCircle, XCircle, Search, Plus } from "lucide-react";

interface Property {
    id: string;
    titulo: string;
    cidade: string;
    preco: number;
    status: string;
    corretor: { name: string; email: string };
    createdAt: string;
}

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("TODOS"); // TODOS, PENDENTE, DISPONIVEL

    // Função para carregar imóveis
    const fetchProperties = async () => {
        try {
            const res = await fetch("/api/properties"); // Busca todos
            const data = await res.json();
            setProperties(data);
        } catch (error) {
            console.error("Erro ao buscar", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    // Ação: Excluir Imóvel
    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este imóvel?")) return;

        try {
            const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
            if (res.ok) {
                alert("Imóvel excluído!");
                fetchProperties(); // Recarrega lista
            } else {
                const err = await res.json();
                alert(`Erro: ${err.error}`);
            }
        } catch (error) {
            alert("Erro de conexão");
        }
    };

    // Ação: Aprovar Imóvel (Atalho Rápido)
    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: "PUT",
                body: JSON.stringify({ status: "DISPONIVEL" }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                fetchProperties();
            }
        } catch (error) {
            alert("Erro ao aprovar");
        }
    };

    // Filtragem local
    const filteredProperties = properties.filter(p =>
        filter === "TODOS" ? true : p.status === filter
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Gestão de Imóveis</h1>
                        <p className="text-gray-500">Gerencie, aprove ou exclua anúncios do sistema.</p>
                    </div>
                    <Link
                        href="/admin/imoveis/novo"
                        className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 flex items-center gap-2"
                    >
                        <Plus size={18} /> Novo Imóvel
                    </Link>
                </div>

                {/* Barra de Filtros */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex gap-4 overflow-x-auto">
                    <button
                        onClick={() => setFilter("TODOS")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'TODOS' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter("PENDENTE")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${filter === 'PENDENTE' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}
                    >
                        Pendentes
                    </button>
                    <button
                        onClick={() => setFilter("DISPONIVEL")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${filter === 'DISPONIVEL' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                    >
                        Disponíveis
                    </button>
                </div>

                {/* Tabela de Imóveis */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Carregando imóveis...</div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center text-gray-400">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p>Nenhum imóvel encontrado nesta categoria.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Imóvel</th>
                                        <th className="px-6 py-4 font-semibold">Preço</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Corretor</th>
                                        <th className="px-6 py-4 font-semibold text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredProperties.map((property) => (
                                        <tr key={property.id} className="hover:bg-gray-50 transition">

                                            {/* Título e Local */}
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{property.titulo}</div>
                                                <div className="text-gray-500 text-xs">{property.cidade}</div>
                                            </td>

                                            {/* Preço */}
                                            <td className="px-6 py-4 text-gray-700 font-medium">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                                            </td>

                                            {/* Status (Badge) */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${property.status === 'PENDENTE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                          ${property.status === 'DISPONIVEL' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${property.status === 'VENDIDO' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        `}>
                                                    {property.status === 'PENDENTE' && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>}
                                                    {property.status === 'DISPONIVEL' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>}
                                                    {property.status}
                                                </span>
                                            </td>

                                            {/* Corretor */}
                                            <td className="px-6 py-4 text-gray-500">
                                                {property.corretor?.name || "Desconhecido"}
                                            </td>

                                            {/* Botões de Ação */}
                                            <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                {/* Botão Aprovar (Só aparece se Pendente) */}
                                                {property.status === 'PENDENTE' && (
                                                    <button
                                                        onClick={() => handleApprove(property.id)}
                                                        title="Aprovar Imóvel"
                                                        className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}

                                                {/* Editar */}
                                                {/* Nota: Ainda não criamos a pagina de editar, mas o link já fica pronto */}
                                                <Link
                                                    href={`/admin/imoveis/editar/${property.id}`}
                                                    className="p-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </Link>

                                                {/* Excluir */}
                                                <button
                                                    onClick={() => handleDelete(property.id)}
                                                    className="p-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 transition"
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
            </div>
        </div>
    );
}
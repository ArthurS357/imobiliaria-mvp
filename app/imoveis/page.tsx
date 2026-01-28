"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { PROPERTY_TYPES_CATEGORIZED, FINALIDADES } from "@/lib/constants";

// Definição do tipo de propriedade para o card
interface Property {
    id: string;
    titulo: string;
    preco: number;
    cidade: string;
    bairro: string;
    endereco?: string | null;
    quarto: number;
    banheiro: number;
    garagem: number;
    area: number;
    areaTerreno?: number | null;
    fotos: string | null;
    tipo: string;
    status: string;
    finalidade: string;
    displayAddress?: boolean;
}

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Estados dos Filtros
    const [filters, setFilters] = useState({
        finalidade: "",
        tipo: "",
        cidade: "",
        minPrice: "",
        maxPrice: "",
        quartos: "",
        garagem: ""
    });

    // Função de busca com Debounce manual
    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            // Constrói a URL com os parâmetros de busca
            const params = new URLSearchParams();
            // Apenas status DISPONIVEL ou RESERVADO (opcional) para o público
            params.append("status", "DISPONIVEL");

            if (filters.finalidade) params.append("finalidade", filters.finalidade);
            if (filters.tipo) params.append("tipo", filters.tipo);
            if (filters.minPrice) params.append("minPrice", filters.minPrice);
            if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
            if (filters.quartos) params.append("quartos", filters.quartos);
            if (filters.garagem) params.append("garagem", filters.garagem);

            // Nota: A API precisaria suportar filtro por texto (cidade/bairro) se quisermos busca textual exata
            // Por enquanto, faremos a filtragem de texto no front-end se a API não suportar "search query"

            const res = await fetch(`/api/properties?${params.toString()}`);
            if (!res.ok) throw new Error("Falha ao buscar imóveis");

            let data = await res.json();

            // Filtragem Client-Side para Cidade/Bairro (caso a API não tenha busca textual full-text)
            if (filters.cidade) {
                const searchLower = filters.cidade.toLowerCase();
                data = data.filter((p: Property) =>
                    p.cidade.toLowerCase().includes(searchLower) ||
                    p.bairro.toLowerCase().includes(searchLower) ||
                    p.titulo.toLowerCase().includes(searchLower)
                );
            }

            setProperties(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Dispara a busca quando os filtros mudam (com um pequeno delay para não spammar)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProperties();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchProperties]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            finalidade: "",
            tipo: "",
            cidade: "",
            minPrice: "",
            maxPrice: "",
            quartos: "",
            garagem: ""
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Header />

            {/* BARRA DE TÍTULO E BUSCA MOBILE */}
            <div className="bg-blue-900 dark:bg-gray-800 text-white py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Encontre seu Imóvel Ideal</h1>
                    <p className="text-blue-100 dark:text-gray-400 max-w-2xl text-lg">
                        Explore nossa seleção exclusiva de casas, apartamentos e terrenos.
                    </p>

                    {/* Botão de Filtro Mobile */}
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="mt-6 md:hidden flex items-center gap-2 bg-white text-blue-900 px-4 py-2 rounded-lg font-bold w-full justify-center"
                    >
                        <Filter size={20} /> Filtrar Imóveis
                    </button>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* --- SIDEBAR DE FILTROS (Desktop) --- */}
                    <aside className={`md:w-72 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit sticky top-24 
                        ${showMobileFilters ? "fixed inset-0 z-50 w-full h-full overflow-y-auto" : "hidden md:block"}`}>

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                                <Filter size={20} className="text-[#eaca42]" /> Filtros
                            </h2>
                            {showMobileFilters && (
                                <button onClick={() => setShowMobileFilters(false)} className="md:hidden">
                                    <X size={24} className="text-gray-500" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Busca por Texto */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Localização ou Código</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="cidade"
                                        value={filters.cidade}
                                        onChange={handleFilterChange}
                                        placeholder="Cidade, Bairro..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                                </div>
                            </div>

                            {/* Finalidade */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Finalidade</label>
                                <select
                                    name="finalidade"
                                    value={filters.finalidade}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                                >
                                    <option value="">Todos</option>
                                    {FINALIDADES.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tipo de Imóvel */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tipo de Imóvel</label>
                                <select
                                    name="tipo"
                                    value={filters.tipo}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                                >
                                    <option value="">Todos</option>
                                    {PROPERTY_TYPES_CATEGORIZED.map((group) => (
                                        <optgroup key={group.label} label={group.label} className="dark:bg-gray-700">
                                            {group.types.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            {/* Preço */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Faixa de Preço</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                        placeholder="Mín"
                                        className="w-1/2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none text-sm"
                                    />
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                        placeholder="Máx"
                                        className="w-1/2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* Quartos e Vagas */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quartos</label>
                                    <select
                                        name="quartos"
                                        value={filters.quartos}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                                    >
                                        <option value="">Qtd</option>
                                        <option value="1">1+</option>
                                        <option value="2">2+</option>
                                        <option value="3">3+</option>
                                        <option value="4">4+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Vagas</label>
                                    <select
                                        name="garagem"
                                        value={filters.garagem}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                                    >
                                        <option value="">Qtd</option>
                                        <option value="1">1+</option>
                                        <option value="2">2+</option>
                                        <option value="3">3+</option>
                                        <option value="4">4+</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={clearFilters}
                                className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 underline transition"
                            >
                                Limpar Filtros
                            </button>

                            {/* Botão apenas mobile para fechar o modal e ver resultados */}
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="md:hidden w-full bg-blue-900 text-white py-3 rounded-xl font-bold mt-4"
                            >
                                Ver Resultados
                            </button>
                        </div>
                    </aside>

                    {/* --- LISTAGEM DE IMÓVEIS --- */}
                    <div className="flex-grow">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <Loader2 size={40} className="animate-spin mb-4 text-blue-600" />
                                <p>Buscando as melhores opções...</p>
                            </div>
                        ) : properties.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {properties.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Nenhum imóvel encontrado</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Tente ajustar os filtros ou fazer uma nova busca.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-6 px-6 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
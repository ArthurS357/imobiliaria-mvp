"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
// ADICIONADO 'X' NA IMPORTAÇÃO ABAIXO
import { Search, Filter, Loader2, MapPin, Home, Car, BedDouble, X } from "lucide-react";
import { PROPERTY_TYPES_CATEGORIZED, FINALIDADES } from "@/lib/constants";

// Definição do tipo de propriedade
interface Property {
    id: string;
    titulo: string;
    preco: number;
    precoLocacao?: number;
    tipoValor?: string;
    periodoPagamento?: string;
    cidade: string;
    bairro: string;
    endereco?: string | null;
    displayAddress?: boolean;
    quarto: number;
    suites?: number;
    banheiro: number;
    garagem: number;
    area: number;
    areaTerreno?: number | null;
    fotos: string | null;
    tipo: string;
    status: string;
    finalidade: string;
}

function PropertiesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    // Inicializa filtros com dados da URL
    const [filters, setFilters] = useState({
        finalidade: searchParams.get("finalidade") || "",
        tipo: searchParams.get("tipo") || "",
        cidade: searchParams.get("search") || searchParams.get("cidade") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        quartos: searchParams.get("quartos") || "",
        garagem: searchParams.get("garagem") || searchParams.get("vagas") || ""
    });

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("status", "DISPONIVEL");

            if (filters.finalidade && filters.finalidade !== "Todos") params.append("finalidade", filters.finalidade);
            if (filters.tipo && filters.tipo !== "Todos") params.append("tipo", filters.tipo);
            if (filters.minPrice) params.append("minPrice", filters.minPrice);
            if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
            if (filters.quartos) params.append("quartos", filters.quartos);
            if (filters.garagem) params.append("garagem", filters.garagem);

            const res = await fetch(`/api/properties?${params.toString()}`);
            if (!res.ok) throw new Error("Falha ao buscar imóveis");

            let data = await res.json();

            // Filtragem Client-Side de texto
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
            console.error("Erro:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProperties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchClick = () => {
        const params = new URLSearchParams();
        if (filters.cidade) params.set("search", filters.cidade);
        if (filters.finalidade) params.set("finalidade", filters.finalidade);
        if (filters.tipo) params.set("tipo", filters.tipo);
        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        if (filters.quartos) params.set("quartos", filters.quartos);
        if (filters.garagem) params.set("garagem", filters.garagem);

        router.replace(`/imoveis?${params.toString()}`, { scroll: false });
        fetchProperties();
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
        // Opcional: buscar automaticamente ao limpar
        // fetchProperties(); 
    };

    return (
        <div className="flex flex-col gap-8">
            {/* --- BARRA DE FILTROS SUPERIOR (Estilo Homepage) --- */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-white font-bold border-b border-gray-100 dark:border-gray-700 pb-2">
                    <Filter size={20} className="text-[#eaca42]" />
                    <span>Filtrar Imóveis</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

                    {/* 1. Localização */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1 block">Localização</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="cidade"
                                value={filters.cidade}
                                onChange={handleFilterChange}
                                placeholder="Cidade, Bairro ou Código..."
                                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 outline-none transition-all text-sm"
                            />
                            <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                    </div>

                    {/* 2. Tipo de Imóvel */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1 block">Tipo</label>
                        <div className="relative">
                            <select
                                name="tipo"
                                value={filters.tipo}
                                onChange={handleFilterChange}
                                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 outline-none appearance-none text-sm cursor-pointer"
                            >
                                <option value="">Todos os Tipos</option>
                                {PROPERTY_TYPES_CATEGORIZED.map((group) => (
                                    <optgroup key={group.label} label={group.label} className="dark:bg-gray-700 text-black dark:text-white">
                                        {group.types.map(t => <option key={t} value={t}>{t}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                            <Home size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                    </div>

                    {/* 3. Finalidade */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1 block">Finalidade</label>
                        <select
                            name="finalidade"
                            value={filters.finalidade}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 outline-none text-sm cursor-pointer"
                        >
                            <option value="">Todas</option>
                            {FINALIDADES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>

                    {/* 4. Faixa de Preço */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1 block">Preço (R$)</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                placeholder="Mín"
                                className="w-1/2 px-3 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 outline-none text-sm"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder="Máx"
                                className="w-1/2 px-3 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Linha 2 de Filtros */}

                    {/* 5. Quartos */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1 block">Quartos</label>
                        <div className="relative">
                            <select
                                name="quartos"
                                value={filters.quartos}
                                onChange={handleFilterChange}
                                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 outline-none appearance-none text-sm cursor-pointer"
                            >
                                <option value="">Indiferente</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                            </select>
                            <BedDouble size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                    </div>

                    {/* 6. Vagas */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1 block">Vagas</label>
                        <div className="relative">
                            <select
                                name="garagem"
                                value={filters.garagem}
                                onChange={handleFilterChange}
                                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 outline-none appearance-none text-sm cursor-pointer"
                            >
                                <option value="">Indiferente</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                            </select>
                            <Car size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                    </div>

                    {/* Botões de Ação (Buscar / Limpar) */}
                    <div className="col-span-1 sm:col-span-2 flex gap-3">
                        <button
                            onClick={handleSearchClick}
                            className="flex-grow bg-blue-900 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Search size={18} /> <span className="hidden sm:inline">Buscar Imóveis</span> <span className="sm:hidden">Buscar</span>
                        </button>

                        <button
                            onClick={clearFilters}
                            className="px-4 py-3 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 rounded-lg transition-colors font-semibold"
                            title="Limpar Filtros"
                        >
                            <span className="hidden sm:inline">Limpar</span> <X size={20} className="sm:hidden" />
                        </button>
                    </div>

                </div>
            </div>

            {/* --- LISTAGEM DE IMÓVEIS --- */}
            <div className="flex-grow">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Loader2 size={40} className="animate-spin mb-4 text-blue-600" />
                        <p>Buscando imóveis...</p>
                    </div>
                ) : properties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Nenhum imóvel encontrado</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Tente ajustar seus filtros para ver mais resultados.</p>
                        <button onClick={clearFilters} className="mt-6 text-blue-600 font-semibold hover:underline">Limpar todos os filtros</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PropertiesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Header />
            {/* Header da Página */}
            <div className="bg-blue-900 dark:bg-gray-800 text-white py-8 md:py-10 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Encontre seu Imóvel Ideal</h1>
                    <p className="text-blue-100 dark:text-gray-400 max-w-2xl text-lg hidden md:block">
                        Explore nossa seleção exclusiva com os filtros abaixo.
                    </p>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Suspense para carregar parâmetros de URL */}
                <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>}>
                    <PropertiesContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Search, Filter, Loader2, MapPin, Home, Car, BedDouble, X, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
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
    destaque?: boolean;
}

function PropertiesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Inicializa filtros com dados da URL
    const [filters, setFilters] = useState({
        finalidade: searchParams.get("finalidade") || "Todos",
        tipo: searchParams.get("tipo") || "Todos",
        cidade: searchParams.get("search") || searchParams.get("cidade") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        quartos: searchParams.get("quartos") || 0,
        garagem: searchParams.get("vagas") || searchParams.get("garagem") || 0
    });

    // 1. Busca os dados apenas UMA VEZ ao montar o componente
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const res = await fetch(`/api/properties?status=DISPONIVEL`);
                if (!res.ok) throw new Error("Falha ao buscar imóveis");

                const allProperties: Property[] = await res.json();
                setProperties(allProperties);
            } catch (error) {
                console.error("Erro ao carregar imóveis:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // 2. OTIMIZAÇÃO: Filtra os imóveis em memória usando useMemo
    // Isso evita re-renderizações pesadas e lags na interface
    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            // Filtro: Cidade/Bairro (Texto)
            if (filters.cidade) {
                const termo = filters.cidade.toLowerCase();
                const matchTexto = p.cidade.toLowerCase().includes(termo) ||
                    p.bairro.toLowerCase().includes(termo) ||
                    p.titulo.toLowerCase().includes(termo);
                if (!matchTexto) return false;
            }

            // Filtro: Tipo de Imóvel
            if (filters.tipo && filters.tipo !== "Todos") {
                if (p.tipo !== filters.tipo) return false;
            }

            // Filtro: Finalidade (Lógica Complexa de Venda/Locação)
            if (filters.finalidade && filters.finalidade !== "Todos") {
                const termoFinalidade = filters.finalidade.toLowerCase();
                const pFinalidade = p.finalidade ? p.finalidade.toLowerCase() : "";

                if (termoFinalidade === 'venda') {
                    if (!pFinalidade.includes('venda')) return false;
                } else if (termoFinalidade === 'locação' || termoFinalidade === 'locacao') {
                    if (!(pFinalidade.includes('locação') || pFinalidade.includes('locacao'))) return false;
                } else {
                    if (!pFinalidade.includes(termoFinalidade)) return false;
                }
            }

            // Definição do Preço Alvo (Venda ou Locação)
            const targetPrice = (filters.finalidade.includes("Locação") && p.precoLocacao) ? p.precoLocacao : p.preco;

            // Filtro: Preço Mínimo
            if (filters.minPrice && targetPrice < Number(filters.minPrice)) return false;

            // Filtro: Preço Máximo
            if (filters.maxPrice && targetPrice > Number(filters.maxPrice)) return false;

            // Filtro: Quartos
            if (Number(filters.quartos) > 0 && p.quarto < Number(filters.quartos)) return false;

            // Filtro: Vagas
            if (Number(filters.garagem) > 0 && p.garagem < Number(filters.garagem)) return false;

            return true;
        });
    }, [properties, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchClick = () => {
        const params = new URLSearchParams();
        if (filters.cidade) params.set("search", filters.cidade);
        if (filters.finalidade && filters.finalidade !== "Todos") params.set("finalidade", filters.finalidade);
        if (filters.tipo && filters.tipo !== "Todos") params.set("tipo", filters.tipo);
        if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
        if (Number(filters.quartos) > 0) params.set("quartos", filters.quartos.toString());
        if (Number(filters.garagem) > 0) params.set("vagas", filters.garagem.toString());

        router.replace(`/imoveis?${params.toString()}`, { scroll: false });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearchClick();
        }
    };

    const clearFilters = () => {
        setFilters({
            finalidade: "Todos",
            tipo: "Todos",
            cidade: "",
            minPrice: "",
            maxPrice: "",
            quartos: 0,
            garagem: 0
        });
        router.replace("/imoveis");
    };

    return (
        <div className="flex flex-col gap-8">
            {/* --- BARRA DE FILTROS SUPERIOR --- */}
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
                                onKeyDown={handleKeyDown}
                                placeholder="Cidade, Bairro ou Código..."
                                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 outline-none transition-all text-sm"
                            />
                            <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                    </div>

                    {/* 2. Tipo de Imóvel (Categorizado) */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1 block">Tipo</label>
                        <div className="relative">
                            <select
                                name="tipo"
                                value={filters.tipo}
                                onChange={handleFilterChange}
                                className="w-full pl-10 pr-8 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 outline-none appearance-none text-sm cursor-pointer"
                            >
                                <option value="Todos">Todos os Tipos</option>
                                {PROPERTY_TYPES_CATEGORIZED.map((group) => (
                                    <optgroup key={group.label} label={group.label} className="dark:bg-gray-800 text-black dark:text-white font-bold">
                                        {group.types.map(t => <option key={t} value={t} className="font-normal">{t}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                            <Home size={18} className="absolute left-3 top-3.5 text-gray-400" />
                            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* 3. Finalidade */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1 block">Finalidade</label>
                        <div className="relative">
                            <select
                                name="finalidade"
                                value={filters.finalidade}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900 outline-none text-sm cursor-pointer appearance-none"
                            >
                                <option value="Todos">Todas</option>
                                {FINALIDADES.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleSearchClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-md flex-grow"
                        >
                            <Search size={18} />
                            Buscar
                        </button>

                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={`px-3 py-3 rounded-lg font-medium transition flex items-center justify-center gap-1 border ${showAdvanced ? 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                            title="Filtros Avançados"
                        >
                            {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>

                </div>

                {/* FILTROS AVANÇADOS (Expandable) */}
                {showAdvanced && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
                        {/* Preço Mín */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Preço Mín.</label>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="number"
                                    name="minPrice"
                                    placeholder="0"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    onKeyDown={handleKeyDown}
                                    className="w-full pl-8 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Preço Máx */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Preço Máx.</label>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="number"
                                    name="maxPrice"
                                    placeholder="Sem limite"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    onKeyDown={handleKeyDown}
                                    className="w-full pl-8 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Quartos */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Quartos (Mín)</label>
                            <div className="relative">
                                <BedDouble size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                <select
                                    name="quartos"
                                    value={filters.quartos}
                                    onChange={handleFilterChange}
                                    className="w-full pl-9 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none text-sm appearance-none"
                                >
                                    <option value="0">Qualquer</option>
                                    <option value="1">1+</option>
                                    <option value="2">2+</option>
                                    <option value="3">3+</option>
                                    <option value="4">4+</option>
                                </select>
                            </div>
                        </div>

                        {/* Vagas */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Vagas (Mín)</label>
                            <div className="relative">
                                <Car size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                <select
                                    name="garagem"
                                    value={filters.garagem}
                                    onChange={handleFilterChange}
                                    className="w-full pl-9 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none text-sm appearance-none"
                                >
                                    <option value="0">Qualquer</option>
                                    <option value="1">1+</option>
                                    <option value="2">2+</option>
                                    <option value="3">3+</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botão Limpar Filtros (só aparece se houver filtros ativos) */}
                {(filters.cidade || filters.tipo !== 'Todos' || filters.finalidade !== 'Todos' || filters.minPrice || filters.maxPrice || Number(filters.quartos) > 0 || Number(filters.garagem) > 0) && (
                    <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                        <button
                            onClick={clearFilters}
                            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                            <X size={14} /> Limpar Filtros
                        </button>
                    </div>
                )}
            </div>

            {/* --- LISTAGEM DE IMÓVEIS --- */}
            <div className="flex-grow">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Loader2 size={40} className="animate-spin mb-4 text-blue-600" />
                        <p>Buscando imóveis...</p>
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredProperties.map((property) => (
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
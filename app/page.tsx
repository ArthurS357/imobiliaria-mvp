"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Search, Filter, MessageCircle, ArrowRight, ChevronDown, ChevronUp, Bed, Car, DollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FINALIDADES } from "@/lib/constants";

// Interface atualizada
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

export default function Home() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Estados dos Filtros
  const [searchCity, setSearchCity] = useState("");
  const [filterType, setFilterType] = useState("Todos");
  const [filterFinalidade, setFilterFinalidade] = useState("Todos");

  // Novos Filtros Avançados
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minQuartos, setMinQuartos] = useState(0);
  const [minVagas, setMinVagas] = useState(0);

  // FUNÇÃO DE BUSCA E REDIRECIONAMENTO (Leva para a página com todos os imóveis)
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchCity) params.set("search", searchCity);
    if (filterType !== "Todos") params.set("tipo", filterType);
    if (filterFinalidade !== "Todos") params.set("finalidade", filterFinalidade);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minQuartos > 0) params.set("quartos", minQuartos.toString());
    if (minVagas > 0) params.set("vagas", minVagas.toString());

    // Redireciona para a listagem completa
    router.push(`/imoveis?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Busca inicial dos dados
  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties?status=DISPONIVEL");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProperties(data);
          // Inicializa mostrando APENAS os destaques
          setFilteredProperties(data.filter((p: Property) => p.destaque === true));
        }
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // Lógica de "Live Preview" na Home: RESTRITA AOS DESTAQUES
  useEffect(() => {
    // 1. Começa SEMPRE filtrando apenas os DESTAQUES
    // Isso impede que imóveis comuns apareçam na home, mesmo ao digitar
    let result = properties.filter(p => p.destaque === true);

    // 2. Aplica os filtros do usuário DENTRO da lista de destaques
    if (searchCity) {
      const termo = searchCity.toLowerCase();
      result = result.filter((p) =>
        p.cidade.toLowerCase().includes(termo) ||
        p.bairro.toLowerCase().includes(termo) ||
        p.titulo.toLowerCase().includes(termo)
      );
    }

    if (filterType !== "Todos") {
      result = result.filter(p => p.tipo === filterType);
    }

    if (filterFinalidade !== "Todos") {
      result = result.filter(p => p.finalidade.includes(filterFinalidade));
    }

    if (minPrice) {
      const min = Number(minPrice);
      result = result.filter(p => {
        if (filterFinalidade === "Locação" && p.precoLocacao && p.precoLocacao > 0) {
          return p.precoLocacao >= min;
        }
        return p.preco >= min;
      });
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      result = result.filter(p => {
        if (filterFinalidade === "Locação" && p.precoLocacao && p.precoLocacao > 0) {
          return p.precoLocacao <= max;
        }
        return p.preco <= max;
      });
    }

    if (minQuartos > 0) result = result.filter(p => p.quarto >= minQuartos);
    if (minVagas > 0) result = result.filter(p => p.garagem >= minVagas);

    setFilteredProperties(result);
  }, [searchCity, filterType, filterFinalidade, minPrice, maxPrice, minQuartos, minVagas, properties]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-500">
      <Header />

      <div className="relative bg-blue-900 py-32 md:py-48 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Casa moderna"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/80 to-transparent dark:from-gray-900 dark:via-gray-900/80"></div>
        </div>

        <div className="relative z-10 max-w-5xl w-full mx-auto text-center animate-enter">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-800/50 border border-blue-400/30 text-blue-200 text-sm font-semibold mb-6 backdrop-blur-sm">
            Excelência em Mercado Imobiliário
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight drop-shadow-lg">
            Encontre o lugar onde <br className="hidden md:block" />
            sua vida acontece.
          </h1>

          <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md p-2 rounded-xl shadow-2xl max-w-5xl mx-auto border border-white/20 dark:border-white/10 transition-all duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-2 flex flex-col md:flex-row gap-2 transition-colors">

              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition" size={20} />
                <input
                  type="text"
                  placeholder="Qual cidade ou bairro?"
                  className="w-full pl-12 pr-4 py-3 rounded-md bg-transparent focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="hidden md:block w-px bg-gray-200 dark:bg-gray-700 my-2"></div>

              <div className="w-full md:w-40 relative group">
                <div className="absolute left-3 top-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider pointer-events-none">
                  MODO
                </div>
                <select
                  className="w-full pl-3 pr-8 pt-6 pb-1 rounded-md bg-transparent focus:outline-none text-gray-800 dark:text-gray-100 appearance-none cursor-pointer dark:bg-gray-800 font-medium text-sm h-full"
                  value={filterFinalidade}
                  onChange={(e) => setFilterFinalidade(e.target.value)}
                >
                  <option value="Todos">Todos</option>
                  {FINALIDADES.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-4 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="hidden md:block w-px bg-gray-200 dark:bg-gray-700 my-2"></div>

              <div className="w-full md:w-48 relative group">
                <Filter className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition" size={20} />
                <select
                  className="w-full pl-12 pr-4 py-3 rounded-md bg-transparent focus:outline-none text-gray-800 dark:text-gray-100 appearance-none cursor-pointer dark:bg-gray-800"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="Todos">Todos os Tipos</option>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Comercial">Comercial</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={16} />
              </div>

              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-bold transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Search size={18} />
                Buscar
              </button>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`px-4 py-3 rounded-md font-medium transition flex items-center justify-center gap-2 ${showAdvanced ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {showAdvanced && (
              <div className="bg-gray-50 dark:bg-gray-900 mt-2 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-enter border border-gray-200 dark:border-gray-700">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Preço Mín.</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-8 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Preço Máx.</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Sem limite"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-8 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Quartos (Mín)</label>
                  <div className="relative">
                    <Bed size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <select
                      value={minQuartos}
                      onChange={(e) => setMinQuartos(Number(e.target.value))}
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

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Vagas (Mín)</label>
                  <div className="relative">
                    <Car size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <select
                      value={minVagas}
                      onChange={(e) => setMinVagas(Number(e.target.value))}
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
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Destaques Recentes
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-bold">
                {filteredProperties.length}
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              As melhores oportunidades selecionadas para você.
            </p>
          </div>

          <Link href="/imoveis" className="text-blue-900 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 group">
            Ver todos os imóveis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 space-y-4 shadow-sm">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="inline-flex bg-gray-50 dark:bg-gray-700 p-6 rounded-full mb-4">
              <Search size={40} className="text-gray-300 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nenhum imóvel em destaque encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Clique em "Buscar" para ver todas as opções disponíveis.
            </p>
            <button
              onClick={handleSearch}
              className="mt-4 text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Ver todos os imóveis
            </button>
          </div>
        )}
      </main>

      <a
        href="https://wa.me/5511946009103"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-50 flex items-center justify-center hover:shadow-green-500/30"
        title="Falar com Corretor"
      >
        <MessageCircle size={28} />
      </a>

      <Footer />
    </div>
  );
}
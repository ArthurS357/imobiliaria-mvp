"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { PropertyCard } from "@/components/PropertyCard";
import { Search, Filter, MessageCircle } from "lucide-react";

// Tipo para os dados do imóvel
interface Property {
  id: string;
  titulo: string;
  preco: number;
  cidade: string;
  bairro: string;
  quarto: number;
  banheiro: number;
  garagem: number;
  area: number;
  fotos: string;
  tipo: string;
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [searchCity, setSearchCity] = useState("");
  const [filterType, setFilterType] = useState("Todos");

  // 1. Buscar imóveis ao carregar a página
  useEffect(() => {
    async function fetchProperties() {
      try {
        // Busca apenas imóveis DISPONIVEIS (Regra de Negócio)
        const res = await fetch("/api/properties?status=DISPONIVEL");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProperties(data);
          setFilteredProperties(data);
        }
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // 2. Lógica de Filtragem (Executa quando o usuário digita ou troca o tipo)
  useEffect(() => {
    let result = properties;

    // Filtro por Texto (Cidade ou Bairro)
    if (searchCity) {
      const termo = searchCity.toLowerCase();
      result = result.filter(p =>
        p.cidade.toLowerCase().includes(termo) ||
        p.bairro.toLowerCase().includes(termo)
      );
    }

    // Filtro por Tipo (Casa, Apto, etc)
    if (filterType !== "Todos") {
      result = result.filter(p => p.tipo === filterType);
    }

    setFilteredProperties(result);
  }, [searchCity, filterType, properties]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* --- HERO SECTION (Banner de Busca) --- */}
      <div className="bg-blue-900 py-20 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Encontre o imóvel ideal para você
          </h1>

          {/* Barra de Busca e Filtros */}
          <div className="bg-white p-4 rounded-lg shadow-xl flex flex-col md:flex-row gap-4">

            {/* Input de Busca (Cidade/Bairro) */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Busque por cidade ou bairro..."
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-200 focus:border-blue-500 focus:outline-none text-gray-800"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
            </div>

            {/* Select de Tipo */}
            <div className="w-full md:w-48 relative">
              <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-200 focus:border-blue-500 focus:outline-none text-gray-800 appearance-none bg-white"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="Todos">Todos os Tipos</option>
                <option value="Casa">Casas</option>
                <option value="Apartamento">Apartamentos</option>
                <option value="Terreno">Terrenos</option>
                <option value="Comercial">Comercial</option>
              </select>
            </div>

            {/* Botão Visual (Apenas UX, pois o filtro é automático) */}
            <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-md hover:bg-red-700 transition duration-200">
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* --- LISTAGEM DE IMÓVEIS --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Destaques Recentes
          </h2>
          <span className="text-gray-500 text-sm">
            {filteredProperties.length} imóveis encontrados
          </span>
        </div>

        {loading ? (
          // Skeleton Loading (Carregando...)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          // Grid de Cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          // Estado Vazio (Sem resultados)
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="inline-flex bg-gray-100 p-4 rounded-full mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nenhum imóvel encontrado</h3>
            <p className="text-gray-500 mt-2">Tente ajustar seus filtros de busca.</p>
          </div>
        )}
      </main>

      {/* --- BOTÃO FLUTUANTE DE WHATSAPP (Cláusula 2.1) --- */}
      <a
        href="https://wa.me/5511999999999" // Coloque o número real aqui
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-50 flex items-center justify-center"
        title="Falar com Corretor"
      >
        <MessageCircle size={28} />
      </a>

      {/* Footer Simples */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 Imobiliária MVP. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { MapPin, Bed, Bath, Car, Maximize, ArrowRight, Heart, Building2, Ruler } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PropertyProps {
  property: {
    id: string;
    titulo: string;
    preco: number;
    cidade: string;
    bairro: string;
    endereco?: string | null;
    quarto: number;
    suites?: number; // Novo
    banheiro: number;
    garagem: number;
    area: number;
    areaTerreno?: number | null;
    fotos: string | null;
    tipo: string;
    status: string;
    finalidade?: string; // Novo
    tipoValor?: string;  // Novo
    periodoPagamento?: string; // Novo
    displayAddress?: boolean;
  };
}

export function PropertyCard({ property }: PropertyProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Verifica se já é favorito ao carregar
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("mvp_favorites") || "[]");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exists = favorites.some((fav: any) => fav.id === property.id);
    setIsFavorite(exists);
  }, [property.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const favorites = JSON.parse(localStorage.getItem("mvp_favorites") || "[]");

    if (isFavorite) {
      // Remove
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newFavorites = favorites.filter((fav: any) => fav.id !== property.id);
      localStorage.setItem("mvp_favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      // Adiciona
      favorites.push(property);
      localStorage.setItem("mvp_favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  // Trata as fotos
  const primeiraFoto = property.fotos ? property.fotos.split(";")[0] : null;

  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Number(property.preco));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VENDIDO":
        return <span className="bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider shadow-sm">Vendido</span>;
      case "RESERVADO":
        return <span className="bg-yellow-500/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider shadow-sm">Reservado</span>;
      default:
        // Exibe o TIPO do imóvel (Casa, Apto) se estiver Disponível ou Pendente
        return <span className="bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider shadow-sm">{property.tipo}</span>;
    }
  };

  // Lógica de exibição de área: Prioriza Terreno se for significativamente maior que a construída
  const areaDisplay = (property.areaTerreno && property.areaTerreno > property.area)
    ? { value: property.areaTerreno, label: "Terreno" }
    : { value: property.area, label: "Útil" };

  return (
    <Link href={`/imoveis/${property.id}`} className="group block h-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative">

        {/* Imagem */}
        <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
          {primeiraFoto ? (
            <Image
              src={primeiraFoto}
              alt={property.titulo}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800">
              <Building2 size={48} className="mb-2 opacity-20" />
              <span className="text-sm">Sem foto</span>
            </div>
          )}

          {/* Sombra Gradiente na base da foto para destacar preço */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent"></div>

          {/* Badge Superior Esquerdo (Status/Tipo) */}
          <div className="absolute top-4 left-4 z-10">
            {getStatusBadge(property.status)}
          </div>

          {/* Badge Superior Direito (Finalidade) */}
          <div className={`absolute top-4 right-4 z-10 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider shadow-sm 
              ${property.finalidade === 'Locação' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>
            {property.finalidade || "Venda"}
          </div>

          {/* Preço na Imagem (Estilo Moderno) */}
          <div className="absolute bottom-4 left-4 z-10">
            <p className="text-white font-bold text-xl drop-shadow-md flex items-baseline gap-1">
              {precoFormatado}
              {property.finalidade === 'Locação' && property.periodoPagamento && (
                <span className="text-xs font-medium opacity-80">/{property.periodoPagamento}</span>
              )}
            </p>
          </div>

          {/* BOTÃO DE FAVORITAR */}
          {/* Posicionado um pouco abaixo do topo para não conflitar com badge */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-14 right-4 z-20 p-2 rounded-full shadow-lg transition-all duration-300 ${isFavorite
              ? "bg-white text-red-500 scale-110"
              : "bg-black/30 backdrop-blur-md text-white hover:bg-white hover:text-red-500"
              }`}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart size={18} className={isFavorite ? "fill-current" : ""} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-4">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight line-clamp-2 mt-1 group-hover:text-[#eaca42] transition-colors">
              {property.titulo}
            </h3>

            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-3">
              <MapPin size={16} className="flex-shrink-0 text-[#eaca42]" />
              {/* Respeita a privacidade: Se displayAddress for false, esconde a rua */}
              <span className="truncate">
                {property.displayAddress === false
                  ? `${property.cidade} (Bairro sob consulta)`
                  : `${property.bairro}, ${property.cidade}`
                }
              </span>
            </div>
          </div>

          {/* Ícones de Métricas */}
          <div className="grid grid-cols-4 gap-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">

            {/* Quartos */}
            <div className="text-center group/icon">
              <div className="flex justify-center text-gray-400 dark:text-gray-500 mb-1 group-hover/icon:text-blue-600 dark:group-hover/icon:text-blue-400 transition-colors"><Bed size={20} /></div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-bold block">{property.quarto}</span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Dorms</span>
            </div>

            {/* Banheiros / Suítes (Prioriza Suítes se houver) */}
            <div className="text-center border-l border-gray-100 dark:border-gray-700 group/icon">
              <div className="flex justify-center text-gray-400 dark:text-gray-500 mb-1 group-hover/icon:text-blue-600 dark:group-hover/icon:text-blue-400 transition-colors"><Bath size={20} /></div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-bold block">
                {(property.suites || 0) > 0 ? property.suites : property.banheiro}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">
                {(property.suites || 0) > 0 ? "Suítes" : "Ban"}
              </span>
            </div>

            {/* Vagas */}
            <div className="text-center border-l border-gray-100 dark:border-gray-700 group/icon">
              <div className="flex justify-center text-gray-400 dark:text-gray-500 mb-1 group-hover/icon:text-blue-600 dark:group-hover/icon:text-blue-400 transition-colors"><Car size={20} /></div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-bold block">{property.garagem}</span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Vagas</span>
            </div>

            {/* Área */}
            <div className="text-center border-l border-gray-100 dark:border-gray-700 group/icon">
              <div className="flex justify-center text-gray-400 dark:text-gray-500 mb-1 group-hover/icon:text-blue-600 dark:group-hover/icon:text-blue-400 transition-colors">
                {areaDisplay.label === "Terreno" ? <Maximize size={20} /> : <Ruler size={20} />}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-bold block">{areaDisplay.value}</span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">m²</span>
            </div>
          </div>

          {/* Botão Ver Detalhes (Hover Effect) */}
          <div className="mt-0 h-0 overflow-hidden opacity-0 group-hover:h-auto group-hover:mt-5 group-hover:opacity-100 transition-all duration-500 ease-in-out">
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm font-bold text-blue-900 dark:text-blue-400">
              <span>Ver detalhes completos</span>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-full text-blue-600 dark:text-blue-400">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
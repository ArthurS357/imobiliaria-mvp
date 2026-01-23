"use client";

import { useState, useEffect } from "react";
import { MapPin, Bed, Bath, Car, Maximize, ArrowRight, Heart, Building2 } from "lucide-react";
import Link from "next/link";

interface PropertyProps {
  property: {
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
    status: string;
  };
}

export function PropertyCard({ property }: PropertyProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Verifica se já é favorito ao carregar
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("mvp_favorites") || "[]");
    const exists = favorites.some((fav: any) => fav.id === property.id);
    setIsFavorite(exists);
  }, [property.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita abrir o link do card
    e.stopPropagation();

    const favorites = JSON.parse(localStorage.getItem("mvp_favorites") || "[]");

    if (isFavorite) {
      // Remove
      const newFavorites = favorites.filter((fav: any) => fav.id !== property.id);
      localStorage.setItem("mvp_favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      // Adiciona (Salvamos o objeto todo para não precisar buscar na API depois)
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
        return <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider">Vendido</span>;
      case "RESERVADO":
        return <span className="bg-yellow-500 text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider">Reservado</span>;
      default:
        return <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider">{property.tipo}</span>;
    }
  };

  return (
    <Link href={`/imoveis/${property.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">

        {/* Imagem */}
        <div className="relative h-64 overflow-hidden bg-gray-200">
          {primeiraFoto ? (
            <img
              src={primeiraFoto}
              alt={property.titulo}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
              <Building2 size={48} className="mb-2 opacity-20" />
              <span className="text-sm">Sem foto</span>
            </div>
          )}

          {/* Badge Superior Esquerdo */}
          <div className="absolute top-4 left-4 z-10 shadow-sm">
            {getStatusBadge(property.status)}
          </div>

          {/* BOTÃO DE FAVORITAR (NOVO) */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-md transition-all duration-200 ${isFavorite
                ? "bg-white text-red-500 scale-110"
                : "bg-white/80 text-gray-400 hover:bg-white hover:text-red-500"
              }`}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart size={20} className={isFavorite ? "fill-current" : ""} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-4">
            <p className="text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
              {precoFormatado}
            </p>
            <h3 className="text-gray-800 font-medium line-clamp-1 mt-1 group-hover:text-blue-900 transition-colors">
              {property.titulo}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
              <MapPin size={14} className="flex-shrink-0 text-gray-400" />
              <span className="truncate">{property.bairro}, {property.cidade}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 border-t border-gray-50 pt-4 mt-auto">
            <div className="text-center">
              <div className="flex justify-center text-gray-400 mb-1 group-hover:text-blue-600 transition-colors"><Bed size={18} /></div>
              <span className="text-xs text-gray-600 font-medium block">{property.quarto}</span>
              <span className="text-[10px] text-gray-400 uppercase">Quartos</span>
            </div>
            <div className="text-center border-l border-gray-50">
              <div className="flex justify-center text-gray-400 mb-1 group-hover:text-blue-600 transition-colors"><Bath size={18} /></div>
              <span className="text-xs text-gray-600 font-medium block">{property.banheiro}</span>
              <span className="text-[10px] text-gray-400 uppercase">Ban</span>
            </div>
            <div className="text-center border-l border-gray-50">
              <div className="flex justify-center text-gray-400 mb-1 group-hover:text-blue-600 transition-colors"><Car size={18} /></div>
              <span className="text-xs text-gray-600 font-medium block">{property.garagem}</span>
              <span className="text-[10px] text-gray-400 uppercase">Vagas</span>
            </div>
            <div className="text-center border-l border-gray-50">
              <div className="flex justify-center text-gray-400 mb-1 group-hover:text-blue-600 transition-colors"><Maximize size={18} /></div>
              <span className="text-xs text-gray-600 font-medium block">{property.area}</span>
              <span className="text-[10px] text-gray-400 uppercase">m²</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-blue-900 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span>Ver detalhes</span>
            <div className="bg-blue-50 p-1.5 rounded-full">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
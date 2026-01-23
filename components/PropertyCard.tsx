import { MapPin, Bed, Bath, Car, Maximize } from "lucide-react";
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
  };
}

export function PropertyCard({ property }: PropertyProps) {
  // Trata as fotos (String separada por ponto e vírgula no SQLite)
  const primeiraFoto = property.fotos ? property.fotos.split(";")[0] : null;

  // Formata o preço para Real Brasileiro
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(property.preco));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 group">
      {/* Área da Imagem */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        {primeiraFoto ? (
          <img
            src={primeiraFoto}
            alt={property.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem foto
          </div>
        )}
        <div className="absolute top-4 left-4 bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {property.tipo}
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 truncate">{property.titulo}</h3>
        <p className="text-blue-900 font-bold text-xl mt-1">{precoFormatado}</p>

        <div className="flex items-center gap-1 text-gray-500 text-sm mt-2 mb-4">
          <MapPin size={16} />
          <span className="truncate">{property.bairro}, {property.cidade}</span>
        </div>

        {/* Ícones de Características */}
        <div className="flex justify-between border-t pt-4 text-gray-600 text-sm">
          <div className="flex flex-col items-center gap-1">
            <Bed size={18} /> <span className="text-xs">{property.quarto} Quartos</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath size={18} /> <span className="text-xs">{property.banheiro} Ban</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Car size={18} /> <span className="text-xs">{property.garagem} Vagas</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Maximize size={18} /> <span className="text-xs">{property.area} m²</span>
          </div>
        </div>

        {/* Botão de Detalhes (Pode expandir depois) */}
        <button className="w-full mt-4 bg-gray-50 text-blue-900 font-medium py-2 rounded hover:bg-blue-50 transition border border-gray-200">
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}
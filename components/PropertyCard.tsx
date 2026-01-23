import { MapPin, Bed, Bath, Car, Maximize, ArrowRight } from "lucide-react";
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
    status: string; // Adicionado para controlar a cor da tag
  };
}

export function PropertyCard({ property }: PropertyProps) {
  // Trata as fotos
  const primeiraFoto = property.fotos ? property.fotos.split(";")[0] : null;

  // Formata o preço
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0, // Remove centavos para ficar mais limpo (ex: R$ 500.000)
  }).format(Number(property.preco));

  // Lógica de Cores da Tag de Status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VENDIDO":
        return <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider">Vendido</span>;
      case "RESERVADO":
        return <span className="bg-yellow-500 text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider">Reservado</span>;
      default:
        // Se for Disponível, mostramos o TIPO (Casa, Apto) em vez do status "Disponível"
        return <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider">{property.tipo}</span>;
    }
  };

  return (
    <Link href={`/imoveis/${property.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">

        {/* Imagem com Zoom no Hover */}
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

          {/* Badge Superior Esquerdo (Tipo ou Status) */}
          <div className="absolute top-4 left-4 z-10 shadow-sm">
            {getStatusBadge(property.status)}
          </div>

          {/* Máscara escura no hover para destacar texto se quiser (opcional, deixei clean) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>

        {/* Conteúdo */}
        <div className="p-5 flex flex-col flex-1">
          {/* Preço e Título */}
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

          {/* Ícones (Grid) */}
          <div className="grid grid-cols-4 gap-2 border-t border-gray-50 pt-4 mt-auto">
            <div className="text-center">
              <div className="flex justify-center text-gray-400 mb-1 group-hover:text-blue-600 transition-colors">
                <Bed size={18} />
              </div>
              <span className="text-xs text-gray-600 font-medium block">{property.quarto}</span>
              <span className="text-[10px] text-gray-400 uppercase">Quartos</span>
            </div>
            <div className="text-center border-l border-gray-50">
              <div className="flex justify-center text-gray-400 mb-1 group-hover:text-blue-600 transition-colors">
                <Bath size={18} />
              </div>
              <span className="text-xs text-gray-600 font-medium block">{property.banheiro}</span>
              <span className="text-[10px] text-gray-400 uppercase">Ban</span>
            </div>
            <div className="text-center border-l border-gray-50">
              <div className="flex justify-center text-gray-400 mb-1 group-hover:text-blue-600 transition-colors">
                <Car size={18} />
              </div>
              <span className="text-xs text-gray-600 font-medium block">{property.garagem}</span>
              <span className="text-[10px] text-gray-400 uppercase">Vagas</span>
            </div>
            <div className="text-center border-l border-gray-50">
              <div className="flex justify-center text-gray-400 mb-1 group-hover:text-blue-600 transition-colors">
                <Maximize size={18} />
              </div>
              <span className="text-xs text-gray-600 font-medium block">{property.area}</span>
              <span className="text-[10px] text-gray-400 uppercase">m²</span>
            </div>
          </div>

          {/* Botão Fake (Visual) */}
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
// Importe Building2 caso não tenha importado lá em cima, para o fallback sem foto
import { Building2 } from "lucide-react";
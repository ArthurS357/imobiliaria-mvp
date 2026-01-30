"use client";

import Link from "next/link";
import { MapPin, Bed, Car, Ruler, Bath } from "lucide-react";
import { getWatermarkedImage } from "@/lib/utils";

interface PropertyCardProps {
  property: {
    id: string;
    titulo: string;
    preco: number;
    precoLocacao?: number | null;
    tipoValor?: string | null;
    cidade: string;
    bairro: string;
    tipo: string;
    quarto: number;
    suites?: number | null;
    banheiro: number;
    garagem: number;
    area: number;
    fotos: string | null;
    status: string;
    finalidade?: string | null;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const capaOriginal = property.fotos ? property.fotos.split(";")[0] : null;
  const capa = getWatermarkedImage(capaOriginal);


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  const finalidadeLower = property.finalidade?.toLowerCase() || "";
  const isRent = finalidadeLower.includes("locação") && !finalidadeLower.includes("venda");

  const isDual = (finalidadeLower.includes("venda") && finalidadeLower.includes("locação")) ||
    (Number(property.preco) > 0 && Number(property.precoLocacao) > 0);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">

      {/* --- IMAGEM E BADGES --- */}
      {/* CORREÇÃO: 
         Removido 'h-56' e adicionado 'aspect-[4/3]'.
         Assim o card fica perfeitamente quadrado/retangular na proporção da foto.
      */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <Link href={`/imoveis/${property.id}`}>
          {capa ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={capa}
              alt={property.titulo}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          <span className="bg-blue-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-sm">
            {property.tipo}
          </span>

          {property.status !== 'DISPONIVEL' && (
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-sm text-white
                            ${property.status === 'VENDIDO' ? 'bg-red-600' : 'bg-yellow-500'}
                        `}>
              {property.status}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {isDual ? (
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm">
              Venda & Locação
            </span>
          ) : (
            <span className={`text-white text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm
                            ${isRent ? 'bg-orange-600' : 'bg-green-600'}
                        `}>
              {property.finalidade || "Venda"}
            </span>
          )}
        </div>
      </div>

      {/* --- CONTEÚDO --- */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <Link href={`/imoveis/${property.id}`} className="block">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {property.titulo}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mt-1">
            <MapPin size={14} className="text-[#eaca42]" />
            <span className="truncate">{property.bairro}, {property.cidade}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-5 py-3 border-t border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center text-center">
            <Bed size={18} className="text-blue-900 dark:text-blue-400 mb-1" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{property.quarto}</span>
            <span className="text-[9px] text-gray-400 uppercase">Quartos</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <Bath size={18} className="text-blue-900 dark:text-blue-400 mb-1" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{property.suites || property.banheiro}</span>
            <span className="text-[9px] text-gray-400 uppercase">{property.suites ? "Suítes" : "Banh."}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <Car size={18} className="text-blue-900 dark:text-blue-400 mb-1" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{property.garagem}</span>
            <span className="text-[9px] text-gray-400 uppercase">Vagas</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <Ruler size={18} className="text-blue-900 dark:text-blue-400 mb-1" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{property.area}</span>
            <span className="text-[9px] text-gray-400 uppercase">m²</span>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col gap-1 w-full">
            {isDual ? (
              <>
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1.5 rounded uppercase">Venda</span>
                  <span className="text-lg font-black text-blue-900 dark:text-white">
                    {formatCurrency(property.preco)}
                  </span>
                </div>
                <div className="flex justify-between items-center w-full border-t border-dashed border-gray-200 dark:border-gray-700 pt-1">
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-1.5 rounded uppercase">Locação</span>
                  <span className="text-base font-bold text-gray-600 dark:text-gray-300">
                    {formatCurrency(property.precoLocacao || 0)}
                  </span>
                </div>
              </>
            ) : (
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                  {isRent ? "Valor Mensal" : "Valor de Venda"}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black ${isRent ? 'text-orange-600 dark:text-orange-400' : 'text-blue-900 dark:text-white'}`}>
                    {formatCurrency(property.preco)}
                  </span>
                  {isRent && <span className="text-xs text-gray-500 font-medium">/mês</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700">
          <Link
            href={`/imoveis/${property.id}`}
            className="block w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-center rounded-lg font-bold text-sm transition shadow-lg"
          >
            Ver Detalhes Completos
          </Link>
        </div>

      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PropertyCard } from "@/components/PropertyCard";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import { VisitScheduler } from "@/components/VisitScheduler";
import { MapPin, Bed, Bath, Car, Maximize, ArrowLeft, MessageCircle, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Carregamento dinâmico do Mapa
const MapClient = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 rounded-xl animate-pulse">
            Carregando mapa...
        </div>
    ),
});

interface PropertyClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    property: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    relatedProperties: any[];
}

export function PropertyDetailsClient({ property, relatedProperties }: PropertyClientProps) {
    const router = useRouter();

    const [selectedImage, setSelectedImage] = useState<string>(
        property.fotos ? property.fotos.split(";")[0] : ""
    );

    const fotos = property.fotos ? property.fotos.split(";") : [];
    const mensagemZap = encodeURIComponent(`Olá! Vi o imóvel "${property.titulo}" no site e gostaria de mais informações.`);

    const showMap = property.latitude && property.longitude;

    return (
        <>
            <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition font-medium">
                <ArrowLeft size={20} /> Voltar para busca
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                {/* COLUNA ESQUERDA */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Galeria de Fotos */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="h-96 w-full bg-gray-200 dark:bg-gray-700 relative">
                            {selectedImage ? (
                                <img src={selectedImage} alt={property.titulo} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">Sem foto</div>
                            )}
                            <div className="absolute top-4 left-4 bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wide shadow-sm">
                                {property.tipo}
                            </div>
                        </div>
                        {fotos.length > 1 && (
                            <div className="p-4 flex gap-3 overflow-x-auto bg-white dark:bg-gray-800">
                                {fotos.map((foto: string, index: number) => (
                                    <button key={index} onClick={() => setSelectedImage(foto)} className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${selectedImage === foto ? 'border-blue-900' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                        <img src={foto} alt={`Foto ${index}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detalhes, Descrição e Mapa */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100 dark:border-gray-700">

                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Sobre o imóvel</h2>
                        <div className="prose text-gray-600 dark:text-gray-300 max-w-none whitespace-pre-line leading-relaxed text-justify mb-8">
                            {property.descricao}
                        </div>

                        {/* Características */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-8 mb-8">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Características</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <Bed className="text-blue-900 dark:text-blue-400" size={24} />
                                    <div><span className="block font-bold text-gray-900 dark:text-white">{property.quarto}</span><span className="text-xs">Quartos</span></div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <Bath className="text-blue-900 dark:text-blue-400" size={24} />
                                    <div><span className="block font-bold text-gray-900 dark:text-white">{property.banheiro}</span><span className="text-xs">Banheiros</span></div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <Car className="text-blue-900 dark:text-blue-400" size={24} />
                                    <div><span className="block font-bold text-gray-900 dark:text-white">{property.garagem}</span><span className="text-xs">Vagas</span></div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <Maximize className="text-blue-900 dark:text-blue-400" size={24} />
                                    <div><span className="block font-bold text-gray-900 dark:text-white">{property.area}</span><span className="text-xs">m² Útil</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Mapa */}
                        {showMap && (
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Localização</h3>
                                <div className="flex items-start md:items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                                    <MapPin size={20} className="text-blue-900 dark:text-blue-400 flex-shrink-0 mt-1 md:mt-0" />
                                    <span className="break-words">
                                        {property.endereco ? `${property.endereco} - ` : ""}
                                        {property.bairro}, {property.cidade}
                                    </span>
                                </div>
                                <div className="h-72 md:h-96 w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600">
                                    <MapClient properties={[property]} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* COLUNA DIREITA (Sidebar Fixa) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-2 break-words">{property.titulo}</h1>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                    <MapPin size={16} className="flex-shrink-0" /> <span className="break-words">{property.bairro}, {property.cidade}</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Valor de Venda</p>
                                <p className="text-3xl md:text-4xl font-extrabold text-blue-900 dark:text-blue-400 break-words">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <a href={`https://wa.me/5511946009103?text=${mensagemZap}`} target="_blank" className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transform">
                                    <MessageCircle size={22} /> Chamar no WhatsApp
                                </a>

                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-3">Responsável</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-900 dark:text-blue-200 font-bold flex-shrink-0">
                                            {property.corretor?.name?.charAt(0) || "C"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{property.corretor?.name || "Corretor de Plantão"}</p>
                                            {/* EXIBIÇÃO DINÂMICA DO CRECI */}
                                            {property.corretor?.creci ? (
                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">CRECI: {property.corretor.creci}</p>
                                            ) : (
                                                <p className="text-xs text-gray-400 dark:text-gray-500">CRECI não informado</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 flex items-center gap-2 justify-center">
                                <Calendar size={14} /> Publicado em {new Date(property.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                        </div>

                        <VisitScheduler propertyId={property.id} />
                        <MortgageCalculator propertyPrice={property.preco} />
                    </div>
                </div>
            </div>

            {/* Imóveis Relacionados */}
            {relatedProperties.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-12 mt-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Você também pode gostar</h2>
                        <Link href="/imoveis" className="text-blue-900 dark:text-blue-400 font-bold text-sm hover:underline flex items-center gap-1">
                            Ver todos <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedProperties.map((p) => (
                            <PropertyCard key={p.id} property={p} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
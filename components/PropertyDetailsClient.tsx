"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PropertyCard } from "@/components/PropertyCard";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import { VisitScheduler } from "@/components/VisitScheduler";
import { MapPin, Bed, Bath, Car, Maximize, ArrowLeft, MessageCircle, Calendar, ArrowRight, CheckCircle2, Ruler } from "lucide-react";
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
    // Garante que features seja um array, mesmo se vier null/undefined
    const featuresList = property.features ? property.features.split(",") : [];

    const mensagemZap = encodeURIComponent(`Olá! Vi o imóvel "${property.titulo}" no site e gostaria de mais informações.`);

    // Só mostra o mapa se tiver coordenadas E se a privacidade de endereço permitir
    const showMap = property.latitude && property.longitude && property.displayAddress;

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
                        <div className="h-96 w-full bg-gray-200 dark:bg-gray-700 relative group">
                            {selectedImage ? (
                                <img src={selectedImage} alt={property.titulo} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">Sem foto</div>
                            )}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-[#eaca42] text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wide shadow-sm">
                                    {property.tipo}
                                </span>
                                {property.status === 'VENDIDO' && (
                                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wide shadow-sm">
                                        Vendido
                                    </span>
                                )}
                            </div>
                        </div>
                        {fotos.length > 1 && (
                            <div className="p-4 flex gap-3 overflow-x-auto bg-white dark:bg-gray-800 scrollbar-hide">
                                {fotos.map((foto: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(foto)}
                                        className={`w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === foto ? 'border-[#eaca42] opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={foto} alt={`Foto ${index}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Container Principal de Informações */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100 dark:border-gray-700">

                        {/* 1. RESUMO (Características Principais) */}
                        {property.displayDetails && (
                            <div className="border-b border-gray-100 dark:border-gray-700 pb-8 mb-8">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Resumo</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl text-center">
                                        <Bed className="text-blue-900 dark:text-blue-400" size={28} />
                                        <div><span className="block font-bold text-xl text-gray-900 dark:text-white">{property.quarto}</span><span className="text-xs uppercase font-semibold text-gray-500">Quartos</span></div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl text-center">
                                        <Bath className="text-blue-900 dark:text-blue-400" size={28} />
                                        <div><span className="block font-bold text-xl text-gray-900 dark:text-white">{property.banheiro}</span><span className="text-xs uppercase font-semibold text-gray-500">Banheiros</span></div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl text-center">
                                        <Car className="text-blue-900 dark:text-blue-400" size={28} />
                                        <div><span className="block font-bold text-xl text-gray-900 dark:text-white">{property.garagem}</span><span className="text-xs uppercase font-semibold text-gray-500">Vagas</span></div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl text-center">
                                        <Ruler className="text-blue-900 dark:text-blue-400" size={28} />
                                        <div><span className="block font-bold text-xl text-gray-900 dark:text-white">{property.area}</span><span className="text-xs uppercase font-semibold text-gray-500">m² Útil</span></div>
                                    </div>

                                    {/* Exibe Área do Terreno se existir */}
                                    {(property.areaTerreno > 0) && (
                                        <div className="col-span-2 md:col-span-4 flex items-center justify-center gap-3 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30 mt-2">
                                            <Maximize size={20} className="text-green-600 dark:text-green-400" />
                                            <span className="text-sm font-medium text-green-800 dark:text-green-300">
                                                Área Total do Terreno: <strong>{property.areaTerreno} m²</strong>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 2. COMODIDADES & DIFERENCIAIS (Checklist) */}
                        {featuresList.length > 0 && (
                            <div className="border-b border-gray-100 dark:border-gray-700 pb-8 mb-8">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Comodidades & Diferenciais</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {featuresList.map((item: string, index: number) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                            <CheckCircle2 size={16} className="text-[#eaca42] flex-shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. SOBRE O IMÓVEL (Descrição) */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Sobre o imóvel</h2>

                            {/* EXIBE O TÍTULO PERSONALIZADO SE EXISTIR */}
                            {property.sobreTitulo && (
                                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-400 mb-3 leading-tight">
                                    {property.sobreTitulo}
                                </h3>
                            )}

                            <div className="prose text-gray-600 dark:text-gray-300 max-w-none whitespace-pre-line leading-relaxed text-justify text-lg">
                                {property.descricao}
                            </div>
                        </div>

                        {/* 4. LOCALIZAÇÃO (Mapa) */}
                        {showMap && (
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Localização</h3>
                                <div className="flex items-start md:items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                                    <MapPin size={20} className="text-[#eaca42] flex-shrink-0 mt-1 md:mt-0" />
                                    <span className="break-words font-medium">
                                        {property.endereco} - {property.bairro}, {property.cidade}
                                    </span>
                                </div>
                                <div className="h-80 md:h-96 w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600">
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
                                    <MapPin size={16} className="flex-shrink-0 text-[#eaca42]" />
                                    <span className="break-words">
                                        {property.displayAddress
                                            ? `${property.bairro}, ${property.cidade}`
                                            : `${property.cidade} (Consulte bairro)`
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Valor de Venda</p>
                                <p className="text-3xl md:text-4xl font-extrabold text-blue-900 dark:text-white break-words">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <a href={`https://wa.me/5511946009103?text=${mensagemZap}`} target="_blank" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    <MessageCircle size={22} /> Conversar no WhatsApp
                                </a>

                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mt-6">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-3">Responsável</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-900 dark:text-blue-200 font-bold text-lg flex-shrink-0">
                                            {property.corretor?.name?.charAt(0) || "C"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white text-base truncate">{property.corretor?.name || "Corretor de Plantão"}</p>
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
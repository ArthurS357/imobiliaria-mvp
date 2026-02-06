"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { PropertyCard } from "@/components/PropertyCard";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import { VisitScheduler } from "@/components/VisitScheduler";
import {
    MapPin, Bed, Bath, Car, Maximize, ArrowLeft, Calendar,
    ArrowRight, CheckCircle2, Ruler, Building, Shield, Tag, LockKeyhole,
    ChevronLeft, ChevronRight, Heart
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getWatermarkedImage } from "@/lib/utils";

// ============================================================================
// HELPERS ESTÁTICOS (Evita recriação no render)
// ============================================================================

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(value));

const WhatsAppIcon = memo(({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="currentColor"
        viewBox="0 0 16 16"
        className={className}
        role="img"
        aria-label="WhatsApp Logo"
    >
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
    </svg>
));
WhatsAppIcon.displayName = "WhatsAppIcon";

// Carregamento dinâmico do Mapa
const MapClient = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 rounded-xl animate-pulse">
            Carregando mapa...
        </div>
    ),
});

// ============================================================================
// COMPONENTE: CARD DE INFORMAÇÕES (REUTILIZÁVEL)
// ============================================================================
// Extraído para poder ser renderizado em posições diferentes no mobile/desktop
// ============================================================================

interface InfoCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    property: any;
    isInternal: boolean; // Alterado para aceitar boolean | undefined se necessário, mas aqui forçaremos boolean na chamada
    isDualPurpose: boolean;
    mensagemZap: string;
}

const PropertyInfoCard = memo(({ property, isInternal, isDualPurpose, mensagemZap }: InfoCardProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="mb-6">
                {/* Badge de Finalidade */}
                <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-3 ${property.finalidade?.includes('Locação') && !property.finalidade?.includes('Venda') ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {property.finalidade || 'Venda'}
                </span>

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

            {/* CARD DE VALORES */}
            <div className="mb-6 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">

                {/* TIPO DE VALOR: Apenas Interno */}
                {isInternal && property.tipoValor && (
                    <div className="flex items-center gap-1 mb-3 text-xs font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider border-b border-blue-200 dark:border-blue-700 pb-2">
                        <LockKeyhole size={12} />
                        <span>Interno: {property.tipoValor}</span>
                    </div>
                )}

                {isDualPurpose ? (
                    // MODO DUPLO: Venda e Locação Empilhados
                    <div className="space-y-4">
                        {/* Valor de Venda */}
                        <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-800/50 pb-3">
                            <span className="text-xs font-bold uppercase text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                                Venda
                            </span>
                            <p className="text-2xl font-extrabold text-blue-900 dark:text-white">
                                {formatCurrency(property.preco)}
                            </p>
                        </div>
                        {/* Valor de Locação */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50 px-2 py-1 rounded">
                                Locação
                            </span>
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                    {property.precoLocacao ? formatCurrency(property.precoLocacao) : "Sob Consulta"}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-400">/mês</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    // MODO ÚNICO: Padrão
                    <>
                        {!isInternal && (
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                                Valor
                            </p>
                        )}
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <p className="text-3xl md:text-4xl font-extrabold text-blue-900 dark:text-white break-words">
                                {formatCurrency(property.preco)}
                            </p>
                            {property.finalidade?.includes('Locação') && property.periodoPagamento && (
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/ {property.periodoPagamento}</span>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Taxas Adicionais */}
            {(property.valorCondominio > 0 || (property.depositoSeguranca ?? 0) > 0) && (
                <div className="mb-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg space-y-3">
                    {property.valorCondominio > 0 && (
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Building size={16} />
                                <span>Condomínio <span className="text-xs opacity-70">({property.periodicidadeCondominio})</span></span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(property.valorCondominio)}</span>
                        </div>
                    )}
                    {(property.depositoSeguranca ?? 0) > 0 && (
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Shield size={16} />
                                <span>Depósito Caução</span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(property.depositoSeguranca)}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Botão de Contato */}
            <div className="space-y-4">
                <a href={`https://wa.me/5511946009103?text=${mensagemZap}`} target="_blank" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <WhatsAppIcon size={24} /> Conversar no WhatsApp
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
    );
});
PropertyInfoCard.displayName = "PropertyInfoCard";

// ============================================================================
// COMPONENTE: GALERIA DE IMAGENS (ISOLADO PARA PERFORMANCE)
// ============================================================================

interface GalleryProps {
    fotos: string[];
    titulo: string;
    propertyId: string;
}

const PropertyGallery = memo(({ fotos, titulo, propertyId }: GalleryProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    // Estados para Swipe
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Navegação Otimizada
    const handleNextImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
    }, [fotos.length]);

    const handlePrevImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
    }, [fotos.length]);

    // Handlers de Swipe
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            setCurrentImageIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
        }
        if (isRightSwipe) {
            setCurrentImageIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
        }
    };

    // Imagens Processadas
    const rawImage = fotos[currentImageIndex] || "";
    const displayImage = useMemo(() => getWatermarkedImage(rawImage) || rawImage, [rawImage]);

    // Preload da próxima imagem (para UX instantânea)
    const nextIndex = currentImageIndex === fotos.length - 1 ? 0 : currentImageIndex + 1;
    const nextRawImage = fotos[nextIndex];
    const nextDisplayImage = useMemo(() => getWatermarkedImage(nextRawImage) || nextRawImage, [nextRawImage]);

    // Lógica de Favoritos (Local Storage)
    useEffect(() => {
        try {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            if (favorites.includes(propertyId)) setIsFavorite(true);
        } catch (e) {
            console.error("Erro ao ler favoritos", e);
        }
    }, [propertyId]);

    const toggleFavorite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        let newFavorites;
        if (favorites.includes(propertyId)) {
            newFavorites = favorites.filter((id: string) => id !== propertyId);
            setIsFavorite(false);
        } else {
            newFavorites = [...favorites, propertyId];
            setIsFavorite(true);
        }
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }, [propertyId]);

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 select-none touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* ÁREA DA FOTO PRINCIPAL */}
            <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 relative group">

                {/* Botão Favorito */}
                <button
                    onClick={toggleFavorite}
                    className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 z-30 hover:scale-110
                        ${isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'}
                    `}
                    title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    aria-label="Toggle Favorite"
                >
                    <Heart size={24} className={isFavorite ? "fill-current" : ""} />
                </button>

                {displayImage ? (
                    <>
                        <Image
                            src={displayImage}
                            alt={titulo}
                            fill
                            priority={true} // Prioridade Máxima para LCP
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            className="object-cover transition-transform duration-500"
                        />
                        {/* Truque de Preload: Renderiza a próxima imagem oculta para cachear */}
                        {fotos.length > 1 && (
                            <div className="hidden">
                                <Image src={nextDisplayImage} alt="preload" width={100} height={100} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sem foto</div>
                )}

                {/* Setas de Navegação */}
                {fotos.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20 hidden md:block"
                            aria-label="Imagem Anterior"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20 hidden md:block"
                            aria-label="Próxima Imagem"
                        >
                            <ChevronRight size={32} />
                        </button>

                        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md z-20">
                            {currentImageIndex + 1} / {fotos.length}
                        </div>
                    </>
                )}
            </div>

            {/* Miniaturas (Lazy Load automático pelo Next/Image) */}
            {fotos.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto bg-white dark:bg-gray-800 scrollbar-hide">
                    {fotos.map((foto, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative w-24 aspect-[4/3] flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all 
                                ${currentImageIndex === index ? 'border-[#eaca42] opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}
                            `}
                        >
                            <Image
                                src={getWatermarkedImage(foto) || foto}
                                alt={`Thumb ${index + 1}`}
                                fill
                                sizes="100px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
});
PropertyGallery.displayName = "PropertyGallery";

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

interface PropertyClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    property: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    relatedProperties: any[];
}

export function PropertyDetailsClient({ property, relatedProperties }: PropertyClientProps) {
    const router = useRouter();
    const { data: session } = useSession();

    // Memoização de dados derivados (Evita re-processamento do split no render)
    const fotos = useMemo(() => property.fotos ? property.fotos.split(";") : [], [property.fotos]);
    const featuresList = useMemo(() => property.features ? property.features.split(",") : [], [property.features]);

    // Verificações de permissão e regras de negócio
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session?.user as any)?.role;
    const isInternal = session?.user && ['ADMIN', 'FUNCIONARIO', 'BROKER', 'CORRETOR'].includes(userRole);
    const showMap = property.latitude && property.longitude && property.displayAddress;

    // Lógica para "Venda e Locação"
    const isDualPurpose = useMemo(() => {
        const finalidadeLower = property.finalidade?.toLowerCase() || "";
        return (finalidadeLower.includes("venda") && finalidadeLower.includes("locação")) ||
            (Number(property.preco) > 0 && Number(property.precoLocacao) > 0);
    }, [property.finalidade, property.preco, property.precoLocacao]);

    const mensagemZap = encodeURIComponent(`Olá! Vi o imóvel "${property.titulo}" no site e gostaria de mais informações.`);

    return (
        <>
            <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition font-medium">
                <ArrowLeft size={20} /> Voltar para busca
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                {/* COLUNA ESQUERDA - GALERIA E DETALHES */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Galeria Otimizada Isolada (Com Swipe Mobile) */}
                    <PropertyGallery
                        fotos={fotos}
                        titulo={property.titulo}
                        propertyId={property.id}
                    />

                    {/* MOBILE ONLY: Card de Informações/Valores (Renderizado aqui para ficar abaixo da foto) */}
                    <div className="block lg:hidden">
                        <PropertyInfoCard
                            property={property}
                            isInternal={!!isInternal} // Convert to boolean explicitly
                            isDualPurpose={!!isDualPurpose} // Convert to boolean explicitly
                            mensagemZap={mensagemZap}
                        />
                    </div>

                    {/* Container Principal de Informações */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100 dark:border-gray-700">

                        {/* Badges Informativos */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {property.statusMercado && (
                                <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    <Tag size={14} /> {property.statusMercado}
                                </span>
                            )}
                            {property.condicaoImovel && (
                                <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    <CheckCircle2 size={14} /> {property.condicaoImovel}
                                </span>
                            )}
                            {property.anoConstrucao && (
                                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    <Calendar size={14} /> Ano: {property.anoConstrucao}
                                </span>
                            )}
                        </div>

                        {/* Resumo de Características */}
                        {property.displayDetails && (
                            <div className="border-b border-gray-100 dark:border-gray-700 pb-8 mb-8">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Resumo</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <div className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl text-center">
                                        <Bed className="text-blue-900 dark:text-blue-400" size={24} />
                                        <div>
                                            <span className="block font-bold text-lg text-gray-900 dark:text-white">{property.quarto}</span>
                                            <span className="text-[10px] uppercase font-semibold text-gray-500">Dormitórios</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl text-center">
                                        <Bath className="text-blue-900 dark:text-blue-400" size={24} />
                                        <div>
                                            <span className="block font-bold text-lg text-gray-900 dark:text-white">{property.suites || 0}</span>
                                            <span className="text-[10px] uppercase font-semibold text-gray-500">Suítes</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl text-center relative group">
                                        <Car className="text-blue-900 dark:text-blue-400" size={24} />
                                        <div>
                                            <span className="block font-bold text-lg text-gray-900 dark:text-white">{property.garagem}</span>
                                            <span className="text-[10px] uppercase font-semibold text-gray-500">Vagas</span>
                                        </div>
                                        {(property.vagasCobertas > 0 || property.vagasDescobertas > 0 || property.vagasSubsolo) && (
                                            <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity w-max z-10 pointer-events-none">
                                                {property.vagasCobertas ? `${property.vagasCobertas} Cobertas ` : ''}
                                                {property.vagasDescobertas ? `| ${property.vagasDescobertas} Descobertas ` : ''}
                                                {property.vagasSubsolo ? '| Subsolo' : ''}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl text-center">
                                        <Ruler className="text-blue-900 dark:text-blue-400" size={24} />
                                        <div>
                                            <span className="block font-bold text-lg text-gray-900 dark:text-white">{property.area}</span>
                                            <span className="text-[10px] uppercase font-semibold text-gray-500">m² Útil</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl text-center">
                                        <Maximize className="text-blue-900 dark:text-blue-400" size={24} />
                                        <div>
                                            <span className="block font-bold text-lg text-gray-900 dark:text-white">{property.areaTerreno || "-"}</span>
                                            <span className="text-[10px] uppercase font-semibold text-gray-500">m² Terreno</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sobre o Imóvel */}
                        <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-8">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Sobre o imóvel</h2>
                            {property.sobreTitulo && (
                                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-400 mb-3 leading-tight">
                                    {property.sobreTitulo}
                                </h3>
                            )}
                            <div className="prose text-gray-600 dark:text-gray-300 max-w-none whitespace-pre-line leading-relaxed text-justify text-lg">
                                {property.descricao}
                            </div>
                        </div>

                        {/* Comodidades */}
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

                        {/* Localização no Mapa */}
                        {showMap && (
                            <div className="pt-2">
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

                        {/* DESKTOP ONLY: Card de Informações na Sidebar */}
                        <div className="hidden lg:block">
                            <PropertyInfoCard
                                property={property}
                                isInternal={!!isInternal} // Convert to boolean explicitly
                                isDualPurpose={!!isDualPurpose} // Convert to boolean explicitly
                                mensagemZap={mensagemZap}
                            />
                        </div>

                        {/* Componentes Extras (Sempre na Sidebar/Fundo no mobile) */}
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
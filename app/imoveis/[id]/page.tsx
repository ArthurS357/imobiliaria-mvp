import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Bed, Bath, Car, Maximize, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PropertyDetailsClient } from "@/components/PropertyDetailsClient";
// IMPORTAÇÕES OBRIGATÓRIAS
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapWrapper } from "@/components/MapWrapper"; // <--- Importando o Wrapper

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            corretor: {
                select: { name: true, email: true, id: true }
            }
        }
    });

    if (!property) return notFound();

    // Buscar imóveis relacionados
    const relatedProperties = await prisma.property.findMany({
        where: {
            id: { not: property.id },
            OR: [
                { tipo: property.tipo },
                { bairro: property.bairro }
            ],
            status: "DISPONIVEL"
        },
        take: 3
    });

    const fotos = property.fotos ? property.fotos.split(";") : [];

    return (
        // ESTRUTURA FLEX PARA CORRIGIR POSIÇÃO DO HEADER E FOOTER
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-500 overflow-x-hidden">

            {/* 1. HEADER (Fixo no topo da pilha flex) */}
            <Header />

            {/* 2. CONTEÚDO PRINCIPAL (Expande para empurrar o footer) */}
            <main className="flex-grow w-full relative">

                {/* Botão Voltar (Mobile) */}
                <div className="fixed top-24 left-4 z-30 md:hidden">
                    <Link href="/imoveis" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur p-2 rounded-full shadow-lg text-gray-700 dark:text-gray-200 block">
                        <ArrowLeft size={24} />
                    </Link>
                </div>

                {/* HERO / FOTO DE CAPA */}
                <div className="h-[40vh] md:h-[60vh] bg-gray-200 dark:bg-gray-800 relative w-full">
                    {fotos.length > 0 ? (
                        <img
                            src={fotos[0]}
                            alt={property.titulo}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                            Sem fotos disponíveis
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 text-white z-10">
                        <div className="max-w-7xl mx-auto w-full">
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 inline-block shadow-sm">
                                {property.tipo}
                            </span>
                            <h1 className="text-2xl md:text-5xl font-extrabold mb-2 shadow-sm break-words leading-tight">
                                {property.titulo}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-200 text-sm md:text-lg">
                                <MapPin size={18} className="flex-shrink-0" />
                                <span className="break-words line-clamp-1">{property.bairro}, {property.cidade}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTAINER DE INFORMAÇÕES */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* COLUNA ESQUERDA (Detalhes) */}
                        <div className="lg:col-span-2 space-y-6 md:space-y-8 min-w-0">

                            {/* Cards de Características */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 animate-enter">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
                                    <div className="text-center pt-2 md:pt-0">
                                        <Bed className="mx-auto mb-2 text-blue-600 dark:text-blue-400" size={24} />
                                        <span className="block font-bold text-lg md:text-xl">{property.quarto}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Quartos</span>
                                    </div>
                                    <div className="text-center pt-2 md:pt-0">
                                        <Bath className="mx-auto mb-2 text-blue-600 dark:text-blue-400" size={24} />
                                        <span className="block font-bold text-lg md:text-xl">{property.banheiro}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Banheiros</span>
                                    </div>
                                    <div className="text-center pt-4 md:pt-0 border-t border-gray-100 dark:border-gray-700 md:border-t-0">
                                        <Car className="mx-auto mb-2 text-blue-600 dark:text-blue-400" size={24} />
                                        <span className="block font-bold text-lg md:text-xl">{property.garagem}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Vagas</span>
                                    </div>
                                    <div className="text-center pt-4 md:pt-0 border-t border-gray-100 dark:border-gray-700 md:border-t-0">
                                        <Maximize className="mx-auto mb-2 text-blue-600 dark:text-blue-400" size={24} />
                                        <span className="block font-bold text-lg md:text-xl">{property.area}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">m² Útil</span>
                                    </div>
                                </div>
                            </div>

                            {/* Descrição */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 animate-enter">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sobre o Imóvel</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-justify text-sm md:text-base break-words">
                                    {property.descricao}
                                </p>
                            </div>

                            {/* Mapa (Usando Wrapper) */}
                            {(property.latitude && property.longitude) && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 overflow-hidden h-80 md:h-96 animate-enter">
                                    <MapWrapper properties={[property]} />
                                </div>
                            )}

                        </div>

                        {/* COLUNA DIREITA (Preço e Contato - Sticky) */}
                        <div className="lg:col-span-1 min-w-0">
                            <div className="sticky top-24 space-y-6">

                                {/* Card de Preço */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-enter">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Valor de Venda</p>
                                    <div className="text-3xl md:text-4xl font-extrabold text-blue-900 dark:text-blue-400 mb-6 truncate">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                                    </div>

                                    <PropertyDetailsClient property={property} relatedProperties={relatedProperties} />
                                </div>

                                {/* Card do Corretor */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl flex-shrink-0">
                                        {property.corretor.name.charAt(0)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Imóvel agenciado por</p>
                                        <p className="font-bold text-gray-900 dark:text-white truncate">{property.corretor.name}</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* 3. FOOTER (Fixo no final da pilha flex) */}
            <Footer />
        </div>
    );
}
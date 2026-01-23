"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import { MapPin, Bed, Bath, Car, Maximize, ArrowLeft, MessageCircle, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Property {
    id: string;
    titulo: string;
    descricao: string;
    preco: number;
    cidade: string;
    bairro: string;
    endereco: string;
    quarto: number;
    banheiro: number;
    garagem: number;
    area: number;
    fotos: string;
    tipo: string;
    status: string;
    corretor: { name: string; email: string };
    createdAt: string;
}

export default function PropertyDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const [property, setProperty] = useState<Property | null>(null);
    const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>("");

    useEffect(() => {
        async function fetchData() {
            try {
                if (!params?.id) return;
                const id = params.id as string;

                // 1. Busca o Imóvel Principal
                const res = await fetch(`/api/properties/${id}`);
                if (!res.ok) throw new Error("Falha ao buscar");
                const data = await res.json();

                setProperty(data);
                if (data.fotos) {
                    setSelectedImage(data.fotos.split(";")[0]);
                }

                // 2. Busca os Imóveis Relacionados
                const resRelated = await fetch(`/api/properties/${id}/related`);
                if (resRelated.ok) {
                    const dataRelated = await resRelated.json();
                    setRelatedProperties(dataRelated);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-bold text-gray-700">Imóvel não encontrado</h2>
                <button onClick={() => router.push("/")} className="text-blue-900 underline">Voltar para Home</button>
            </div>
        );
    }

    const fotos = property.fotos ? property.fotos.split(";") : [];
    const mensagemZap = encodeURIComponent(`Olá! Vi o imóvel "${property.titulo}" no site e gostaria de mais informações.`);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
                <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-900 transition font-medium">
                    <ArrowLeft size={20} /> Voltar para busca
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                    {/* COLUNA ESQUERDA: Fotos e Descrição */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Galeria */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="h-96 w-full bg-gray-200 relative">
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
                                <div className="p-4 flex gap-3 overflow-x-auto">
                                    {fotos.map((foto, index) => (
                                        <button key={index} onClick={() => setSelectedImage(foto)} className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${selectedImage === foto ? 'border-blue-900' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                            <img src={foto} alt={`Foto ${index}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detalhes */}
                        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sobre o imóvel</h2>
                            <div className="prose text-gray-600 max-w-none whitespace-pre-line leading-relaxed">
                                {property.descricao}
                            </div>

                            <div className="mt-8 border-t pt-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Características</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <Bed className="text-blue-900" size={24} />
                                        <div><span className="block font-bold text-gray-900">{property.quarto}</span><span className="text-xs">Quartos</span></div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <Bath className="text-blue-900" size={24} />
                                        <div><span className="block font-bold text-gray-900">{property.banheiro}</span><span className="text-xs">Banheiros</span></div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <Car className="text-blue-900" size={24} />
                                        <div><span className="block font-bold text-gray-900">{property.garagem}</span><span className="text-xs">Vagas</span></div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <Maximize className="text-blue-900" size={24} />
                                        <div><span className="block font-bold text-gray-900">{property.area}</span><span className="text-xs">m² Útil</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUNA DIREITA: Container Sticky Unificado */}
                    <div className="lg:col-span-1">

                        {/* AQUI ESTÁ A MUDANÇA: 'sticky' fica no container pai, segurando ambos os elementos */}
                        <div className="sticky top-24 space-y-6">

                            {/* Card de Preço e Contato (Sem sticky individual) */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{property.titulo}</h1>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <MapPin size={16} /> <span>{property.bairro}, {property.cidade}</span>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <p className="text-sm text-gray-500 mb-1">Valor de Venda</p>
                                    <p className="text-4xl font-extrabold text-blue-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <a href={`https://wa.me/5511999999999?text=${mensagemZap}`} target="_blank" className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transform">
                                        <MessageCircle size={22} /> Chamar no WhatsApp
                                    </a>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Responsável</p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold">
                                                {property.corretor?.name?.charAt(0) || "C"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{property.corretor?.name || "Corretor de Plantão"}</p>
                                                <p className="text-xs text-gray-500">CRECI: 12345-F</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t text-xs text-gray-400 flex items-center gap-2 justify-center">
                                    <Calendar size={14} /> Publicado em {new Date(property.createdAt).toLocaleDateString('pt-BR')}
                                </div>
                            </div>

                            {/* Calculadora (Sem sticky individual, rola junto com o card acima) */}
                            <div>
                                <MortgageCalculator propertyPrice={property.preco} />
                            </div>

                        </div>
                    </div>
                </div>

                {/* IMÓVEIS RELACIONADOS */}
                {relatedProperties.length > 0 && (
                    <div className="border-t border-gray-200 pt-12 mt-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Você também pode gostar</h2>
                            <Link href="/imoveis" className="text-blue-900 font-bold text-sm hover:underline flex items-center gap-1">
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

            </main>

            <Footer />
        </div>
    );
}
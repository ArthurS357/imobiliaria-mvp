"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lê do LocalStorage ao carregar a página
        const saved = JSON.parse(localStorage.getItem("mvp_favorites") || "[]");
        setFavorites(saved);
        setLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Heart className="text-red-500 fill-current" size={32} />
                        Meus Favoritos
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Aqui estão os imóveis que você marcou como interesse.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
                {loading ? (
                    <div className="text-center py-12">Carregando...</div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Sua lista está vazia</h2>
                        <p className="text-gray-500 mt-2 mb-8">
                            Você ainda não favoritou nenhum imóvel. Volte para a busca e clique no coração!
                        </p>
                        <Link
                            href="/imoveis"
                            className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition inline-flex items-center gap-2"
                        >
                            Buscar Imóveis <ArrowRight size={20} />
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
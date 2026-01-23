import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

// Importa o Map de forma dinâmica (desativa SSR para evitar erro "window is not defined")
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export const metadata = {
    title: "Mapa de Imóveis | Imobiliária MVP",
};

export default async function MapPage() {
    // Busca apenas imóveis disponíveis e que tenham coordenadas
    const properties = await prisma.property.findMany({
        where: {
            status: "DISPONIVEL",
            NOT: {
                latitude: null,
            }
        },
        select: {
            id: true,
            titulo: true,
            preco: true,
            latitude: true,
            longitude: true,
            fotos: true
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-grow flex flex-col h-[calc(100vh-80px)]">
                <div className="bg-white p-4 shadow-sm z-10 flex justify-between items-center px-8">
                    <h1 className="text-xl font-bold text-gray-800">Explorar no Mapa</h1>
                    <p className="text-sm text-gray-500">{properties.length} imóveis encontrados</p>
                </div>

                <div className="flex-grow p-4">
                    {/* O Mapa ocupa todo o espaço restante */}
                    <div className="h-full w-full shadow-lg border border-gray-200 rounded-xl overflow-hidden">
                        <Map properties={properties as any} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
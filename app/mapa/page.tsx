import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { MapWrapper } from "@/components/MapWrapper"; // Importa o wrapper que já é um Client Component

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
            precoLocacao: true,
            finalidade: true,
            latitude: true,
            longitude: true,
            fotos: true
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header />

            <main className="flex-grow flex flex-col h-[calc(100vh-80px)]">
                <div className="bg-white dark:bg-gray-800 p-4 shadow-sm z-10 flex justify-between items-center px-8 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">Explorar no Mapa</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{properties.length} imóveis encontrados</p>
                </div>

                <div className="flex-grow p-4">
                    {/* O Mapa ocupa todo o espaço restante */}
                    <div className="h-full w-full shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden relative z-0">
                        {/* Passamos os dados para o MapWrapper, que cuidará do carregamento dinâmico no cliente */}
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <MapWrapper properties={properties as any} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
import { MapPin } from "lucide-react";

export default function Loading() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header Skeleton (Simula título da página ou filtros) */}
            <div className="flex flex-col gap-4 mb-8 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 md:w-64"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full max-w-md"></div>
            </div>

            {/* Grid Skeleton (Simula a lista de PropertyCards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
                    >
                        {/* Imagem Placeholder (Aspect Ratio 4/3 igual ao Card real) */}
                        <div className="relative w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 animate-pulse" />

                        {/* Conteúdo Placeholder */}
                        <div className="p-5 space-y-4">

                            {/* Título e Localização */}
                            <div className="space-y-2">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                                </div>
                            </div>

                            {/* Ícones (Quartos, Banheiros, etc) */}
                            <div className="grid grid-cols-4 gap-2 py-2 border-t border-b border-gray-100 dark:border-gray-700">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="flex flex-col items-center gap-1">
                                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        <div className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>

                            {/* Preço e Botão */}
                            <div className="flex items-end justify-between pt-2">
                                <div className="space-y-1 w-1/2">
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                                </div>
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
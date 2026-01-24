"use client";

import dynamic from "next/dynamic";

// Define as interfaces compatíveis com o seu componente Map
interface Property {
    id: string;
    titulo: string;
    preco: number;
    latitude?: number | null;
    longitude?: number | null;
    fotos?: string | null;
}

interface MapWrapperProps {
    properties: Property[];
}

// A importação dinâmica com ssr: false agora vive aqui, num Client Component seguro
const MapClient = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => (
        <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 rounded-2xl animate-pulse">
            Carregando mapa...
        </div>
    ),
});

export function MapWrapper({ properties }: MapWrapperProps) {
    return <MapClient properties={properties} />;
}
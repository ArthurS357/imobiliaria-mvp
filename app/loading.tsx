import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
            <Loader2 className="h-12 w-12 text-blue-900 animate-spin mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Carregando imóveis...</p>
        </div>
    );
}
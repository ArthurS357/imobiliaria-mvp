import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <div className="bg-red-100 p-4 rounded-full text-red-600 mb-6">
                <AlertCircle size={64} />
            </div>
            <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Página não encontrada</h1>
            <p className="text-gray-500 max-w-md mb-8">
                Ops! Parece que o imóvel ou a página que você está procurando não existe ou foi removida.
            </p>

            <Link
                href="/"
                className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
            >
                <Home size={20} />
                Voltar para o Início
            </Link>
        </div>
    );
}
import Link from 'next/link';
import { Menu, User } from 'lucide-react'; // Ícones

export function Header() {
    return (
        <header className="w-full bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo (Texto por enquanto) */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-900">
                            IMOBILIÁRIA<span className="text-red-600">MVP</span>
                        </Link>
                    </div>

                    {/* Menu Desktop */}
                    <nav className="hidden md:flex space-x-8 text-gray-700">
                        <Link href="/imoveis" className="hover:text-blue-600">Comprar</Link>
                        <Link href="/imoveis" className="hover:text-blue-600">Alugar</Link>
                        <Link href="/sobre" className="hover:text-blue-600">Quem Somos</Link>
                        <Link href="/contato" className="hover:text-blue-600">Contato</Link>
                    </nav>

                    {/* Área de Login Administrativo  */}
                    <div className="flex items-center">
                        <Link
                            href="/admin/login"
                            className="flex items-center gap-2 px-4 py-2 border border-blue-900 text-blue-900 rounded hover:bg-blue-50 transition"
                        >
                            <User size={18} />
                            <span className="text-sm font-medium">Área Restrita</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
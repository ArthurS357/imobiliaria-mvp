"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Home, Building2, Phone, Info } from 'lucide-react';

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Função para verificar se o link está ativo
    const isActive = (path: string) => pathname === path;

    // Estilo base para links de navegação
    const navLinkClass = (path: string) => `
    text-sm font-medium transition-colors flex items-center gap-2
    ${isActive(path) ? 'text-blue-900 font-bold' : 'text-gray-600 hover:text-blue-600'}
  `;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* LOGO */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition">
                        <Link href="/" className="text-2xl font-extrabold text-blue-900 tracking-tight flex items-center gap-1">
                            <Building2 className="text-red-600" size={28} />
                            IMOBILIÁRIA<span className="text-red-600">MVP</span>
                        </Link>
                    </div>

                    {/* MENU DESKTOP (Telas Grandes) */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className={navLinkClass("/")}>
                            Home
                        </Link>
                        <Link href="/imoveis" className={navLinkClass("/imoveis")}>
                            Imóveis
                        </Link>
                        <Link href="/sobre" className={navLinkClass("/sobre")}>
                            Quem Somos
                        </Link>
                        <Link href="/contato" className={navLinkClass("/contato")}>
                            Contato
                        </Link>
                    </nav>

                    {/* ÁREA DE LOGIN (Desktop) */}
                    <div className="hidden md:flex items-center">
                        <Link
                            href="/admin/login"
                            className="flex items-center gap-2 px-5 py-2.5 border border-blue-900/20 text-blue-900 rounded-full hover:bg-blue-900 hover:text-white transition-all duration-300 font-medium text-sm group"
                        >
                            <User size={18} className="group-hover:scale-110 transition-transform" />
                            <span>Área Restrita</span>
                        </Link>
                    </div>

                    {/* BOTÃO HAMBURGUER (Mobile) */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-blue-900 focus:outline-none p-2"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MENU MOBILE (Gaveta que abre) */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 animate-fade-in">
                    <div className="px-4 pt-4 pb-6 space-y-3">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive("/") ? 'bg-blue-50 text-blue-900' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-3"><Home size={20} /> Início</div>
                        </Link>

                        <Link
                            href="/imoveis"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive("/imoveis") ? 'bg-blue-50 text-blue-900' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-3"><Building2 size={20} /> Buscar Imóveis</div>
                        </Link>

                        <Link
                            href="/sobre"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive("/sobre") ? 'bg-blue-50 text-blue-900' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-3"><Info size={20} /> Quem Somos</div>
                        </Link>

                        <Link
                            href="/contato"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive("/contato") ? 'bg-blue-50 text-blue-900' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-3"><Phone size={20} /> Fale Conosco</div>
                        </Link>

                        <div className="border-t border-gray-100 pt-3 mt-2">
                            <Link
                                href="/admin/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full text-center px-4 py-3 border border-blue-900 text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition"
                            >
                                Acesso Corretor / Admin
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
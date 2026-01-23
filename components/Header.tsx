"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Home, Building2, Phone, Info } from 'lucide-react';

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    // Estilo base para links Desktop
    const navLinkClass = (path: string) => `
    text-sm font-medium transition-colors flex items-center gap-2
    ${isActive(path) ? 'text-blue-900 font-bold' : 'text-gray-600 hover:text-blue-600'}
  `;

    // Estilo base para links Mobile (Área de toque maior)
    const mobileLinkClass = (path: string) => `
    block px-4 py-4 rounded-lg text-base font-medium transition-colors
    ${isActive(path) ? 'bg-blue-50 text-blue-900' : 'text-gray-600 hover:bg-gray-50'}
  `;

    return (
        <>
            {/* Header Principal */}
            <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">

                        {/* LOGO */}
                        <div className="flex-shrink-0 flex items-center z-50">
                            <Link href="/" className="text-2xl font-extrabold text-blue-900 tracking-tight flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
                                <Building2 className="text-red-600" size={28} />
                                IMOBILIÁRIA<span className="text-red-600">MVP</span>
                            </Link>
                        </div>

                        {/* MENU DESKTOP */}
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className={navLinkClass("/")}>Home</Link>
                            <Link href="/imoveis" className={navLinkClass("/imoveis")}>Imóveis</Link>
                            <Link href="/sobre" className={navLinkClass("/sobre")}>Quem Somos</Link>
                            <Link href="/contato" className={navLinkClass("/contato")}>Contato</Link>
                        </nav>

                        {/* BOTÃO LOGIN DESKTOP */}
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
                        <div className="md:hidden flex items-center z-50">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-700 hover:text-blue-900 p-2 focus:outline-none bg-gray-50 rounded-md"
                                aria-label="Menu Principal"
                            >
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* MENU MOBILE (Full Screen Overlay) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-20 z-40 bg-white/95 backdrop-blur-sm md:hidden overflow-y-auto animate-fade-in border-t border-gray-100 pb-20">
                    <div className="px-4 py-6 space-y-2">

                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/")}>
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-900"><Home size={20} /></div>
                                Início
                            </div>
                        </Link>

                        <Link href="/imoveis" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/imoveis")}>
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-900"><Building2 size={20} /></div>
                                Buscar Imóveis
                            </div>
                        </Link>

                        <Link href="/sobre" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/sobre")}>
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-900"><Info size={20} /></div>
                                Quem Somos
                            </div>
                        </Link>

                        <Link href="/contato" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/contato")}>
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-900"><Phone size={20} /></div>
                                Fale Conosco
                            </div>
                        </Link>

                        <div className="pt-6 mt-6 border-t border-gray-100">
                            <Link
                                href="/admin/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-800 active:scale-95 transition-transform"
                            >
                                <User size={20} />
                                Acesso Corretor / Admin
                            </Link>
                            <p className="text-center text-xs text-gray-400 mt-4">Área exclusiva para funcionários</p>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
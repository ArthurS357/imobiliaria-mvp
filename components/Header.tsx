"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Home, Building2, Phone, Info, Heart } from 'lucide-react';

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    // Link Desktop
    const navLinkClass = (path: string) => `
    text-sm font-medium transition-colors flex items-center gap-2
    ${isActive(path) ? 'text-blue-900 font-bold' : 'text-gray-600 hover:text-blue-600'}
  `;

    // Link Mobile
    const mobileLinkClass = (path: string) => `
    flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-colors
    ${isActive(path) ? 'bg-blue-50 text-blue-900' : 'text-gray-600 hover:bg-gray-50'}
  `;

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">

                        {/* LOGO */}
                        <div className="flex-shrink-0 flex items-center z-50">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>

                                {/* --- CORREÇÃO DE TAMANHO --- */}
                                {/* Removemos o 'relative' e 'fill'. Usamos width/height intrínsecos e CSS para controlar. */}
                                {/* px-3 dá um respiro nas laterais. h-14 define a altura (56px). w-auto deixa esticar. */}
                                <div className="hidden md:flex items-center justify-center bg-blue-900 rounded-lg shadow-sm px-3 py-1">
                                    <Image
                                        src="/logo.png"
                                        alt="Logo Imobiliária"
                                        width={500} // Tamanho base alto para garantir qualidade
                                        height={150}
                                        className="h-14 w-auto object-contain" // h-14 = 56px (Fica grande no header de 80px)
                                        priority
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                parent.classList.remove('bg-blue-900', 'shadow-sm', 'px-3', 'py-1');
                                                parent.innerHTML = '<span class="text-2xl font-extrabold text-blue-900 tracking-tight flex items-center gap-1"><svg class="text-red-600" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg> IMOBILIÁRIA<span class="text-red-600">MVP</span></span>';
                                            }
                                        }}
                                    />
                                </div>

                                {/* Logo Mobile */}
                                <div className="md:hidden relative bg-blue-900 rounded-md p-1 flex items-center justify-center">
                                    <Image
                                        src="/logo.png"
                                        alt="Logo"
                                        width={120}
                                        height={40}
                                        className="h-8 w-auto object-contain"
                                    />
                                </div>
                            </Link>
                        </div>

                        {/* NAV DESKTOP */}
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className={navLinkClass("/")}>Início</Link>
                            <Link href="/imoveis" className={navLinkClass("/imoveis")}>Imóveis</Link>
                            <Link href="/sobre" className={navLinkClass("/sobre")}>Quem Somos</Link>
                            <Link href="/contato" className={navLinkClass("/contato")}>Contato</Link>
                        </nav>

                        {/* AÇÕES DIREITA (Favoritos + Login) */}
                        <div className="hidden md:flex items-center gap-4">

                            {/* Botão de Favoritos */}
                            <Link
                                href="/favoritos"
                                className={`p-2 rounded-full transition hover:bg-red-50 group ${isActive("/favoritos") ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600'}`}
                                title="Meus Favoritos"
                            >
                                <Heart size={24} className={isActive("/favoritos") ? "fill-current" : ""} />
                            </Link>

                            <div className="h-6 w-px bg-gray-200"></div>

                            <Link
                                href="/admin/login"
                                className="flex items-center gap-2 px-5 py-2.5 border border-blue-900/20 text-blue-900 rounded-full hover:bg-blue-900 hover:text-white transition-all duration-300 font-medium text-sm group"
                            >
                                <User size={18} className="group-hover:scale-110 transition-transform" />
                                <span>Área Restrita</span>
                            </Link>
                        </div>

                        {/* BOTÃO MOBILE */}
                        <div className="md:hidden flex items-center z-50">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none"
                            >
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* MENU MOBILE */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-20 z-40 bg-white md:hidden overflow-y-auto animate-fade-in pb-20 border-t border-gray-100">
                    <div className="p-4 space-y-2">

                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/")}>
                            <div className="bg-blue-100 p-2 rounded-full text-blue-900"><Home size={20} /></div>
                            Início
                        </Link>

                        <Link href="/imoveis" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/imoveis")}>
                            <div className="bg-blue-100 p-2 rounded-full text-blue-900"><Building2 size={20} /></div>
                            Buscar Imóveis
                        </Link>

                        <Link href="/favoritos" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/favoritos")}>
                            <div className="bg-red-100 p-2 rounded-full text-red-600"><Heart size={20} /></div>
                            Meus Favoritos
                        </Link>

                        <Link href="/sobre" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/sobre")}>
                            <div className="bg-blue-100 p-2 rounded-full text-blue-900"><Info size={20} /></div>
                            Quem Somos
                        </Link>

                        <Link href="/contato" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/contato")}>
                            <div className="bg-blue-100 p-2 rounded-full text-blue-900"><Phone size={20} /></div>
                            Fale Conosco
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
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
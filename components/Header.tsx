"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Home, Building2, Phone, Info, Heart } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    // Link Desktop (Atualizado para Dark Mode)
    const navLinkClass = (path: string) => `
    text-sm font-medium transition-colors flex items-center gap-2
    ${isActive(path)
            ? 'text-blue-900 dark:text-blue-400 font-bold'
            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}
  `;

    // Link Mobile (Atualizado para Dark Mode)
    const mobileLinkClass = (path: string) => `
    flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-colors
    ${isActive(path)
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}
  `;

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">

                        {/* LOGO */}
                        <div className="flex-shrink-0 flex items-center z-50">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>

                                {/* Logo Desktop */}
                                <div className="hidden md:flex items-center justify-center">
                                    <Image
                                        src="/logo.png"
                                        alt="Logo Imobiliária"
                                        width={500}
                                        height={150}
                                        // AQUI ESTÁ O TRUQUE: 'invert' no modo claro (vira preto), 'dark:invert-0' no modo escuro (fica branco)
                                        className="h-16 w-auto object-contain dark:invert-0 invert transition-all duration-300"
                                        priority
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                parent.innerHTML = '<span class="text-2xl font-extrabold text-blue-900 dark:text-white tracking-tight flex items-center gap-1"><svg class="text-red-600" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg> IMOBILIÁRIA<span class="text-red-600">MVP</span></span>';
                                            }
                                        }}
                                    />
                                </div>

                                {/* Logo Mobile */}
                                <div className="md:hidden relative flex items-center justify-center">
                                    <Image
                                        src="/logo.png"
                                        alt="Logo"
                                        width={120}
                                        height={40}
                                        // MESMA CORREÇÃO AQUI
                                        className="h-10 w-auto object-contain dark:invert-0 invert transition-all duration-300"
                                    />
                                </div>
                            </Link>
                        </div>

                        {/* NAV DESKTOP */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="/" className={navLinkClass('/')}>
                                <Home size={18} /> Início
                            </Link>
                            <Link href="/imoveis" className={navLinkClass('/imoveis')}>
                                <Building2 size={18} /> Imóveis
                            </Link>
                            <Link href="/sobre" className={navLinkClass('/sobre')}>
                                <Info size={18} /> Quem Somos
                            </Link>
                            <Link href="/contato" className={navLinkClass('/contato')}>
                                <Phone size={18} /> Contato
                            </Link>
                        </nav>

                        {/* AÇÕES DIREITA */}
                        <div className="hidden md:flex items-center gap-4">

                            {/* --- Botão de Tema --- */}
                            <ThemeToggle />

                            {/* Botão de Favoritos */}
                            <Link
                                href="/favoritos"
                                className={`p-2 rounded-full transition hover:bg-red-50 dark:hover:bg-red-900/20 group ${isActive("/favoritos") ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-600'}`}
                                title="Meus Favoritos"
                            >
                                <Heart size={24} className={isActive("/favoritos") ? "fill-current" : ""} />
                            </Link>

                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

                            <Link
                                href="/admin/login"
                                className="flex items-center gap-2 px-5 py-2.5 border border-blue-900/20 dark:border-blue-400/20 text-blue-900 dark:text-blue-400 rounded-full hover:bg-blue-900 hover:text-white dark:hover:bg-blue-600 transition-all duration-300 font-medium text-sm group"
                            >
                                <User size={18} className="group-hover:scale-110 transition-transform" />
                                <span>Área Restrita</span>
                            </Link>
                        </div>

                        {/* BOTÃO MENU MOBILE */}
                        <div className="md:hidden flex items-center gap-4 z-50">
                            <ThemeToggle />

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            {/* MENU MOBILE */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-20 z-40 bg-white dark:bg-gray-900 md:hidden overflow-y-auto animate-fade-in pb-20 border-t border-gray-100 dark:border-gray-800">
                    <div className="p-4 space-y-2">

                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/")}>
                            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full text-blue-900 dark:text-blue-400"><Home size={20} /></div>
                            Início
                        </Link>

                        <Link href="/imoveis" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/imoveis")}>
                            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full text-blue-900 dark:text-blue-400"><Building2 size={20} /></div>
                            Buscar Imóveis
                        </Link>

                        <Link href="/favoritos" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/favoritos")}>
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600 dark:text-red-400"><Heart size={20} /></div>
                            Meus Favoritos
                        </Link>

                        <Link href="/sobre" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/sobre")}>
                            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full text-blue-900 dark:text-blue-400"><Info size={20} /></div>
                            Quem Somos
                        </Link>

                        <Link href="/contato" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/contato")}>
                            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full text-blue-900 dark:text-blue-400"><Phone size={20} /></div>
                            Fale Conosco
                        </Link>

                        <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                            <Link
                                href="/admin/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-blue-900 dark:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-800 transition-transform"
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
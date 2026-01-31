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

    const navLinkClass = (path: string) => `
    text-sm font-medium transition-colors flex items-center gap-2
    ${isActive(path)
            ? 'text-blue-400 font-bold'
            : 'text-gray-300 hover:text-blue-400'}
  `;

    const mobileLinkClass = (path: string) => `
    flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-colors
    ${isActive(path)
            ? 'bg-blue-900/30 text-blue-400'
            : 'text-gray-300 hover:bg-gray-800'}
  `;

    // LOGOS DISTINTAS
    const logoDesktopSrc = '/logo.png';
    const logoMobileSrc = '/logo2.png'; // Certifique-se de salvar este arquivo em /public

    return (
        <>
            {/* HEADER CONTAINER */}
            <header className="sticky top-0 z-50 w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm transition-colors duration-300">
                <div className="w-full px-4 sm:px-8 lg:px-12">
                    <div className="flex justify-between items-center h-24 relative">

                        {/* --- LADO ESQUERDO: LOGO --- */}
                        <div className="flex-shrink-0 z-50 flex items-center">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>

                                {/* --- LOGO DESKTOP (Usa a logo original larga) --- */}
                                <div className="hidden md:block">
                                    <Image
                                        src={logoDesktopSrc}
                                        alt="Matiello Imóveis"
                                        width={210}
                                        height={60}
                                        className="object-contain"
                                        priority
                                    />
                                </div>

                                {/* --- LOGO MOBILE (Usa a nova logo2.png) --- */}
                                {/* Container limpo, sem escalas ou margens negativas. 
                                    Ajuste 'w-48' se precisar de mais largura, mas h-16 mantém a altura segura no header. */}
                                <div className="md:hidden relative h-16 w-48 flex items-center">
                                    <Image
                                        src={logoMobileSrc}
                                        alt="Matiello Imóveis"
                                        fill
                                        className="object-contain object-left"
                                        priority
                                        onError={(e) => {
                                            // Fallback caso a logo2.png ainda não exista
                                            e.currentTarget.style.display = 'none';
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                parent.innerHTML = '<span class="text-xl font-bold text-white">MATIELLO<span class="text-[#eaca42]">IMÓVEIS</span></span>';
                                            }
                                        }}
                                    />
                                </div>
                            </Link>
                        </div>

                        {/* --- CENTRO: NAV (Desktop) --- */}
                        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
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

                        {/* --- LADO DIREITO: AÇÕES (Desktop) --- */}
                        <div className="hidden md:flex items-center gap-4 z-50">
                            <ThemeToggle />

                            <Link
                                href="/favoritos"
                                className={`p-2 rounded-full transition hover:bg-red-900/20 group ${isActive("/favoritos") ? 'text-red-600 bg-red-900/20' : 'text-gray-400 hover:text-red-600'}`}
                                title="Meus Favoritos"
                            >
                                <Heart size={24} className={isActive("/favoritos") ? "fill-current" : ""} />
                            </Link>

                            <div className="h-6 w-px bg-gray-700"></div>

                            <Link
                                href="/admin/login"
                                className="flex items-center gap-2 px-5 py-2.5 border border-blue-400/20 text-blue-400 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 font-medium text-sm group"
                            >
                                <User size={18} className="group-hover:scale-110 transition-transform" />
                                <span>Área Restrita</span>
                            </Link>
                        </div>

                        {/* --- BOTÃO MENU MOBILE --- */}
                        <div className="md:hidden flex items-center gap-3 z-50 ml-auto pl-2">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-gray-200 hover:bg-gray-800 rounded-lg focus:outline-none transition-colors"
                                aria-label="Menu"
                            >
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            {/* MENU MOBILE EXPANDIDO */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-20 z-40 bg-gray-900 md:hidden overflow-y-auto animate-fade-in pb-20 border-t border-gray-800">
                    <div className="p-4 space-y-2">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/")}>
                            <div className="bg-blue-900/50 p-2 rounded-full text-blue-400"><Home size={20} /></div>
                            Início
                        </Link>
                        <Link href="/imoveis" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/imoveis")}>
                            <div className="bg-blue-900/50 p-2 rounded-full text-blue-400"><Building2 size={20} /></div>
                            Buscar Imóveis
                        </Link>
                        <Link href="/favoritos" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/favoritos")}>
                            <div className="bg-red-900/30 p-2 rounded-full text-red-400"><Heart size={20} /></div>
                            Meus Favoritos
                        </Link>
                        <Link href="/sobre" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/sobre")}>
                            <div className="bg-blue-900/50 p-2 rounded-full text-blue-400"><Info size={20} /></div>
                            Quem Somos
                        </Link>
                        <Link href="/contato" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/contato")}>
                            <div className="bg-blue-900/50 p-2 rounded-full text-blue-400"><Phone size={20} /></div>
                            Fale Conosco
                        </Link>
                        <div className="pt-6 mt-6 border-t border-gray-800">
                            <Link
                                href="/admin/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-800 transition-transform"
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
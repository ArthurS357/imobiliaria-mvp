import Link from 'next/link';
import { Building2, Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Coluna 1: Sobre */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white font-bold text-xl mb-2">
                            <Building2 className="text-red-600" />
                            IMOBILIÁRIA<span className="text-red-600">MVP</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Conectando pessoas aos seus sonhos há mais de 10 anos. Transparência, segurança e agilidade no mercado imobiliário.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="hover:text-white transition bg-gray-800 p-2 rounded-full hover:bg-blue-600">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="hover:text-white transition bg-gray-800 p-2 rounded-full hover:bg-blue-800">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="hover:text-white transition bg-gray-800 p-2 rounded-full hover:bg-blue-700">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Coluna 2: Links Rápidos */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Navegação</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-white transition hover:translate-x-1 inline-block">Início</Link></li>
                            <li><Link href="/imoveis" className="hover:text-white transition hover:translate-x-1 inline-block">Buscar Imóveis</Link></li>
                            <li><Link href="/sobre" className="hover:text-white transition hover:translate-x-1 inline-block">Quem Somos</Link></li>
                            <li><Link href="/contato" className="hover:text-white transition hover:translate-x-1 inline-block">Fale Conosco</Link></li>
                            <li><Link href="/admin/login" className="hover:text-white transition hover:translate-x-1 inline-block text-blue-400">Área do Corretor</Link></li>
                        </ul>
                    </div>

                    {/* Coluna 3: Imóveis */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Categorias</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/imoveis?tipo=Casa" className="hover:text-white transition">Casas à Venda</Link></li>
                            <li><Link href="/imoveis?tipo=Apartamento" className="hover:text-white transition">Apartamentos</Link></li>
                            <li><Link href="/imoveis?tipo=Terreno" className="hover:text-white transition">Terrenos</Link></li>
                            <li><Link href="/imoveis?tipo=Comercial" className="hover:text-white transition">Pontos Comerciais</Link></li>
                            <li><Link href="/imoveis?destaque=true" className="hover:text-white transition">Oportunidades</Link></li>
                        </ul>
                    </div>

                    {/* Coluna 4: Contato */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Contato</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                                <span>Av. Principal, 1000<br />Centro - São Paulo/SP</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-red-500 flex-shrink-0" />
                                <span>(11) 99999-9999</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-red-500 flex-shrink-0" />
                                <span>contato@imobiliariamvp.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© 2026 Imobiliária MVP. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <span>CRECI: 12345-J</span>
                        <Link href="#" className="hover:text-gray-300">Política de Privacidade</Link>
                        <Link href="#" className="hover:text-gray-300">Termos de Uso</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
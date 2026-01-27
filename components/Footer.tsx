import Link from 'next/link';
import { Building2, Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Grid Principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 text-center md:text-left">

                    {/* Coluna 1: Sobre */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-xl mb-2">
                            {/* Ícone e Texto em Dourado */}
                            <Building2 className="text-[#eaca42]" />
                            MATIELLO<span className="text-[#eaca42]">IMÓVEIS</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto md:mx-0">
                            Conectando pessoas aos seus sonhos há mais de 2 anos. Transparência, segurança e agilidade.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4 pt-2">
                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/matiello_imoveis?igsh=djRmMXh1bmN5ZTBr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-gray-900 transition bg-gray-800 p-2 rounded-full hover:bg-[#eaca42]"
                            >
                                <Instagram size={18} />
                            </a>

                            {/* Facebook Atualizado */}
                            <a
                                href="https://www.facebook.com/profile.php?id=61587020906668&locale=pt_BR"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-gray-900 transition bg-gray-800 p-2 rounded-full hover:bg-[#eaca42]"
                            >
                                <Facebook size={18} />
                            </a>

                            {/* Linkedin */}
                            <a
                                href="#"
                                className="hover:text-gray-900 transition bg-gray-800 p-2 rounded-full hover:bg-[#eaca42]"
                            >
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Coluna 2: Links Rápidos */}
                    <div className="border-t border-gray-800 pt-6 md:border-0 md:pt-0">
                        <h3 className="text-white font-bold mb-4">Navegação</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-[#eaca42] transition">Início</Link></li>
                            <li><Link href="/imoveis" className="hover:text-[#eaca42] transition">Buscar Imóveis</Link></li>
                            <li><Link href="/sobre" className="hover:text-[#eaca42] transition">Quem Somos</Link></li>
                            <li><Link href="/contato" className="hover:text-[#eaca42] transition">Fale Conosco</Link></li>
                            <li><Link href="/admin/login" className="text-blue-400 hover:text-[#eaca42] transition font-medium">Área do Corretor</Link></li>
                        </ul>
                    </div>

                    {/* Coluna 3: Categorias */}
                    <div className="hidden md:block">
                        <h3 className="text-white font-bold mb-4">Categorias</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/imoveis?tipo=Casa" className="hover:text-[#eaca42] transition">Casas à Venda</Link></li>
                            <li><Link href="/imoveis?tipo=Apartamento" className="hover:text-[#eaca42] transition">Apartamentos</Link></li>
                            <li><Link href="/imoveis?tipo=Terreno" className="hover:text-[#eaca42] transition">Terrenos</Link></li>
                            <li><Link href="/imoveis?tipo=Comercial" className="hover:text-[#eaca42] transition">Comercial</Link></li>
                        </ul>
                    </div>

                    {/* Coluna 4: Contato */}
                    <div className="border-t border-gray-800 pt-6 md:border-0 md:pt-0">
                        <h3 className="text-white font-bold mb-4">Contato</h3>
                        <ul className="space-y-4 text-sm flex flex-col items-center md:items-start">
                            <li className="flex items-center gap-3">
                                <MapPin size={18} className="text-[#eaca42] flex-shrink-0" />
                                <span>Arujá - São Paulo</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-[#eaca42] flex-shrink-0" />
                                <span>(11) 94600-9103</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-[#eaca42] flex-shrink-0" />
                                <span>brenomatiello@gmail.com </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Rodapé Inferior */}
                <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 text-center md:text-left">
                    <p>© 2026 Matiello Imóveis. Todos os direitos reservados.</p>
                    <div className="flex gap-4 md:gap-6">
                        <span>CRECI: 299283-F</span>
                        <Link href="#" className="hover:text-gray-300">Privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
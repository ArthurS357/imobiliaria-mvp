import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    CheckCircle,
    Users,
    Award,
    MapPin,
    ArrowRight,
    Search,
    FileText,
    Key,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-300">
            <Header />

            {/* --- HERO SECTION --- */}
            <div className="bg-blue-900 dark:bg-blue-950 text-white py-24 px-4 transition-colors duration-300">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Construindo sonhos, <br />
                        <span className="text-blue-300">concretizando negócios.</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        Há mais de 2 anos conectando pessoas aos seus lares ideais com transparência, agilidade e segurança jurídica.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow w-full">

                {/* --- HISTÓRIA E IMAGEM --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Nossa História
                        </h2>
                        <div className="w-20 h-1.5 bg-red-600 rounded-full"></div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            Fundada com o objetivo de transformar o mercado imobiliário local, a <strong>MATIELLO<span className="text-red-600">IMÓVEIS</span></strong> nasceu da necessidade de um atendimento mais humano e tecnológico.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            Entendemos que comprar ou vender um imóvel não é apenas uma transação financeira, mas um passo importante na vida de cada cliente. Por isso, investimos continuamente em tecnologia e na capacitação da nossa equipe.
                        </p>

                        <div className="pt-4">
                            <Link href="/imoveis" className="inline-flex items-center gap-2 text-blue-900 dark:text-blue-400 font-bold hover:gap-3 transition-all">
                                Ver nossos imóveis disponíveis <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 group">
                        <div className="absolute inset-0 bg-blue-900/10 z-10 transition-opacity group-hover:opacity-0"></div>
                        <Image
                            src="/about-us.png"
                            alt="Equipe Matiello Imóveis"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    </div>
                </div>

                {/* --- DIFERENCIAIS --- */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Por que escolher a MATIELLO?</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                            Nosso compromisso vai além da entrega das chaves.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition hover:-translate-y-1 duration-300">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-900 dark:text-blue-400 mb-6">
                                <CheckCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Transparência Total</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Sem letras miúdas. Apresentamos todas as informações, taxas e condições de forma clara.
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition hover:-translate-y-1 duration-300">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-900 dark:text-blue-400 mb-6">
                                <Award size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Expertise de Mercado</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Nossa equipe conhece cada bairro da cidade, garantindo a avaliação correta.
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition hover:-translate-y-1 duration-300">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-900 dark:text-blue-400 mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Atendimento Único</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Adaptamos nossa busca e negociação para atender às suas necessidades específicas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- LINHA DO TEMPO (PROCESS) --- */}
                <div className="mb-24 bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sua jornada até as chaves</h2>
                        <p className="text-gray-500 mt-2">Como simplificamos o processo para você</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Linha conectora (visível apenas em Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-blue-100 dark:bg-gray-700 -z-10"></div>

                        <div className="text-center group">
                            <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-blue-100 dark:border-gray-700 mb-6 group-hover:border-blue-500 transition-colors">
                                <Search size={32} className="text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">1. Escolha</h3>
                            <p className="text-sm text-gray-500">Selecionamos os melhores imóveis baseados no seu perfil.</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-blue-100 dark:border-gray-700 mb-6 group-hover:border-blue-500 transition-colors">
                                <FileText size={32} className="text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">2. Proposta</h3>
                            <p className="text-sm text-gray-500">Negociamos as condições ideais e revisamos a documentação.</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-blue-100 dark:border-gray-700 mb-6 group-hover:border-blue-500 transition-colors">
                                <CheckCircle size={32} className="text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">3. Aprovação</h3>
                            <p className="text-sm text-gray-500">Cuidamos do financiamento e aprovação jurídica.</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-blue-100 dark:border-gray-700 mb-6 group-hover:border-blue-500 transition-colors">
                                <Key size={32} className="text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">4. Mudança</h3>
                            <p className="text-sm text-gray-500">Entrega das chaves. Bem-vindo ao seu novo lar!</p>
                        </div>
                    </div>
                </div>

                {/* --- CTA PARA PROPRIETÁRIOS --- */}
                {/* Alterado de dark:bg-black para dark:bg-gray-800 para melhorar contraste */}
                <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl overflow-hidden relative mb-24 transition-colors duration-300">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <TrendingUp size={200} className="text-white" />
                    </div>
                    <div className="p-12 md:p-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-left space-y-4 max-w-xl">
                            <h2 className="text-3xl font-bold text-white">Quer vender seu imóvel?</h2>
                            <p className="text-gray-300 text-lg">
                                Avaliamos seu imóvel com precisão de mercado e conectamos você a compradores qualificados. Venda mais rápido com a Matiello.
                            </p>
                        </div>
                        <Link
                            href="/contato"
                            className="whitespace-nowrap bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg shadow-lg transition transform hover:-translate-y-1"
                        >
                            Avaliar meu imóvel
                        </Link>
                    </div>
                </div>

                {/* --- LOCALIZAÇÃO --- */}
                <div className="bg-blue-900 dark:bg-blue-950 rounded-2xl text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl transition-colors">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">Venha tomar um café conosco</h2>
                        <div className="flex items-start gap-3 text-blue-100">
                            <MapPin className="mt-1 flex-shrink-0" />
                            <p className="text-lg">
                                Arujá - São Paulo <br />
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-auto">
                        <a href="https://wa.me/5511946009103" className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-center transition shadow-lg transform hover:-translate-y-1">
                            Falar no WhatsApp
                        </a>
                        <Link href="/contato" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 dark:hover:text-blue-950 text-white font-bold py-4 px-8 rounded-lg text-center transition">
                            Enviar E-mail
                        </Link>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
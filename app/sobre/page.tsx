import { Header } from "@/components/Header";
import { CheckCircle, Users, Award, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* --- HERO SECTION (Banner Institucional) --- */}
            <div className="bg-blue-900 text-white py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Construindo sonhos, <br />
                        <span className="text-blue-300">concretizando negócios.</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        Há mais de 10 anos conectando pessoas aos seus lares ideais com transparência, agilidade e segurança jurídica.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* --- SEÇÃO: NOSSA HISTÓRIA --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Nossa História
                        </h2>
                        <div className="w-20 h-1.5 bg-red-600 rounded-full"></div>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Fundada com o objetivo de transformar o mercado imobiliário local, a <strong>IMOBILIÁRIA<span className="text-red-600">MVP</span></strong> nasceu da necessidade de um atendimento mais humano e tecnológico.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Entendemos que comprar ou vender um imóvel não é apenas uma transação financeira, mas um passo importante na vida de cada cliente. Por isso, investimos continuamente em tecnologia e na capacitação da nossa equipe para oferecer a melhor experiência possível.
                        </p>

                        <div className="pt-4">
                            <Link href="/imoveis" className="inline-flex items-center gap-2 text-blue-900 font-bold hover:gap-3 transition-all">
                                Ver nossos imóveis disponíveis <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Imagem Ilustrativa (Placeholder com fundo cinza/ícone) */}
                    <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden shadow-lg border border-gray-200">
                        <div className="text-center">
                            <Users size={64} className="mx-auto text-gray-300 mb-4" />
                            <span className="text-gray-400 font-medium">Foto da Equipe / Fachada</span>
                        </div>
                        {/* Dica: Depois você pode trocar essa div por uma tag <img src="..." /> real */}
                    </div>
                </div>

                {/* --- SEÇÃO: POR QUE NOS ESCOLHER (Diferenciais) --- */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Por que escolher a MVP?</h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                            Nosso compromisso vai além da entrega das chaves. Oferecemos suporte completo em todas as etapas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-900 mb-6">
                                <CheckCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Transparência Total</h3>
                            <p className="text-gray-600">
                                Sem letras miúdas. Apresentamos todas as informações, taxas e condições de forma clara desde o primeiro contato.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-900 mb-6">
                                <Award size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Expertise de Mercado</h3>
                            <p className="text-gray-600">
                                Nossa equipe conhece cada bairro da cidade, garantindo a avaliação correta e as melhores oportunidades de investimento.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-900 mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Atendimento Personalizado</h3>
                            <p className="text-gray-600">
                                Cada cliente é único. Adaptamos nossa busca e negociação para atender às suas necessidades específicas de vida e orçamento.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- SEÇÃO: LOCALIZAÇÃO E CONTATO --- */}
                <div className="bg-blue-900 rounded-2xl text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">Venha tomar um café conosco</h2>
                        <div className="flex items-start gap-3 text-blue-100">
                            <MapPin className="mt-1 flex-shrink-0" />
                            <p className="text-lg">
                                Av. Principal da Cidade, 1000 - Centro <br />
                                Edifício Business Tower, Sala 402
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-auto">
                        <a
                            href="https://wa.me/5511999999999"
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-center transition shadow-lg transform hover:-translate-y-1"
                        >
                            Falar no WhatsApp
                        </a>
                        <Link
                            href="/contato"
                            className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold py-4 px-8 rounded-lg text-center transition"
                        >
                            Enviar E-mail
                        </Link>
                    </div>
                </div>

            </main>

            {/* Footer Simples */}
            <footer className="bg-gray-800 text-gray-400 py-12 text-center">
                <p>© 2026 Imobiliária MVP. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
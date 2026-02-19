"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";

// Ícone do WhatsApp Inline Otimizado (SVG) - Reutilizável e Consistente
const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="currentColor"
        viewBox="0 0 16 16"
        className={className}
        role="img"
        aria-label="WhatsApp Logo"
    >
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
    </svg>
);

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Estados do formulário
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSubmitted(true);
                setFormData({ name: "", email: "", phone: "", message: "" }); // Limpa form
            } else {
                alert("Erro ao enviar mensagem. Tente novamente.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header />

            {/* Banner com Gradiente */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-slate-900 text-white py-20 transition-colors">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Fale Conosco</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Tire suas dúvidas, agende uma visita ou venha tomar um café conosco.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">

                    {/* Coluna Esquerda (Infos) */}
                    <div className="p-8 bg-blue-50 dark:bg-blue-900/10 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-8">Canais de Atendimento</h2>
                            <div className="space-y-8">

                                {/* WhatsApp (Ícone Atualizado) */}
                                <a
                                    href="https://wa.me/5511997009311"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-4 group cursor-pointer"
                                    title="Abrir conversa no WhatsApp"
                                >
                                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl shadow-sm text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                        <WhatsAppIcon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            WhatsApp <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-green-600" />
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                            (11) 99700-9311
                                        </p>
                                    </div>
                                </a>

                                {/* Telefone */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm text-blue-900 dark:text-blue-300">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">Telefone</h3>
                                        <p className="text-gray-600 dark:text-gray-300">(11) 99700-9311</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm text-blue-900 dark:text-blue-300">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">E-mail</h3>
                                        <p className="text-gray-600 dark:text-gray-300 break-all">contato@matielloimoveis.com.br</p>
                                    </div>
                                </div>

                                {/* Endereço (Novo) */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm text-blue-900 dark:text-blue-300">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">Endereço</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Centro - Arujá/SP<br />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita (Formulário) */}
                    <div className="p-8 md:p-12 bg-white dark:bg-gray-800">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-10">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <Send size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mensagem Enviada!</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                    Obrigado pelo contato. Nossa equipe retornará o mais breve possível.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 text-blue-900 dark:text-blue-400 font-bold hover:underline bg-blue-50 dark:bg-blue-900/20 px-6 py-2 rounded-full transition-colors"
                                >
                                    Enviar outra mensagem
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Envie uma mensagem</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Preencha o formulário abaixo para entrar em contato por e-mail.</p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nome Completo</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                            placeholder="Ex: João Silva"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">E-mail</label>
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                type="email"
                                                required
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                                placeholder="seu@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Telefone</label>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                type="tel"
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                                placeholder="(11) 99999-9999"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Mensagem</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={4}
                                            required
                                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                                            placeholder="Olá, gostaria de mais informações sobre..."
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-900 dark:bg-blue-700 hover:bg-blue-800 dark:hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {loading ? "Enviando..." : <>Enviar Mensagem <Send size={18} /></>}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
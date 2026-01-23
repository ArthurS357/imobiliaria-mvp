"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulação de envio (No futuro, conectar com API de e-mail real)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Banner Simples */}
            <div className="bg-blue-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold">Fale Conosco</h1>
                    <p className="text-blue-200 mt-2">Estamos prontos para atender você.</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Coluna 1: Informações */}
                    <div className="p-8 bg-blue-50 md:p-12 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-900 mb-6">Canais de Atendimento</h2>
                            <p className="text-gray-600 mb-8">
                                Tem alguma dúvida sobre um imóvel ou quer anunciar conosco? Escolha a forma mais confortável para você.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm text-blue-900">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Telefone</h3>
                                        <p className="text-gray-600">(11) 99999-9999</p>
                                        <p className="text-gray-500 text-sm">Seg a Sex, das 9h às 18h</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm text-blue-900">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">E-mail</h3>
                                        <p className="text-gray-600">contato@imobiliariamvp.com.br</p>
                                        <p className="text-gray-500 text-sm">Respondemos em até 24h</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm text-blue-900">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Escritório</h3>
                                        <p className="text-gray-600">
                                            Av. Principal da Cidade, 1000<br />
                                            Centro - SP
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <a
                                href="https://wa.me/5511999999999"
                                target="_blank"
                                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition shadow-md"
                            >
                                <MessageCircle size={20} /> Conversar no WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Coluna 2: Formulário */}
                    <div className="p-8 md:p-12">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Mensagem Enviada!</h3>
                                <p className="text-gray-500 mt-2">
                                    Obrigado pelo contato. Nossa equipe retornará em breve.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 text-blue-900 font-medium hover:underline"
                                >
                                    Enviar nova mensagem
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie uma mensagem</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            placeholder="Seu nome"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                                placeholder="seu@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                            <input
                                                type="tel"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                                placeholder="(11) 99999-9999"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white">
                                            <option>Quero comprar um imóvel</option>
                                            <option>Quero vender meu imóvel</option>
                                            <option>Dúvidas financeiras</option>
                                            <option>Outros assuntos</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                                        <textarea
                                            rows={4}
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            placeholder="Como podemos ajudar?"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? "Enviando..." : <>Enviar E-mail <Send size={18} /></>}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
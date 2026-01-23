"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer"; // Importar
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulação
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <div className="bg-blue-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold">Fale Conosco</h1>
                    <p className="text-blue-200 mt-2">Estamos prontos para atender você.</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Informações */}
                    <div className="p-8 bg-blue-50 md:p-12 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-900 mb-6">Canais de Atendimento</h2>
                            <p className="text-gray-600 mb-8">
                                Tem alguma dúvida sobre um imóvel ou quer anunciar conosco?
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm text-blue-900"><Phone size={24} /></div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Telefone</h3>
                                        <p className="text-gray-600">(11) 99999-9999</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm text-blue-900"><Mail size={24} /></div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">E-mail</h3>
                                        <p className="text-gray-600">contato@imobiliariamvp.com.br</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm text-blue-900"><MapPin size={24} /></div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Escritório</h3>
                                        <p className="text-gray-600">Av. Principal da Cidade, 1000</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <a href="https://wa.me/5511999999999" target="_blank" className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition shadow-md">
                                <MessageCircle size={20} /> Conversar no WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Formulário */}
                    <div className="p-8 md:p-12">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Mensagem Enviada!</h3>
                                <button onClick={() => setSubmitted(false)} className="mt-6 text-blue-900 font-medium hover:underline">
                                    Enviar nova mensagem
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie uma mensagem</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                        <input type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                        <input type="email" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                                        <textarea rows={4} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none"></textarea>
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition shadow-lg flex items-center justify-center gap-2">
                                        {loading ? "Enviando..." : <>Enviar E-mail <Send size={18} /></>}
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
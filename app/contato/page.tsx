"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            {/* Banner */}
            <div className="bg-blue-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold">Fale Conosco</h1>
                    <p className="text-blue-200 mt-2">Estamos prontos para atender você.</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Coluna Esquerda (Infos) - Mantenha igual ao anterior, só vou focar no form abaixo */}
                    <div className="p-8 bg-blue-50 md:p-12 flex flex-col justify-between">
                        {/* ... (Código da coluna esquerda mantém igual) ... */}
                        <div>
                            <h2 className="text-2xl font-bold text-blue-900 mb-6">Canais de Atendimento</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm text-blue-900"><Phone size={24} /></div>
                                    <div><h3 className="font-bold text-gray-900">Telefone</h3><p className="text-gray-600">(11) 94600-9103</p></div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm text-blue-900"><Mail size={24} /></div>
                                    <div><h3 className="font-bold text-gray-900">E-mail</h3><p className="text-gray-600">brenomatiello@gmail.com </p></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita (Formulário Conectado) */}
                    <div className="p-8 md:p-12">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Mensagem Salva!</h3>
                                <p className="text-gray-500 mt-2">Nossa equipe comercial entrará em contato em breve.</p>
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
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Seu nome completo"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            type="email"
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            type="tel"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="(DD) 94600-9103"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={4}
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Tenho interesse no imóvel..."
                                        ></textarea>
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition shadow-lg flex items-center justify-center gap-2">
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
"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight } from "lucide-react";

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

                                {/* WhatsApp (Novo) */}
                                <a
                                    href="https://wa.me/5511946009103"
                                    target="_blank"
                                    className="flex items-start gap-4 group cursor-pointer"
                                >
                                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl shadow-sm text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                        <MessageCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            WhatsApp <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-green-600" />
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                            (11) 94600-9103
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
                                        <p className="text-gray-600 dark:text-gray-300">(11) 94600-9103</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm text-blue-900 dark:text-blue-300">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">E-mail</h3>
                                        <p className="text-gray-600 dark:text-gray-300 break-all">brenomatiello@gmail.com</p>
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
                                            Av. Principal da Cidade, 1000<br />
                                            Centro - Arujá/SP
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
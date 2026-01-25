"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Credenciais inválidas. Verifique seu e-mail e senha.");
                setLoading(false);
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            setError("Erro de conexão. Tente novamente mais tarde.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 relative">

            {/* Fundo Decorativo Sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white pointer-events-none" />

            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200 relative overflow-hidden z-10">

                {/* Barra decorativa no topo */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-700 to-blue-900"></div>

                {/* Cabeçalho */}
                <div className="text-center mb-8 mt-2">
                    <div className="mx-auto h-16 w-16 bg-blue-900 rounded-2xl flex items-center justify-center mb-5 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Lock className="text-white h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Acesso Restrito
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 font-medium">
                        Bem-vindo ao painel da <span className="font-bold text-blue-900">MATIELLO</span><span className="font-bold text-gray-800">IMÓVEIS</span>
                    </p>
                </div>

                {/* Formulário */}
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* E-mail */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-1.5">E-mail Corporativo</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-700 transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all sm:text-sm font-medium"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    {/* Senha */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-1.5">Senha</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-700 transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all sm:text-sm font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="flex items-center gap-3 bg-red-50 text-red-800 p-3 rounded-lg text-sm border border-red-200 animate-in fade-in slide-in-from-top-2 font-medium">
                            <AlertCircle size={20} className="shrink-0 text-red-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Botão */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Entrando...
                            </>
                        ) : (
                            <>
                                Acessar Sistema <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Rodapé */}
                <div className="mt-8 text-center pt-6 border-t border-gray-200">
                    <Link
                        href="/"
                        className="text-sm font-semibold text-gray-600 hover:text-blue-900 transition-colors flex items-center justify-center gap-1 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para o site
                    </Link>
                </div>
            </div>

            {/* Copyright Discreto */}
            <div className="absolute bottom-6 text-xs text-gray-500 font-medium z-10">
                &copy; {new Date().getFullYear()} Matiello Imóveis. Admin.
            </div>
        </div>
    );
}
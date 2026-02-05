"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { status } = useSession(); // Hook para verificar sessão
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // 1. Toggle Senha
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [capsLockActive, setCapsLockActive] = useState(false); // 3. Caps Lock

    // 2. Redirecionamento se já logado
    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/admin");
        }
    }, [status, router]);

    // Detector de Caps Lock
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.getModifierState("CapsLock")) {
            setCapsLockActive(true);
        } else {
            setCapsLockActive(false);
        }
    };

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

    if (status === "loading") return null; // Evita flash de conteúdo

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 relative">

            {/* Fundo Decorativo Sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white pointer-events-none" />

            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200 relative overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-300">

                {/* Barra decorativa no topo */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-700 to-blue-900"></div>

                {/* Cabeçalho */}
                <div className="text-center mb-8 mt-2">
                    <div className="mx-auto h-16 w-16 bg-blue-900 rounded-2xl flex items-center justify-center mb-5 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300 group cursor-default">
                        <Lock className="text-white h-8 w-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Acesso Restrito
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 font-medium">
                        Bem-vindo ao painel da <span className="font-bold text-blue-900">MATIELLO</span><span className="font-bold text-gray-800">IMÓVEIS</span>
                    </p>
                </div>

                {/* Formulário */}
                <form className="space-y-6" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>

                    {/* E-mail */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-1.5">E-mail Corporativo</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-700 transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoFocus // 4. Auto Focus
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all sm:text-sm font-medium shadow-sm hover:border-gray-400"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    {/* Senha */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-1.5">Senha</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-700 transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"} // Toggle Type
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all sm:text-sm font-medium shadow-sm hover:border-gray-400"
                                placeholder="••••••••"
                            />
                            {/* Botão de Ver Senha */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {/* Aviso Caps Lock */}
                        {capsLockActive && (
                            <p className="text-xs text-orange-600 mt-1.5 font-bold flex items-center gap-1 animate-pulse">
                                <AlertCircle size={12} /> Caps Lock está ativado
                            </p>
                        )}
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
                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] hover:shadow-lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Entrando...
                            </>
                        ) : (
                            <>
                                Acessar Sistema <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Rodapé */}
                <div className="mt-8 text-center pt-6 border-t border-gray-200">
                    <Link
                        href="/"
                        className="text-sm font-semibold text-gray-500 hover:text-blue-900 transition-colors flex items-center justify-center gap-1 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para o site
                    </Link>
                </div>
            </div>

            {/* Copyright Discreto */}
            <div className="absolute bottom-6 text-xs text-gray-400 font-medium z-10">
                &copy; {new Date().getFullYear()} Matiello Imóveis. Admin.
            </div>
        </div>
    );
}
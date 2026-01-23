"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
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
            // Tenta fazer o login usando o NextAuth
            const result = await signIn("credentials", {
                redirect: false, // Não redirecionar automaticamente para tratarmos erros aqui
                email,
                password,
            });

            if (result?.error) {
                setError("E-mail ou senha incorretos.");
                setLoading(false);
            } else {
                // Sucesso: Redireciona para o Dashboard
                router.push("/admin");
                router.refresh(); // Atualiza a sessão
            }
        } catch (err) {
            setError("Ocorreu um erro ao tentar entrar.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">

                {/* Cabeçalho do Card */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-blue-900">
                        Área Restrita
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Acesse o painel administrativo da <span className="font-bold">IMOBILIÁRIA<span className="text-red-600">MVP</span></span>
                    </p>
                </div>

                {/* Formulário */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">

                        {/* Campo E-mail */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Seu e-mail corporativo"
                            />
                        </div>

                        {/* Campo Senha */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Sua senha"
                            />
                        </div>
                    </div>

                    {/* Exibição de Erros */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Botão de Entrar */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
                        >
                            {loading ? (
                                "Entrando..."
                            ) : (
                                <span className="flex items-center gap-2">
                                    Acessar Sistema <ArrowRight size={16} />
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                {/* Link para voltar */}
                <div className="text-center mt-4">
                    <Link href="/" className="text-sm text-gray-500 hover:text-blue-900 transition-colors">
                        &larr; Voltar para o site
                    </Link>
                </div>
            </div>
        </div>
    );
}
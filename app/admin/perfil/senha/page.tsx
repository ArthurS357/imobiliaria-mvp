"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { changeOwnPassword } from "@/app/actions/password";
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ChangePasswordPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Estado para controlar a visibilidade das senhas
  const [showPassword, setShowPassword] = useState(false);

  // Verifica se o usuário caiu aqui obrigado pelo Middleware
  const isForced = session?.user?.isDefaultPassword === true;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    const newPass = formData.get("newPassword") as string;
    const confirmPass = formData.get("confirmPassword") as string;

    // Validação básica de igualdade no front
    if (newPass !== confirmPass) {
      setMessage({
        type: "error",
        text: "A confirmação da senha não coincide.",
      });
      setLoading(false);
      return;
    }

    // Chama a Server Action
    const result = await changeOwnPassword(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Senha atualizada com sucesso!" });

      // ATUALIZA A SESSÃO: Remove a flag de bloqueio imediatamente
      await update({ isDefaultPassword: false });

      // Limpa o formulário
      (event.target as HTMLFormElement).reset();
      setShowPassword(false);

      // Redireciona após 1.5s
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto max-w-lg py-12 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Gerenciar Senha
            </h1>
            <p className="text-sm text-slate-500">
              Atualize suas credenciais de acesso
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Aviso de Troca Obrigatória */}
          {isForced && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800">
                  Ação Necessária
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  Você está usando uma senha provisória ou padrão. Por
                  segurança, defina uma nova senha pessoal para continuar
                  acessando o sistema.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Senha Atual */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Senha Atual
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  placeholder="Digite sua senha atual"
                  required
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1} // Evita foco via tab para não atrapalhar a digitação
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Nova Senha */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Crie uma nova senha"
                  required
                  className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                {/* O botão de toggle também afeta este campo */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                A senha deve conter no mínimo <strong>8 caracteres</strong>,
                incluindo letras maiúsculas, minúsculas, números e símbolos (ex:
                !@#$).
              </p>
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repita a nova senha"
                  required
                  className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Mensagens de Erro/Sucesso */}
            {message && (
              <div
                className={`p-3 rounded-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
                  message.type === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                {message.text}
              </div>
            )}

            {/* Botões */}
            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  "Salvar Nova Senha"
                )}
              </button>

              {/* Botão de Cancelar (Só aparece se não for obrigado) */}
              {!isForced && (
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="w-full text-slate-600 hover:text-slate-800 hover:bg-slate-100 py-2.5 rounded-lg transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { adminResetPassword } from "@/app/actions/password";
import { RefreshCcw, Loader2 } from "lucide-react";

interface ResetButtonProps {
  userId: string;
  userName: string;
}

export function ResetPasswordButton({ userId, userName }: ResetButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    // Confirmação nativa do browser para simplicidade
    if (
      !confirm(
        `Tem certeza que deseja resetar a senha de "${userName}" para a senha padrão (Mat026!)?`,
      )
    ) {
      return;
    }

    setLoading(true);
    const result = await adminResetPassword(userId);

    if (result.success) {
      alert(result.message);
    } else {
      alert("Erro: " + result.error);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleReset}
      disabled={loading}
      title="Resetar Senha para Padrão"
      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors group-hover:text-gray-500"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <RefreshCcw className="w-4 h-4" />
      )}
    </button>
  );
}

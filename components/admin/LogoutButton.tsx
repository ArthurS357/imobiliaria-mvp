"use client";

import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        // O redirect: true é o padrão, mas forçamos o callbackUrl para garantir
        await signOut({ callbackUrl: "/admin/login" });
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-all font-medium text-sm group border border-red-100 dark:border-red-900/50 disabled:opacity-50"
            title="Sair da conta"
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            )}
            <span className="hidden md:inline">{loading ? "Saindo..." : "Sair"}</span>
        </button>
    );
}
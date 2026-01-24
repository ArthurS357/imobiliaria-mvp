"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-10 h-10" />;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-blue-900 dark:text-blue-400 shadow-sm border border-transparent dark:border-gray-700"
            title="Alternar Tema"
        >
            {/* Lógica: Se dark, mostra Lua. Se light, mostra Sol. */}
            {theme === "dark" ? (
                <Moon size={20} className="fill-current" />
            ) : (
                <Sun size={20} className="fill-current" />
            )}
        </button>
    );
}
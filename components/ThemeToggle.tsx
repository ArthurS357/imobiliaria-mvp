"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Evita erro de hidratação (só renderiza depois que montar no cliente)
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />; // Placeholder para evitar pulo visual
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            title="Alternar Tema"
        >
            {theme === "dark" ? (
                <Sun size={20} className="text-yellow-500" />
            ) : (
                <Moon size={20} className="text-blue-900" />
            )}
        </button>
    );
}
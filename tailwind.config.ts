import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Aqui substituímos o vermelho padrão pelo seu Dourado
                // Assim, classes como text-red-600 ou bg-red-500 ficarão douradas
                red: {
                    50: '#fdfce8',  // tom bem claro para fundos
                    100: '#fcf8c4',
                    200: '#faef8e',
                    300: '#f7e153',
                    400: '#eaca42', // <--- SUA COR PRINCIPAL (antigo red-400/500)
                    500: '#d9b32b', // Um pouco mais escuro para destaque
                    600: '#b88f1f', // Para textos escuras / hover
                    700: '#946d19',
                    800: '#7a571a',
                    900: '#664819',
                    950: '#3a270b',
                },
                // Adicionamos também como 'gold' caso queira usar text-gold-500 especificamente
                gold: {
                    DEFAULT: '#eaca42',
                    500: '#eaca42',
                    600: '#d9b32b',
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
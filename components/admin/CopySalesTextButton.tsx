"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface PropertyProps {
    titulo: string;
    preco: number;
    cidade: string;
    bairro: string;
    quarto: number;
    area: number;
    id: string;
}

export function CopySalesTextButton({ property }: { property: PropertyProps }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        // Texto persuasivo automático
        const text = `🏡 *Oportunidade Incrível no ${property.bairro}!*

✨ *${property.titulo}*
📍 Localização: ${property.cidade}

📐 ${property.area}m² úteis
🛏️ ${property.quarto} Quartos
💰 *Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}*

👇 *Veja mais fotos e detalhes aqui:*
${window.location.origin}/imoveis/${property.id}

📞 Me chame para agendar uma visita!`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition"
            title="Copiar Texto de Venda (WhatsApp)"
        >
            {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
    );
}
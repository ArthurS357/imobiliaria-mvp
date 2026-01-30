import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função utilitária para combinar classes do Tailwind (necessária para componentes modernos)
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Função de Marca D'água (Versão Corrigida: Proporcional)
export function getWatermarkedImage(url: string | null) {
    if (!url) return null;
    if (!url.includes("cloudinary.com")) return url;

    // ID da sua logo no Cloudinary
    const logoId = "logo_e7vocq";

    // --- EXPLICAÇÃO DA TRANSFORMAÇÃO ---
    // l_{logoId}  -> Adiciona a camada da logo
    // w_0.5       -> Define a largura como 50% (0.5) da imagem base (Proporcional)
    // fl_relative -> Garante que o 'w' seja relativo ao tamanho da foto, não fixo
    // o_20        -> Opacidade 20% (bem discreta)
    // g_center    -> Centraliza a logo
    const transformation = `l_${logoId},w_0.5,fl_relative,o_20,g_center`;

    // Injeta a transformação na URL do Cloudinary logo após "/upload/"
    return url.replace("/upload/", `/upload/${transformation}/`);
}
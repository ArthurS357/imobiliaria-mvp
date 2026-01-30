"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
    value: string[]; // Lista de URLs atuais
    onChange: (value: string[]) => void; // Função para atualizar a lista
    onRemove: (value: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    // ATUALIZADO: Busca das variáveis de ambiente para maior segurança
    // Certifique-se de definir NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e PRESET no seu .env e na Vercel
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validação de segurança para garantir que as variáveis existem
        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            alert("Erro de configuração: Variáveis do Cloudinary não encontradas.");
            console.error("Verifique se NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e NEXT_PUBLIC_CLOUDINARY_PRESET estão definidas.");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.secure_url) {
                // Adiciona a nova URL à lista existente mantendo as anteriores
                onChange([...value, data.secure_url]);
            } else {
                alert("Erro no upload. Verifique o console.");
                console.error("Erro Cloudinary:", data);
            }
        } catch (error) {
            console.error("Erro ao enviar imagem:", error);
            alert("Erro de conexão com o serviço de imagem.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            {/* Lista de Imagens Já Carregadas */}
            <div className="mb-4 flex flex-wrap gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200 group">
                        <div className="z-10 absolute top-1 right-1">
                            <button
                                type="button"
                                onClick={() => onRemove(url)}
                                className="bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm"
                            >
                                <X size={12} />
                            </button>
                        </div>
                        {/* O comentário abaixo desativa o aviso do Next.js sobre usar <img> em vez de <Image> */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Foto do imóvel" className="object-cover w-full h-full" />
                    </div>
                ))}
            </div>

            {/* Botão de Upload */}
            <div className="flex items-center gap-4">
                <label className={`
          flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}>
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    <span className="font-medium text-sm">
                        {isUploading ? "Enviando..." : "Carregar Foto"}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={isUploading}
                    />
                </label>

                {value.length === 0 && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <ImageIcon size={14} /> Nenhuma foto selecionada
                    </span>
                )}
            </div>
        </div>
    );
}
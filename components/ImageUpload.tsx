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

    // CONFIGURAÇÃO DO CLOUDINARY (Substitua pelos seus dados se quiser, ou use variáveis de ambiente)
    const CLOUD_NAME = "dfztxjmb2"; // ⚠️ TROQUE "demo" PELO SEU CLOUD NAME
    const UPLOAD_PRESET = "imobiliaria_preset"; // ⚠️ TROQUE PELO SEU UPLOAD PRESET (Modo Unsigned)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
                // Adiciona a nova URL à lista existente
                onChange([...value, data.secure_url]);
            } else {
                alert("Erro no upload. Verifique o console.");
                console.error(data);
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
                        <img src={url} alt="Foto do imóvel" className="object-cover w-full h-full" />
                    </div>
                ))}
            </div>

            {/* Botão de Upload */}
            <div className="flex items-center gap-4">
                <label className={`
          flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition border border-gray-300
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
"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2, GripHorizontal } from "lucide-react";

interface ImageUploadProps {
    value: string[]; // Lista de URLs atuais
    onChange: (value: string[]) => void; // Função para atualizar a lista
    onRemove: (value: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Busca das variáveis de ambiente
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

    // --- FUNÇÃO DE UPLOAD MÚLTIPLO ---
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            alert("Erro de configuração: Variáveis do Cloudinary não encontradas.");
            return;
        }

        setIsUploading(true);
        const newUrls: string[] = [];

        // Cria uma promessa de upload para cada arquivo selecionado
        const uploadPromises = Array.from(files).map(async (file) => {
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
                    return data.secure_url;
                } else {
                    console.error("Erro Cloudinary:", data);
                    return null;
                }
            } catch (error) {
                console.error("Erro ao enviar imagem:", error);
                return null;
            }
        });

        // Aguarda todos os uploads terminarem
        const results = await Promise.all(uploadPromises);

        // Filtra apenas os sucessos
        results.forEach((url) => {
            if (url) newUrls.push(url);
        });

        // Atualiza a lista mantendo as anteriores + as novas
        onChange([...value, ...newUrls]);
        setIsUploading(false);

        // Limpa o input para permitir selecionar os mesmos arquivos novamente se necessário
        e.target.value = "";
    };

    // --- FUNÇÕES DE DRAG AND DROP (REORDENAÇÃO) ---
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessário para permitir o "Drop"
    };

    const handleDrop = (targetIndex: number) => {
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const updatedList = [...value];
        // Remove o item da posição original
        const [movedItem] = updatedList.splice(draggedIndex, 1);
        // Insere na nova posição
        updatedList.splice(targetIndex, 0, movedItem);

        onChange(updatedList);
        setDraggedIndex(null);
    };

    return (
        <div>
            {/* Lista de Imagens (Com suporte a Drag & Drop) */}
            <div className="mb-4 flex flex-wrap gap-4">
                {value.map((url, index) => (
                    <div
                        key={url}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className={`
                            relative w-32 aspect-[4/3] rounded-md overflow-hidden border border-gray-200 group cursor-grab active:cursor-grabbing
                            transition-all duration-200 bg-gray-50
                            ${draggedIndex === index ? "opacity-30 scale-95 border-blue-500 border-2" : "hover:shadow-md hover:border-blue-300"}
                        `}
                    >
                        {/* Botão de Remover */}
                        <div className="z-20 absolute top-1 right-1">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Evita iniciar o drag ao clicar em remover
                                    onRemove(url);
                                }}
                                className="bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-600"
                                title="Remover imagem"
                            >
                                <X size={12} />
                            </button>
                        </div>

                        {/* Ícone de "Arrastar" (Dica visual) */}
                        <div className="z-10 absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-white drop-shadow-md pointer-events-none">
                            <GripHorizontal size={20} />
                        </div>

                        {/* Imagem */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={url}
                            alt={`Foto ${index + 1}`}
                            className="object-cover w-full h-full pointer-events-none select-none"
                        />
                    </div>
                ))}
            </div>

            {/* Área de Botão de Upload */}
            <div className="flex items-center gap-4 flex-wrap">
                <label className={`
                    flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600
                    ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                `}>
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    <span className="font-medium text-sm">
                        {isUploading ? "Enviando..." : "Carregar Fotos"}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple // Permite selecionar vários arquivos
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

                {value.length > 0 && (
                    <span className="text-xs text-gray-400 flex items-center gap-1 animate-pulse">
                        <GripHorizontal size={14} /> Arraste para reordenar
                    </span>
                )}
            </div>
        </div>
    );
}
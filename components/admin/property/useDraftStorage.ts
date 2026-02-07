// components/admin/property/useDraftStorage.ts
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { PropertyFormData } from "./types";

export function useDraftStorage(
    initialData: PropertyFormData | undefined,
    formData: PropertyFormData,
    setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
    const [restoredFromDraft, setRestoredFromDraft] = useState(false);

    // Restore Draft
    useEffect(() => {
        if (!initialData) {
            const savedDraft = localStorage.getItem("property-draft");
            if (savedDraft) {
                try {
                    const parsedDraft = JSON.parse(savedDraft);
                    if (parsedDraft.titulo || parsedDraft.descricao) {
                        const confirmRestore = window.confirm(
                            "Encontramos um rascunho não salvo. Deseja continuar de onde parou?"
                        );
                        if (confirmRestore) {
                            setFormData(parsedDraft);
                            setRestoredFromDraft(true);
                            toast.success("Rascunho restaurado com sucesso!");
                        } else {
                            localStorage.removeItem("property-draft");
                        }
                    }
                } catch (e) {
                    console.error("Erro ao restaurar rascunho", e);
                }
            }
        }
    }, [initialData, setFormData]);

    // Save Draft
    useEffect(() => {
        if (!initialData) {
            const timeoutId = setTimeout(() => {
                localStorage.setItem("property-draft", JSON.stringify(formData));
            }, 1000); // Debounce save
            return () => clearTimeout(timeoutId);
        }
    }, [formData, initialData]);

    const clearDraft = () => {
        localStorage.removeItem("property-draft");
    };

    return { restoredFromDraft, clearDraft };
}
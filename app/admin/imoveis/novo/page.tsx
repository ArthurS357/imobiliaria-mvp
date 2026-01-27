"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Info, MapPin, Image as ImageIcon, Home, Loader2, Maximize, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload";
import { FeatureSelector } from "@/components/admin/FeatureSelector";
import { PROPERTY_TYPES } from "@/lib/constants"; // Importa os tipos atualizados

export default function NewPropertyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        tipo: PROPERTY_TYPES[0], // Padrão: Primeiro item da lista (Casa)
        preco: "",
        cidade: "",
        bairro: "",
        endereco: "",
        quarto: "",
        banheiro: "",
        garagem: "",
        area: "",        // Área Útil / Construída
        areaTerreno: "", // Área Total do Terreno
        latitude: "",
        longitude: "",
        fotos: [] as string[],
        features: [] as string[],
        displayAddress: true,
        displayDetails: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (formData.fotos.length === 0) {
            alert("Por favor, adicione pelo menos uma foto para o anúncio.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/imoveis");
                router.refresh();
            } else {
                alert("Erro ao cadastrar imóvel.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Novo Imóvel</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Preencha as informações obrigatórias marcadas com <span className="text-[#eaca42] font-bold">*</span>.
                        </p>
                    </div>
                    <Link href="/admin/imoveis" className="flex items-center gap-2 px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-gray-700 dark:text-gray-200">
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* CARD 1: Informações Principais */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                            <Info className="text-blue-600 dark:text-blue-400" size={20} />
                            <h2 className="font-bold text-gray-800 dark:text-white">Informações Principais</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Título do Anúncio <span className="text-[#eaca42]">*</span>
                                </label>
                                <input required name="titulo" value={formData.titulo} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ex: Casa de Alto Padrão..." />
                            </div>

                            {/* SELEÇÃO DE TIPOS (DINÂMICA) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Tipo <span className="text-[#eaca42]">*</span>
                                </label>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    {PROPERTY_TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Valor (R$) <span className="text-[#eaca42]">*</span>
                                </label>
                                <input required type="number" name="preco" value={formData.preco} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="0,00" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Descrição <span className="text-[#eaca42]">*</span>
                                </label>
                                <textarea required name="descricao" value={formData.descricao} rows={4} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: Detalhes e Checklist */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Home className="text-blue-600 dark:text-blue-400" size={20} />
                                <h2 className="font-bold text-gray-800 dark:text-white">Detalhes do Imóvel</h2>
                            </div>

                            {/* CHECKBOX DE PRIVACIDADE: DETALHES */}
                            <label className="flex items-center gap-2 text-sm cursor-pointer bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <input
                                    type="checkbox"
                                    name="displayDetails"
                                    checked={formData.displayDetails}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#eaca42] rounded border-gray-300 focus:ring-[#eaca42]"
                                />
                                {formData.displayDetails ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-gray-400" />}
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Mostrar Detalhes no Site</span>
                            </label>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Quartos</label>
                                    <input type="number" name="quarto" value={formData.quarto} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Banheiros</label>
                                    <input type="number" name="banheiro" value={formData.banheiro} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Vagas</label>
                                    <input type="number" name="garagem" value={formData.garagem} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                            </div>

                            {/* SEÇÃO DE METRAGEM (ÁREAS) */}
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <Maximize size={18} className="text-[#eaca42]" />
                                    <h3 className="font-semibold text-gray-800 dark:text-white">Metragem e Dimensões</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Área Útil / Construída (m²) <span className="text-[#eaca42]">*</span>
                                        </label>
                                        <input required type="number" name="area" value={formData.area} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400" placeholder="Ex: 150" />
                                        <p className="text-xs text-gray-500 mt-1">Tamanho interno do imóvel.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Área do Terreno (m²)
                                        </label>
                                        <input type="number" name="areaTerreno" value={formData.areaTerreno} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400" placeholder="Ex: 300" />
                                        <p className="text-xs text-gray-500 mt-1">Tamanho total do lote.</p>
                                    </div>
                                </div>
                            </div>

                            {/* COMPONENTE DE CHECKLIST */}
                            <div className="mt-6">
                                <FeatureSelector
                                    selectedFeatures={formData.features}
                                    onChange={(newFeatures) => setFormData({ ...formData, features: newFeatures })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: Localização */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
                                <h2 className="font-bold text-gray-800 dark:text-white">Localização</h2>
                            </div>

                            {/* CHECKBOX DE PRIVACIDADE: ENDEREÇO */}
                            <label className="flex items-center gap-2 text-sm cursor-pointer bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <input
                                    type="checkbox"
                                    name="displayAddress"
                                    checked={formData.displayAddress}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#eaca42] rounded border-gray-300 focus:ring-[#eaca42]"
                                />
                                {formData.displayAddress ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-gray-400" />}
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Mostrar Endereço no Site</span>
                            </label>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Cidade <span className="text-[#eaca42]">*</span>
                                    </label>
                                    <input required name="cidade" value={formData.cidade} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Bairro <span className="text-[#eaca42]">*</span>
                                    </label>
                                    <input required name="bairro" value={formData.bairro} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Endereço</label>
                                    <input name="endereco" value={formData.endereco} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-3">Mapa (Opcional)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Latitude</label>
                                        <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm" placeholder="-23.5505" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Longitude</label>
                                        <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm" placeholder="-46.6333" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: Fotos */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                            <ImageIcon className="text-blue-600 dark:text-blue-400" size={20} />
                            <h2 className="font-bold text-gray-800 dark:text-white">Fotos <span className="text-[#eaca42]">*</span></h2>
                        </div>
                        <div className="p-6">
                            <ImageUpload
                                value={formData.fotos}
                                onChange={(urls) => setFormData({ ...formData, fotos: urls })}
                                onRemove={(url) => setFormData({ ...formData, fotos: formData.fotos.filter((current) => current !== url) })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 pb-12">
                        <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-70">
                            {loading ? <><Loader2 className="animate-spin" size={20} /> Salvando...</> : <><Save size={20} /> Publicar</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
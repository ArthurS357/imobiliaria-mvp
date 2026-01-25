"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Info, MapPin, Image as ImageIcon, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload";

export default function NewPropertyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Estado do formulário
    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        tipo: "Casa",
        preco: "",
        cidade: "",
        bairro: "",
        endereco: "",
        quarto: "",
        banheiro: "",
        garagem: "",
        area: "",
        latitude: "",
        longitude: "",
        fotos: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                alert("Erro ao cadastrar imóvel. Verifique os dados.");
            }
        } catch (error) {
            alert("Erro de conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">

                {/* Cabeçalho */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Novo Imóvel</h1>
                        <p className="text-gray-500 dark:text-gray-400">Preencha as informações para publicar um novo anúncio.</p>
                    </div>
                    <Link href="/admin/imoveis" className="text-gray-600 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 flex items-center gap-2 font-medium px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
                        <ArrowLeft size={20} /> Voltar para Lista
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* CARD 1: Informações Básicas */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                            <Info className="text-blue-600 dark:text-blue-400" size={20} />
                            <h2 className="font-bold text-gray-800 dark:text-white">Informações Principais</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Título do Anúncio</label>
                                <input required name="titulo" value={formData.titulo} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" placeholder="Ex: Belíssima Casa no Condomínio..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tipo de Imóvel</label>
                                <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none transition">
                                    <option value="Casa">Casa</option>
                                    <option value="Apartamento">Apartamento</option>
                                    <option value="Terreno">Terreno</option>
                                    <option value="Comercial">Comercial</option>
                                    <option value="Sítio/Chácara">Sítio/Chácara</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Valor de Venda (R$)</label>
                                <input required type="number" name="preco" value={formData.preco} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" placeholder="0,00" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Descrição Detalhada</label>
                                <textarea required name="descricao" value={formData.descricao} rows={4} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition resize-y" placeholder="Descreva os diferenciais do imóvel..." />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: Detalhes do Imóvel */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                            <Home className="text-blue-600 dark:text-blue-400" size={20} />
                            <h2 className="font-bold text-gray-800 dark:text-white">Características</h2>
                        </div>
                        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Quartos</label>
                                <input type="number" name="quarto" value={formData.quarto} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Banheiros</label>
                                <input type="number" name="banheiro" value={formData.banheiro} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Vagas</label>
                                <input type="number" name="garagem" value={formData.garagem} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Área Útil (m²)</label>
                                <input required type="number" name="area" value={formData.area} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" />
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: Localização */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                            <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
                            <h2 className="font-bold text-gray-800 dark:text-white">Localização</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Cidade</label>
                                    <input required name="cidade" value={formData.cidade} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Bairro</label>
                                    <input required name="bairro" value={formData.bairro} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Endereço (Rua, Nº)</label>
                                    <input name="endereco" value={formData.endereco} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" />
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-3">Coordenadas para o Mapa (Opcional)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Latitude</label>
                                        <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" placeholder="-23.5505" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Longitude</label>
                                        <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" placeholder="-46.6333" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2">
                                    💡 Dica: No Google Maps, clique com o botão direito no local desejado e copie os números (Latitude, Longitude).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: Fotos */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                            <ImageIcon className="text-blue-600 dark:text-blue-400" size={20} />
                            <h2 className="font-bold text-gray-800 dark:text-white">Galeria de Fotos</h2>
                        </div>
                        <div className="p-6">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
                                <ImageUpload
                                    value={formData.fotos}
                                    onChange={(urls) => setFormData({ ...formData, fotos: urls })}
                                    onRemove={(url) => setFormData({ ...formData, fotos: formData.fotos.filter((current) => current !== url) })}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                                    Formatos aceitos: JPG, PNG. A primeira foto selecionada será a capa do anúncio.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botão Salvar (Fixo no final ou flutuante) */}
                    <div className="flex justify-end pt-4 pb-12">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:transform-none"
                        >
                            {loading ? <><Loader2 className="animate-spin" size={20} /> Salvando...</> : <><Save size={20} /> Publicar Imóvel</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
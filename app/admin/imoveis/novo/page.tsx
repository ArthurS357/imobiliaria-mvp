"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload"; // <--- Import do componente de upload

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
        // Novos campos para o MAPA
        latitude: "",
        longitude: "",
        // fotos: string[] -> Array de URLs
        fotos: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validação simples
        if (formData.fotos.length === 0) {
            alert("Por favor, adicione pelo menos uma foto.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData), // A API atualizada vai ler latitude/longitude
            });

            if (res.ok) {
                router.push("/admin/imoveis");
            } else {
                alert("Erro ao cadastrar.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Cadastrar Imóvel</h1>
                        <p className="text-gray-500">Preencha os dados do novo anúncio.</p>
                    </div>
                    <Link href="/admin/imoveis" className="text-gray-600 hover:text-blue-900 flex items-center gap-2">
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Dados Principais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Título do Anúncio</label>
                            <input name="titulo" value={formData.titulo} required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none" placeholder="Ex: Casa Linda no Centro" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de Imóvel</label>
                            <select name="tipo" value={formData.tipo} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none">
                                <option value="Casa">Casa</option>
                                <option value="Apartamento">Apartamento</option>
                                <option value="Terreno">Terreno</option>
                                <option value="Comercial">Comercial</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                            <input name="preco" value={formData.preco} type="number" required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" placeholder="0,00" />
                        </div>
                    </div>

                    {/* Área de Upload de Fotos */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Galeria de Fotos</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <ImageUpload
                                value={formData.fotos}
                                onChange={(urls) => setFormData({ ...formData, fotos: urls })}
                                onRemove={(url) => setFormData({ ...formData, fotos: formData.fotos.filter((current) => current !== url) })}
                            />
                            <p className="text-xs text-gray-500 mt-2">A primeira foto será usada como capa.</p>
                        </div>
                    </div>

                    {/* Localização */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Localização</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                                <input name="cidade" value={formData.cidade} required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bairro</label>
                                <input name="bairro" value={formData.bairro} required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                                <input name="endereco" value={formData.endereco} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* --- NOVO: COORDENADAS DO MAPA --- */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Coordenadas do Mapa (Opcional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                                <input
                                    name="latitude"
                                    type="number"
                                    step="any"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none"
                                    placeholder="-23.5505"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                                <input
                                    name="longitude"
                                    type="number"
                                    step="any"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none"
                                    placeholder="-46.6333"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded inline-block">
                            💡 Dica: No Google Maps, clique com o botão direito no local e copie os números.
                        </p>
                    </div>

                    {/* Detalhes */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Características</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quartos</label>
                                <input name="quarto" value={formData.quarto} type="number" onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Banheiros</label>
                                <input name="banheiro" value={formData.banheiro} type="number" onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vagas</label>
                                <input name="garagem" value={formData.garagem} type="number" onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Área (m²)</label>
                                <input name="area" value={formData.area} type="number" required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Descrição Detalhada</label>
                        <textarea name="descricao" value={formData.descricao} rows={5} required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Salvando..." : <><Save size={20} /> Cadastrar Imóvel</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
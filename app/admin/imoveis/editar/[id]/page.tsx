"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload"; // <--- Import do componente de upload

export default function EditPropertyPage() {
    const params = useParams(); // Pega o ID da URL
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Estado do formulário
    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        tipo: "Casa",
        preco: "",
        cidade: "",
        bairro: "",
        endereco: "",
        quarto: "0",
        banheiro: "0",
        garagem: "0",
        area: "",
        fotos: [] as string[], // Agora suporta múltiplas fotos (Array)
        status: "PENDENTE",
        destaque: false
    });

    // 1. Carregar dados do imóvel ao entrar na página
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                // Verifica se params.id existe antes de fazer a chamada
                if (!params?.id) return;

                const res = await fetch(`/api/properties/${params.id}`);
                const data = await res.json();

                if (!res.ok) throw new Error("Erro ao buscar imóvel");

                // Preenche o formulário com os dados recebidos
                setFormData({
                    titulo: data.titulo,
                    descricao: data.descricao,
                    tipo: data.tipo,
                    preco: data.preco,
                    cidade: data.cidade,
                    bairro: data.bairro,
                    endereco: data.endereco || "",
                    quarto: data.quarto,
                    banheiro: data.banheiro,
                    garagem: data.garagem,
                    area: data.area,
                    // Converte a string do banco ("url1;url2") para array ["url1", "url2"]
                    fotos: data.fotos ? data.fotos.split(";") : [],
                    status: data.status,
                    destaque: data.destaque
                });
            } catch (error) {
                alert("Erro ao carregar imóvel. Talvez ele não exista mais.");
                router.push("/admin/imoveis");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [params.id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // Tratamento especial para checkbox
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/properties/${params.id}`, {
                method: "PUT", // Método de Atualização
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData), // Envia o formData com o array de fotos
            });

            if (res.ok) {
                alert("Imóvel atualizado com sucesso!");
                router.push("/admin/imoveis"); // Volta para a lista
            } else {
                alert("Erro ao atualizar.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Carregando dados...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Editar Imóvel</h1>
                        <p className="text-gray-500">Atualize as informações, fotos ou mude o status.</p>
                    </div>
                    <Link href="/admin/imoveis" className="text-gray-600 hover:text-blue-900 flex items-center gap-2">
                        <ArrowLeft size={20} /> Cancelar e Voltar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Status e Destaque (Área Administrativa) */}
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-blue-900 mb-1">Status do Anúncio</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                <option value="PENDENTE">🟡 Pendente (Aguardando)</option>
                                <option value="DISPONIVEL">🟢 Disponível (No Site)</option>
                                <option value="VENDIDO">🔵 Vendido</option>
                                <option value="RESERVADO">⚪ Reservado</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="destaque"
                                    checked={formData.destaque}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-900 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-blue-900 font-medium">Destacar na Página Inicial?</span>
                            </label>
                        </div>
                    </div>

                    {/* Dados Principais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Título do Anúncio</label>
                            <input name="titulo" value={formData.titulo} required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none" />
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
                            <input name="preco" value={formData.preco} type="number" step="0.01" required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                        </div>
                    </div>

                    {/* Área de Upload de Fotos (NOVO) */}
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
                                <label className="block text-sm font-medium text-gray-700">Vagas Garagem</label>
                                <input name="garagem" value={formData.garagem} type="number" onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Área (m²)</label>
                                <input name="area" value={formData.area} type="number" required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="mt-4 border-t pt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Detalhada</label>
                        <textarea name="descricao" value={formData.descricao} rows={5} required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-4 pt-6">
                        <Link href="/admin/imoveis" className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition shadow-lg disabled:opacity-50"
                        >
                            {saving ? "Salvando..." : <><Save size={20} /> Salvar Alterações</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function NewPropertyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Estado do formulário
    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        tipo: "Casa", // Valor padrão
        preco: "",
        cidade: "",
        bairro: "",
        endereco: "",
        quarto: "0",
        banheiro: "0",
        garagem: "0",
        area: "",
        fotoUrl: "", // Para o MVP: Colar URL da imagem
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    fotos: [formData.fotoUrl], // Envia como lista (mesmo sendo 1 por enquanto)
                }),
            });

            if (res.ok) {
                alert("Imóvel cadastrado com sucesso!");
                router.push("/admin"); // Volta para o painel
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

                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Novo Imóvel</h1>
                        <p className="text-gray-500">Preencha os dados abaixo para cadastrar</p>
                    </div>
                    <Link href="/admin" className="text-gray-600 hover:text-blue-900 flex items-center gap-2">
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Dados Principais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Título do Anúncio</label>
                            <input name="titulo" required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none" placeholder="Ex: Casa Linda no Centro" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de Imóvel</label>
                            <select name="tipo" onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none">
                                <option value="Casa">Casa</option>
                                <option value="Apartamento">Apartamento</option>
                                <option value="Terreno">Terreno</option>
                                <option value="Comercial">Comercial</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                            <input name="preco" type="number" step="0.01" required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" placeholder="0,00" />
                        </div>
                    </div>

                    {/* Localização */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Localização</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                                <input name="cidade" required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bairro</label>
                                <input name="bairro" required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Endereço (Rua/Número)</label>
                                <input name="endereco" onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Detalhes */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Características</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quartos</label>
                                <input name="quarto" type="number" onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Banheiros</label>
                                <input name="banheiro" type="number" onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vagas Garagem</label>
                                <input name="garagem" type="number" onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Área (m²)</label>
                                <input name="area" type="number" required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Mídia (MVP: URL Simples) */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Fotos</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">URL da Foto Principal</label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                    http://
                                </span>
                                <input name="fotoUrl" type="text" required onChange={handleChange} className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 p-2 focus:outline-none" placeholder="Cole o link da imagem aqui" />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Para o MVP, use links de imagens hospedadas (ex: Unsplash, Imgur).</p>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Descrição Detalhada</label>
                            <textarea name="descricao" rows={3} required onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none" />
                        </div>
                    </div>

                    {/* Botão de Salvar */}
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition shadow-lg disabled:opacity-50"
                        >
                            {loading ? "Salvando..." : <><Save size={20} /> Cadastrar Imóvel</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
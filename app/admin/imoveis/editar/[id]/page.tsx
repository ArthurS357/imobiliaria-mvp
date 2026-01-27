"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, Info, MapPin, Image as ImageIcon, Home, Loader2, ShieldCheck, AlertTriangle, Maximize, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload";
import { useSession } from "next-auth/react";
// Importamos o componente de checklist centralizado
import { FeatureSelector } from "@/components/admin/FeatureSelector";
// Importamos a lista de tipos padronizada
import { PROPERTY_TYPES } from "@/lib/constants";

export default function EditPropertyPage() {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        tipo: PROPERTY_TYPES[0], // Padrão inicial
        preco: "",
        cidade: "",
        bairro: "",
        endereco: "",
        quarto: "0",
        banheiro: "0",
        garagem: "0",
        area: "",        // Área Construída
        areaTerreno: "", // Área Total do Terreno
        latitude: "",
        longitude: "",
        fotos: [] as string[],
        features: [] as string[], // Estado para o checklist
        displayAddress: true,     // Controle de Privacidade
        displayDetails: true,     // Controle de Privacidade
        status: "PENDENTE",
        destaque: false
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                if (!params?.id) return;

                const res = await fetch(`/api/properties/${params.id}`);
                const data = await res.json();

                if (!res.ok) throw new Error("Erro ao buscar imóvel");

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
                    areaTerreno: data.areaTerreno || "", // Carrega área do terreno
                    latitude: data.latitude || "",
                    longitude: data.longitude || "",
                    fotos: data.fotos ? data.fotos.split(";") : [],
                    // Converte a string "Piscina,Churrasqueira" de volta para array
                    features: data.features ? data.features.split(",") : [],
                    status: data.status,
                    destaque: data.destaque,
                    displayAddress: data.displayAddress ?? true,
                    displayDetails: data.displayDetails ?? true,
                });
            } catch (error) {
                alert("Erro ao carregar imóvel.");
                router.push("/admin/imoveis");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [params.id, router]);

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
        setSaving(true);

        try {
            const res = await fetch(`/api/properties/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Imóvel atualizado com sucesso!");
                router.push("/admin/imoveis");
                router.refresh();
            } else {
                alert("Erro ao atualizar.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-gray-500 dark:text-gray-400">Carregando dados do imóvel...</p>
            </div>
        </div>
    );

    const isAdmin = session?.user?.role === "ADMIN";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">

                {/* Cabeçalho */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Editar Imóvel</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Atualize as informações do anúncio. Campos com <span className="text-[#eaca42] font-bold">*</span> são obrigatórios.
                        </p>
                    </div>
                    <Link href="/admin/imoveis" className="text-gray-600 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 flex items-center gap-2 font-medium px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
                        <ArrowLeft size={20} /> Cancelar e Voltar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* CARD ADMIN: Controle de Status (Só aparece para Admin) */}
                    {isAdmin && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-900/30 overflow-hidden">
                            <div className="px-6 py-4 border-b border-blue-100 dark:border-blue-900/30 flex items-center gap-2">
                                <ShieldCheck className="text-blue-700 dark:text-blue-400" size={20} />
                                <h2 className="font-bold text-blue-900 dark:text-blue-200">Área Administrativa</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div>
                                    <label className="block text-sm font-bold text-blue-900 dark:text-blue-300 mb-1.5">Status do Anúncio</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-blue-200 dark:border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition font-medium"
                                    >
                                        <option value="PENDENTE">🟡 Pendente (Aguardando Aprovação)</option>
                                        <option value="DISPONIVEL">🟢 Disponível (Visível no Site)</option>
                                        <option value="VENDIDO">🔵 Vendido</option>
                                        <option value="RESERVADO">⚪ Reservado</option>
                                    </select>
                                </div>
                                <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800 h-full mt-1">
                                    <label className="flex items-center gap-3 cursor-pointer w-full select-none">
                                        <input
                                            type="checkbox"
                                            name="destaque"
                                            checked={formData.destaque}
                                            onChange={handleChange}
                                            className="w-6 h-6 text-blue-900 rounded border-gray-300 focus:ring-blue-500 transition cursor-pointer"
                                        />
                                        <div>
                                            <span className="block text-blue-900 dark:text-blue-300 font-bold">Imóvel em Destaque?</span>
                                            <span className="text-xs text-blue-600 dark:text-blue-400">Aparecerá no topo da página inicial.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Aviso para Corretores (Não Admins) */}
                    {!isAdmin && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/50 flex items-start gap-3">
                            <AlertTriangle className="text-yellow-600 dark:text-yellow-500 shrink-0" size={20} />
                            <div>
                                <h3 className="font-bold text-yellow-800 dark:text-yellow-400 text-sm">Status Atual: {formData.status}</h3>
                                <p className="text-yellow-700 dark:text-yellow-500 text-xs mt-1">
                                    Alterações de status ou destaque devem ser solicitadas ao administrador.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* CARD 1: Informações Básicas */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                            <Info className="text-blue-600 dark:text-blue-400" size={20} />
                            <h2 className="font-bold text-gray-800 dark:text-white">Informações Principais</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Título do Anúncio <span className="text-[#eaca42]">*</span>
                                </label>
                                <input required name="titulo" value={formData.titulo} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" placeholder="Ex: Belíssima Casa no Condomínio..." />
                            </div>

                            {/* SELEÇÃO DINÂMICA DE TIPOS */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Tipo de Imóvel <span className="text-[#eaca42]">*</span>
                                </label>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none transition"
                                >
                                    {PROPERTY_TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Valor de Venda (R$) <span className="text-[#eaca42]">*</span>
                                </label>
                                <input required type="number" name="preco" value={formData.preco} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" placeholder="0,00" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Descrição Detalhada <span className="text-[#eaca42]">*</span>
                                </label>
                                <textarea required name="descricao" value={formData.descricao} rows={4} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition resize-y" />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: Detalhes e Checklist */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
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
                                        <input required type="number" name="area" value={formData.area} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400" />
                                        <p className="text-xs text-gray-500 mt-1">Tamanho interno do imóvel.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Área do Terreno (m²)
                                        </label>
                                        <input type="number" name="areaTerreno" value={formData.areaTerreno} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400" />
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
                        <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
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
                                    <input required name="cidade" value={formData.cidade} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Bairro <span className="text-[#eaca42]">*</span>
                                    </label>
                                    <input required name="bairro" value={formData.bairro} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Endereço</label>
                                    <input name="endereco" value={formData.endereco} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition" />
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-3">Coordenadas do Mapa</h3>
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
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: Fotos */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
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
                                    Arraste para reordenar. A primeira foto será a capa.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botão Salvar Flutuante ou Fixo */}
                    <div className="flex justify-end pt-4 pb-12">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:transform-none"
                        >
                            {saving ? <><Loader2 className="animate-spin" size={20} /> Salvando...</> : <><Save size={20} /> Salvar Alterações</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, MapPin, Image as ImageIcon, Home, Loader2, FileText, DollarSign, Calendar, Tag, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload";
import { FeatureSelector } from "@/components/admin/FeatureSelector";
import {
    PROPERTY_TYPES,
    PROPERTY_TYPES_CATEGORIZED,
    FINALIDADES,
    TIPOS_CONTRATO,
    STATUS_MERCADO,
    TIPOS_VALOR,
    CONDICAO_IMOVEL,
    PERIODICIDADE
} from "@/lib/constants";

export default function NewPropertyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Dados Básicos
        titulo: "",
        sobreTitulo: "",
        descricao: "",
        tipo: PROPERTY_TYPES[0],
        finalidade: "Venda", // Padrão

        // Valores e Contrato
        preco: "",
        precoLocacao: "", // NOVO: Campo para segundo valor
        tipoValor: "Preço fixo",
        periodoPagamento: "Mensal", // Para locação
        depositoSeguranca: "",      // Para locação
        valorCondominio: "",
        periodicidadeCondominio: "Mensal",
        tipoContrato: "Sem Exclusividade",

        // Localização
        cidade: "",
        bairro: "",
        endereco: "",
        latitude: "",
        longitude: "",

        // Detalhes Físicos
        quarto: "", // Dormitórios
        suites: "", // Novo
        banheiro: "",

        // Vagas
        garagem: "0", // Total
        vagasCobertas: "",
        vagasDescobertas: "",
        vagasSubsolo: false,

        // Áreas e Construção
        area: "",       // Área Útil
        areaTerreno: "",
        anoConstrucao: "",
        statusMercado: "Padrão",
        condicaoImovel: "Em ótimas condições",

        // Mídia e Configurações
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

        // Lógica para calcular o total de vagas
        const vagasCalc = (Number(formData.vagasCobertas) || 0) + (Number(formData.vagasDescobertas) || 0);
        const finalGaragem = Number(formData.garagem) > 0 ? formData.garagem : vagasCalc.toString();

        const payload = {
            ...formData,
            garagem: finalGaragem
        };

        try {
            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
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

    // Helpers de exibição
    const isRent = formData.finalidade === "Locação";
    const isDual = formData.finalidade === "Venda e Locação";
    const showRentFields = isRent || isDual;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
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

                    {/* GRUPO 1: DADOS GERAIS */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                            <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                            <h2 className="font-bold text-gray-800 dark:text-white">Dados Gerais & Contrato</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Título do Anúncio <span className="text-[#eaca42]">*</span>
                                </label>
                                <input required name="titulo" value={formData.titulo} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ex: Casa de Alto Padrão..." />
                            </div>

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
                                    {PROPERTY_TYPES_CATEGORIZED.map((group) => (
                                        <optgroup key={group.label} label={group.label} className="dark:bg-gray-700 font-bold">
                                            {group.types.map((type) => (
                                                <option key={type} value={type} className="font-normal">{type}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            {/* LINHA DE CONTRATO E FINALIDADE */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Finalidade <span className="text-[#eaca42]">*</span>
                                </label>
                                <select name="finalidade" value={formData.finalidade} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold text-blue-600">
                                    {FINALIDADES.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Tipo de Contrato
                                </label>
                                <select name="tipoContrato" value={formData.tipoContrato} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                    {TIPOS_CONTRATO.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Status de Mercado
                                </label>
                                <select name="statusMercado" value={formData.statusMercado} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                    {STATUS_MERCADO.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* GRUPO 2: VALORES */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-green-50/50 dark:bg-green-900/10 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                            <DollarSign className="text-green-600 dark:text-green-400" size={20} />
                            <h2 className="font-bold text-gray-800 dark:text-white">Valores & Custos</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Valor Principal */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    {isRent ? "Valor do Aluguel (R$)" : "Valor de Venda (R$)"} <span className="text-[#eaca42]">*</span>
                                </label>
                                <input required type="number" name="preco" value={formData.preco} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-bold" placeholder="0,00" />
                            </div>

                            {/* NOVO: Campo Valor de Locação (Apenas se "Venda e Locação") */}
                            {isDual && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1.5">
                                        Valor do Aluguel (R$) <span className="text-[#eaca42]">*</span>
                                    </label>
                                    <input
                                        required={isDual}
                                        type="number"
                                        name="precoLocacao"
                                        value={formData.precoLocacao}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-orange-200 dark:border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-bold"
                                        placeholder="0,00"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Tipo de Valor
                                </label>
                                <select name="tipoValor" value={formData.tipoValor} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                    {TIPOS_VALOR.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* Condomínio */}
                            <div className="flex gap-2">
                                <div className="w-2/3">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Condomínio (R$)
                                    </label>
                                    <input type="number" name="valorCondominio" value={formData.valorCondominio} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="0,00" />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Período
                                    </label>
                                    <select name="periodicidadeCondominio" value={formData.periodicidadeCondominio} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                                        {PERIODICIDADE.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* CAMPOS EXTRAS PARA LOCAÇÃO OU DUPLA FINALIDADE */}
                            {showRentFields && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Período de Pagamento
                                        </label>
                                        <select name="periodoPagamento" value={formData.periodoPagamento} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                            {PERIODICIDADE.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Depósito de Segurança (R$)
                                        </label>
                                        <input type="number" name="depositoSeguranca" value={formData.depositoSeguranca} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="0,00" />
                                    </div>
                                    {/* Espaçador para grid em desktop */}
                                    <div className="hidden md:block"></div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* GRUPO 3: DETALHES FÍSICOS */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                            <Home className="text-blue-600 dark:text-blue-400" size={20} />
                            <h2 className="font-bold text-gray-800 dark:text-white">Detalhes Físicos</h2>
                        </div>

                        <div className="p-6">
                            {/* Quartos, Suítes, Banheiros, Ano */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Dormitórios</label>
                                    <input type="number" name="quarto" value={formData.quarto} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Sendo Suítes</label>
                                    <input type="number" name="suites" value={formData.suites} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Banheiros</label>
                                    <input type="number" name="banheiro" value={formData.banheiro} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Ano Construção</label>
                                    <input type="number" name="anoConstrucao" value={formData.anoConstrucao} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ex: 2024" />
                                </div>
                            </div>

                            {/* ÁREA DE VAGAS DETALHADA */}
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Detalhamento de Vagas de Garagem</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Vagas Cobertas</label>
                                        <input type="number" name="vagasCobertas" value={formData.vagasCobertas} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Vagas Descobertas</label>
                                        <input type="number" name="vagasDescobertas" value={formData.vagasDescobertas} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div className="pb-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" name="vagasSubsolo" checked={formData.vagasSubsolo} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Vagas no Subsolo?</span>
                                        </label>
                                    </div>
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-center border border-blue-200 dark:border-blue-800">
                                        <span className="text-xs text-blue-800 dark:text-blue-300 block uppercase tracking-wide">Total Automático</span>
                                        <span className="font-bold text-xl text-blue-900 dark:text-white">
                                            {(Number(formData.vagasCobertas) || 0) + (Number(formData.vagasDescobertas) || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Áreas e Condição */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Área Útil (m²) <span className="text-[#eaca42]">*</span>
                                    </label>
                                    <input required type="number" name="area" value={formData.area} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Área Terreno (m²)
                                    </label>
                                    <input type="number" name="areaTerreno" value={formData.areaTerreno} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Condição do Imóvel
                                    </label>
                                    <select name="condicaoImovel" value={formData.condicaoImovel} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        {CONDICAO_IMOVEL.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* GRUPO 4: DESCRIÇÃO, FEATURE E LOCALIZAÇÃO */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6">
                            {/* Sobre o Imóvel */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Título da Secção "Sobre" (Opcional)
                                </label>
                                <input
                                    name="sobreTitulo"
                                    value={formData.sobreTitulo}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                                    placeholder="Ex: Vista incrível para o mar e acabamento de luxo..."
                                />

                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Descrição Detalhada <span className="text-[#eaca42]">*</span>
                                </label>
                                <textarea required name="descricao" value={formData.descricao} rows={6} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-y" />
                            </div>

                            {/* Checklist */}
                            <div className="mb-8">
                                <FeatureSelector
                                    selectedFeatures={formData.features}
                                    onChange={(newFeatures) => setFormData({ ...formData, features: newFeatures })}
                                />
                            </div>

                            {/* Localização Simplificada */}
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
                                    <h2 className="font-bold text-gray-800 dark:text-white">Endereço e Mapa</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Cidade <span className="text-[#eaca42]">*</span></label>
                                        <input required name="cidade" value={formData.cidade} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Bairro <span className="text-[#eaca42]">*</span></label>
                                        <input required name="bairro" value={formData.bairro} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Endereço</label>
                                        <input name="endereco" value={formData.endereco} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Latitude</label>
                                        <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm" placeholder="-23.5505" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Longitude</label>
                                        <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm" placeholder="-46.6333" />
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-4">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" name="displayAddress" checked={formData.displayAddress} onChange={handleChange} className="w-4 h-4 text-green-600 rounded" />
                                        <span className="text-gray-700 dark:text-gray-300">Mostrar endereço exato no site</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" name="displayDetails" checked={formData.displayDetails} onChange={handleChange} className="w-4 h-4 text-green-600 rounded" />
                                        <span className="text-gray-700 dark:text-gray-300">Mostrar detalhes completos</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 5: FOTOS */}
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
                            {loading ? <><Loader2 className="animate-spin" size={20} /> Salvando...</> : <><Save size={20} /> Publicar Imóvel</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
    MapPin, Bed, Bath, Car, Ruler, CheckCircle2,
    Building2, Phone, Mail, Globe
} from "lucide-react";
import { PrintTrigger } from "@/components/PrintTrigger"; // Importação do componente Client

// Helper de formatação
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
    }).format(Number(value));
};

export default async function PrintPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Busca dados completos do imóvel no banco de dados
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            corretor: {
                select: {
                    name: true,
                    email: true,
                    creci: true,
                },
            },
        },
    });

    if (!property) return notFound();

    // Tratamento de fotos e features
    const fotos = property.fotos ? property.fotos.split(";") : [];
    const features = property.features ? property.features.split(",") : [];
    const mainPhoto = fotos[0] || null;
    const secondaryPhotos = fotos.slice(1, 4);

    // Lógica de Venda e Locação (Dual Mode)
    const finalidadeLower = property.finalidade?.toLowerCase() || "";
    const isDual = (finalidadeLower.includes("venda") && finalidadeLower.includes("locação")) ||
        (property.preco > 0 && (property.precoLocacao || 0) > 0);

    return (
        <div className="bg-white min-h-screen text-black p-8 print:p-0 max-w-4xl mx-auto">

            {/* --- CONTROLES DE IMPRESSÃO --- */}
            {/* O componente PrintTrigger é "use client", permitindo o uso de onClick e window.print() */}
            <div className="mb-8 print:hidden flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h1 className="text-xl font-bold text-gray-500">Visualização de Impressão</h1>
                <PrintTrigger />
            </div>

            {/* --- CABEÇALHO DO DOCUMENTO --- */}
            <header className="border-b-2 border-blue-900 pb-6 mb-6 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {/* Logo Texto */}
                        <div className="text-2xl font-black tracking-tighter text-blue-900">
                            IMOBILIÁRIA<span className="text-[#eaca42]">MVP</span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 flex flex-col">
                        <span className="flex items-center gap-1"><Globe size={12} /> www.imobiliariamvp.com.br</span>
                        <span className="flex items-center gap-1"><Mail size={12} /> contato@imobiliariamvp.com.br</span>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-sm text-gray-400 uppercase tracking-widest font-bold">Código do Imóvel</h2>
                    <p className="text-2xl font-black text-gray-800">#{property.id.slice(-6).toUpperCase()}</p>
                </div>
            </header>

            {/* --- TÍTULO E LOCALIZAÇÃO --- */}
            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase rounded mb-2 border border-blue-200">
                            {property.tipo}
                        </span>
                        {property.condicaoImovel && (
                            <span className="ml-2 inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase rounded mb-2 border border-gray-200">
                                {property.condicaoImovel}
                            </span>
                        )}
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">{property.titulo}</h1>
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                            <MapPin size={18} className="text-blue-900" />
                            <span>{property.endereco ? `${property.endereco}, ` : ''}{property.bairro} - {property.cidade}</span>
                        </div>
                    </div>

                    {/* PREÇO EM DESTAQUE */}
                    <div className="text-right bg-gray-50 p-4 rounded-xl border border-gray-200 min-w-[200px]">
                        {isDual ? (
                            <div className="flex flex-col gap-2">
                                <div>
                                    <p className="text-xs uppercase font-bold text-blue-600">Venda</p>
                                    <p className="text-2xl font-black text-blue-900">{formatCurrency(property.preco)}</p>
                                </div>
                                <div className="border-t border-gray-200 pt-1">
                                    <p className="text-xs uppercase font-bold text-orange-600">Locação</p>
                                    <p className="text-xl font-black text-gray-800">{formatCurrency(property.precoLocacao || 0)} <span className="text-xs font-normal text-gray-500">/mês</span></p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-500">{property.finalidade}</p>
                                <p className="text-3xl font-black text-blue-900">{formatCurrency(property.preco)}</p>
                                {property.finalidade === 'Locação' && <p className="text-sm text-gray-500">/ {property.periodoPagamento || 'mês'}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- FOTOS (GRID) --- */}
            <div className="grid grid-cols-2 gap-4 mb-8 h-80">
                <div className="relative h-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                    {mainPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={mainPhoto} alt="Principal" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">Sem Foto</div>
                    )}
                </div>
                <div className="grid grid-rows-2 gap-4 h-full">
                    {secondaryPhotos.length > 0 ? (
                        secondaryPhotos.map((foto, idx) => (
                            <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={foto} alt={`Secundária ${idx}`} className="w-full h-full object-cover" />
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-50 rounded-xl flex items-center justify-center text-xs text-gray-400">Mais fotos no site</div>
                    )}
                </div>
            </div>

            {/* --- RESUMO DE CARACTERÍSTICAS --- */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-center">
                    <Bed className="mx-auto text-blue-900 mb-1" size={24} />
                    <span className="block font-bold text-xl">{property.quarto}</span>
                    <span className="text-xs text-gray-600 uppercase">Quartos</span>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-center">
                    <Bath className="mx-auto text-blue-900 mb-1" size={24} />
                    <span className="block font-bold text-xl">{property.suites || 0}</span>
                    <span className="text-xs text-gray-600 uppercase">Suítes</span>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-center">
                    <Car className="mx-auto text-blue-900 mb-1" size={24} />
                    <span className="block font-bold text-xl">{property.garagem}</span>
                    <span className="text-xs text-gray-600 uppercase">Vagas</span>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-center">
                    <Ruler className="mx-auto text-blue-900 mb-1" size={24} />
                    <span className="block font-bold text-xl">{property.area}</span>
                    <span className="text-xs text-gray-600 uppercase">Área Útil (m²)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* COLUNA 1: DESCRIÇÃO E DETALHES */}
                <div className="md:col-span-2 space-y-6">
                    <div className="prose text-sm text-gray-700 text-justify">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 border-b pb-1">Descrição</h3>
                        <p className="whitespace-pre-line">{property.descricao}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-1">Comodidades</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {features.map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                    <CheckCircle2 size={14} className="text-green-600" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COLUNA 2: DADOS TÉCNICOS E CONTATO */}
                <div className="space-y-6">

                    {/* Caixa de Valores Extras */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Building2 size={18} /> Custos Adicionais
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Condomínio:</span>
                                <span className="font-bold">{property.valorCondominio ? formatCurrency(property.valorCondominio) : "-"}</span>
                            </div>
                            {property.periodicidadeCondominio && (
                                <div className="text-right text-xs text-gray-400 -mt-1 mb-2">{property.periodicidadeCondominio}</div>
                            )}
                            <div className="flex justify-between border-t pt-2">
                                <span className="text-gray-600">Depósito/Caução:</span>
                                <span className="font-bold">{property.depositoSeguranca ? formatCurrency(property.depositoSeguranca) : "-"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Caixa de Detalhes Técnicos */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <h3 className="font-bold text-gray-900 mb-3">Ficha Técnica</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span className="text-gray-600">Ano Const.:</span>
                                <span className="font-medium">{property.anoConstrucao || "-"}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Área Terreno:</span>
                                <span className="font-medium">{property.areaTerreno ? `${property.areaTerreno} m²` : "-"}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Vagas Cobertas:</span>
                                <span className="font-medium">{property.vagasCobertas || 0}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Vagas Descobertas:</span>
                                <span className="font-medium">{property.vagasDescobertas || 0}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Box do Corretor */}
                    <div className="border-2 border-blue-900/10 rounded-xl p-4 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Corretor Responsável</p>
                        <p className="font-black text-lg text-blue-900">{property.corretor.name}</p>
                        {property.corretor.creci && <p className="text-sm text-gray-600 font-medium mb-3">CRECI: {property.corretor.creci}</p>}

                        <div className="flex justify-center gap-2 mt-2">
                            <div className="bg-green-100 text-green-800 p-2 rounded-full">
                                <Phone size={18} />
                            </div>
                            <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                                <Mail size={18} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- RODAPÉ DE IMPRESSÃO --- */}
            <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
                <p>Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}.</p>
                <p>As informações estão sujeitas a alterações sem aviso prévio. Consulte o corretor responsável.</p>
            </footer>
        </div>
    );
}
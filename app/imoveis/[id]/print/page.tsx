import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
    MapPin, Bed, Bath, Car, Ruler,
    Building2, Phone, Mail, Globe, Shield
} from "lucide-react";
import { PrintTrigger } from "@/components/PrintTrigger";

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

    const fotos = property.fotos ? property.fotos.split(";") : [];
    // Não precisamos mais da lista de features aqui, pois foi removida do layout
    const mainPhoto = fotos[0] || null;
    const secondaryPhotos = fotos.slice(1, 4);

    const finalidadeLower = property.finalidade?.toLowerCase() || "";
    const isDual = (finalidadeLower.includes("venda") && finalidadeLower.includes("locação")) ||
        (property.preco > 0 && (property.precoLocacao ?? 0) > 0);

    return (
        // Alterado print:p-0 para print:p-10 para evitar cortes na impressora
        <div className="bg-white min-h-screen text-black p-8 print:p-10 max-w-4xl mx-auto print:max-w-none font-sans">

            {/* --- CONTROLES (PrintTrigger) --- */}
            <div className="mb-8 print:hidden flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h1 className="text-xl font-bold text-gray-500">Visualização de Impressão</h1>
                <PrintTrigger />
            </div>

            {/* --- CABEÇALHO COMPACTO --- */}
            <header className="border-b-2 border-blue-900 pb-2 mb-4 flex justify-between items-end break-inside-avoid">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="text-2xl font-black tracking-tighter text-blue-900">
                            MATIELLO<span className="text-[#eaca42]">IMÓVEIS</span>
                        </div>
                    </div>
                    <div className="text-[10px] text-gray-500 flex flex-col">
                        <span className="flex items-center gap-1"><Globe size={10} /> www.matielloimoveis.com.br</span>
                        <span className="flex items-center gap-1"><Mail size={10} /> contato@matielloimoveis.com.br</span>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Código</h2>
                    <p className="text-lg font-black text-gray-800">#{property.id.slice(-6).toUpperCase()}</p>
                </div>
            </header>

            {/* --- TÍTULO E VALOR (LINHA ÚNICA) --- */}
            <div className="mb-4 flex justify-between items-start break-inside-avoid">
                <div className="flex-1 pr-4">
                    <div className="flex gap-2 mb-1">
                        <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold uppercase rounded border border-blue-200 print:border-gray-300 print:text-black">
                            {property.tipo}
                        </span>
                        {property.condicaoImovel && (
                            <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[9px] font-bold uppercase rounded border border-gray-200 print:border-gray-300">
                                {property.condicaoImovel}
                            </span>
                        )}
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">{property.titulo}</h1>
                    <div className="flex items-center gap-1 text-gray-600 text-xs font-medium mt-1">
                        <MapPin size={12} className="text-blue-900" />
                        <span>{property.endereco ? `${property.endereco}, ` : ''}{property.bairro} - {property.cidade}</span>
                    </div>
                </div>

                <div className="text-right min-w-[120px]">
                    {isDual ? (
                        <div className="flex flex-col items-end">
                            <p className="text-lg font-black text-blue-900 print:text-black leading-none">{formatCurrency(property.preco)}</p>
                            <p className="text-sm font-bold text-gray-600">{formatCurrency(property.precoLocacao ?? 0)} <span className="text-[10px] font-normal">/mês</span></p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-end">
                            <p className="text-xl font-black text-blue-900 print:text-black leading-none">{formatCurrency(property.preco)}</p>
                            {property.finalidade === 'Locação' && <p className="text-xs text-gray-500">/ {property.periodoPagamento || 'mês'}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* --- FOTOS (COMPACTAS) --- */}
            {/* Alturas reduzidas para caber em uma página */}
            <div className="grid grid-cols-2 gap-2 mb-4 h-64 print:block print:h-auto break-inside-avoid">
                <div className="relative h-full rounded-lg overflow-hidden border border-gray-200 bg-gray-100 print:h-[220px] print:w-full print:mb-2 print:border-black/20">
                    {mainPhoto ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={mainPhoto} alt="Principal" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">Sem Foto</div>
                    )}
                </div>
                <div className="grid grid-rows-2 gap-2 h-full print:grid-rows-1 print:grid-cols-3 print:h-[100px] print:w-full">
                    {secondaryPhotos.length > 0 ? (
                        secondaryPhotos.map((foto, idx) => (
                            <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 print:border-black/20">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={foto} alt={`Secundária ${idx}`} className="w-full h-full object-cover" />
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-50 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-gray-200">Mais fotos no site</div>
                    )}
                </div>
            </div>

            {/* --- ÍCONES (HORIZONTAL) --- */}
            {/* Layout horizontal economiza muito espaço vertical */}
            <div className="flex justify-between items-center mb-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 print:border-gray-300 break-inside-avoid">
                <div className="text-center">
                    <span className="block font-bold text-sm">{property.quarto}</span>
                    <span className="text-[9px] uppercase text-gray-500 flex items-center gap-1 justify-center"><Bed size={10} /> Quartos</span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="text-center">
                    <span className="block font-bold text-sm">{property.suites || 0}</span>
                    <span className="text-[9px] uppercase text-gray-500 flex items-center gap-1 justify-center"><Bath size={10} /> Suítes</span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="text-center">
                    <span className="block font-bold text-sm">{property.garagem}</span>
                    <span className="text-[9px] uppercase text-gray-500 flex items-center gap-1 justify-center"><Car size={10} /> Vagas</span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="text-center">
                    <span className="block font-bold text-sm">{property.area}</span>
                    <span className="text-[9px] uppercase text-gray-500 flex items-center gap-1 justify-center"><Ruler size={10} /> m² Útil</span>
                </div>
            </div>

            {/* --- LAYOUT DE DUAS COLUNAS PARA O CONTEÚDO (Economiza altura) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid print:grid-cols-3 print:gap-6">

                {/* DESCRIÇÃO (2/3 da largura) */}
                <div className="md:col-span-2 print:col-span-2 text-xs text-justify text-gray-800 leading-snug">
                    <h3 className="font-bold text-gray-900 border-b border-gray-300 mb-2 pb-1 text-sm">Descrição do Imóvel</h3>
                    <p className="whitespace-pre-line">{property.descricao}</p>
                </div>

                {/* FICHA TÉCNICA E CORRETOR (1/3 da largura) */}
                <div className="space-y-4 print:col-span-1 print:space-y-3">

                    {/* Ficha Técnica */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 print:bg-transparent print:border-gray-300">
                        <h3 className="font-bold text-gray-900 mb-2 text-xs border-b border-gray-200 pb-1">Ficha Técnica</h3>
                        <ul className="space-y-1 text-[10px]">
                            {property.anoConstrucao && <li className="flex justify-between"><span>Ano:</span> <span className="font-bold">{property.anoConstrucao}</span></li>}
                            {property.areaTerreno && <li className="flex justify-between"><span>Terreno:</span> <span className="font-bold">{property.areaTerreno} m²</span></li>}
                            <li className="flex justify-between"><span>Vagas Cobertas:</span> <span className="font-bold">{property.vagasCobertas || 0}</span></li>
                            <li className="flex justify-between"><span>Vagas Descobertas:</span> <span className="font-bold">{property.vagasDescobertas || 0}</span></li>
                        </ul>
                    </div>

                    {/* Custos Adicionais (Condomínio/IPTU) */}
                    {((property.valorCondominio ?? 0) > 0 || (property.depositoSeguranca ?? 0) > 0) && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 print:bg-transparent print:border-gray-300">
                            <h3 className="font-bold text-gray-900 mb-1 text-xs">Custos</h3>
                            <div className="space-y-1">
                                {(property.valorCondominio ?? 0) > 0 && (
                                    <div className="flex justify-between text-[10px]">
                                        <span className="flex items-center gap-1"><Building2 size={10} /> Condomínio:</span>
                                        <span className="font-bold">{formatCurrency(property.valorCondominio ?? 0)}</span>
                                    </div>
                                )}
                                {(property.depositoSeguranca ?? 0) > 0 && (
                                    <div className="flex justify-between text-[10px]">
                                        <span className="flex items-center gap-1"><Shield size={10} /> Depósito:</span>
                                        <span className="font-bold">{formatCurrency(property.depositoSeguranca ?? 0)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Corretor */}
                    <div className="border border-blue-900/20 rounded-lg p-3 text-center print:border-gray-300">
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Corretor Responsável</p>
                        <p className="font-bold text-sm text-blue-900 print:text-black">{property.corretor.name}</p>
                        {property.corretor.creci && <p className="text-[10px] text-gray-600 mb-1">CRECI: {property.corretor.creci}</p>}
                        <div className="flex justify-center gap-1 text-[10px] text-gray-600 mt-1">
                            <Phone size={10} /> <span>(11) 94600-9103</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Rodapé Compacto */}
            <footer className="mt-auto pt-4 border-t border-gray-200 text-center text-[9px] text-gray-400 break-inside-avoid">
                <p>Gerado em {new Date().toLocaleDateString('pt-BR')}. As informações estão sujeitas a alterações sem aviso prévio.</p>
            </footer>
        </div>
    );
}
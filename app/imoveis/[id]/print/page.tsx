import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
    MapPin, Bed, Bath, Car, Ruler, CheckCircle2,
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
    const features = property.features ? property.features.split(",") : [];
    const mainPhoto = fotos[0] || null;
    const secondaryPhotos = fotos.slice(1, 4);

    const finalidadeLower = property.finalidade?.toLowerCase() || "";
    const isDual = (finalidadeLower.includes("venda") && finalidadeLower.includes("locação")) ||
        (property.preco > 0 && (property.precoLocacao ?? 0) > 0);

    return (
        <div className="bg-white min-h-screen text-black p-8 print:p-0 max-w-4xl mx-auto print:max-w-none font-sans">

            {/* --- CONTROLES (PrintTrigger) --- */}
            <div className="mb-8 print:hidden flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h1 className="text-xl font-bold text-gray-500">Visualização de Impressão</h1>
                <PrintTrigger />
            </div>

            {/* --- CABEÇALHO --- */}
            <header className="border-b-2 border-blue-900 pb-4 mb-6 flex justify-between items-end break-inside-avoid">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="text-3xl font-black tracking-tighter text-blue-900">
                            MATIELLO<span className="text-[#eaca42]">IMÓVEIS</span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 flex flex-col gap-0.5">
                        <span className="flex items-center gap-1"><Globe size={10} /> www.matielloimoveis.com.br</span>
                        <span className="flex items-center gap-1"><Mail size={10} /> contato@matielloimoveis.com.br</span>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xs text-gray-400 uppercase tracking-widest font-bold">Código</h2>
                    <p className="text-xl font-black text-gray-800">#{property.id.slice(-6).toUpperCase()}</p>
                </div>
            </header>

            {/* --- INFO PRINCIPAL --- */}
            <div className="mb-6 break-inside-avoid">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded border border-blue-200 print:bg-gray-100 print:text-black print:border-gray-300">
                                {property.tipo}
                            </span>
                            {property.condicaoImovel && (
                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase rounded border border-gray-200">
                                    {property.condicaoImovel}
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{property.titulo}</h1>
                        <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                            <MapPin size={16} className="text-blue-900" />
                            <span>{property.endereco ? `${property.endereco}, ` : ''}{property.bairro} - {property.cidade}</span>
                        </div>
                    </div>

                    <div className="text-right bg-gray-50 p-3 rounded-lg border border-gray-200 min-w-[180px] break-inside-avoid print:bg-transparent print:border-black/10">
                        {isDual ? (
                            <div className="flex flex-col gap-2">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-blue-600 print:text-black">Venda</p>
                                    <p className="text-xl font-black text-blue-900 print:text-black">{formatCurrency(property.preco)}</p>
                                </div>
                                <div className="border-t border-gray-200 pt-1">
                                    <p className="text-[10px] uppercase font-bold text-orange-600 print:text-black">Locação</p>
                                    <p className="text-lg font-bold text-gray-800">{formatCurrency(property.precoLocacao ?? 0)} <span className="text-[10px] font-normal text-gray-500">/mês</span></p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-500">{property.finalidade}</p>
                                <p className="text-2xl font-black text-blue-900 print:text-black">{formatCurrency(property.preco)}</p>
                                {property.finalidade === 'Locação' && <p className="text-xs text-gray-500">/ {property.periodoPagamento || 'mês'}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- FOTOS (GRID OTIMIZADO) --- */}
            {/* Mantemos 'h-80' para tela, mas usamos 'h-auto' e 'block' para impressão para não fixar altura */}
            <div className="grid grid-cols-2 gap-4 mb-8 h-80 print:block print:h-auto break-inside-avoid">
                <div className="relative h-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100 print:h-64 print:mb-4 print:border-black/20">
                    {mainPhoto ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={mainPhoto} alt="Principal" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">Sem Foto</div>
                    )}
                </div>
                <div className="grid grid-rows-2 gap-4 h-full print:grid-rows-1 print:grid-cols-3 print:h-32">
                    {secondaryPhotos.length > 0 ? (
                        secondaryPhotos.map((foto, idx) => (
                            <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 print:border-black/20">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={foto} alt={`Secundária ${idx}`} className="w-full h-full object-cover" />
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-50 rounded-xl flex items-center justify-center text-xs text-gray-400 border border-gray-200">Mais fotos no site</div>
                    )}
                </div>
            </div>

            {/* --- ESPAÇADOR PARA EVITAR SOBREPOSIÇÃO --- */}
            <div className="hidden print:block h-8"></div>

            {/* --- ICONES --- */}
            <div className="grid grid-cols-4 gap-4 mb-8 break-inside-avoid">
                <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-center print:bg-transparent print:border-gray-300">
                    <Bed className="mx-auto text-blue-900 mb-1 print:text-black" size={20} />
                    <span className="block font-bold text-lg">{property.quarto}</span>
                    <span className="text-[10px] text-gray-600 uppercase">Quartos</span>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-center print:bg-transparent print:border-gray-300">
                    <Bath className="mx-auto text-blue-900 mb-1 print:text-black" size={20} />
                    <span className="block font-bold text-lg">{property.suites || 0}</span>
                    <span className="text-[10px] text-gray-600 uppercase">Suítes</span>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-center print:bg-transparent print:border-gray-300">
                    <Car className="mx-auto text-blue-900 mb-1 print:text-black" size={20} />
                    <span className="block font-bold text-lg">{property.garagem}</span>
                    <span className="text-[10px] text-gray-600 uppercase">Vagas</span>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-center print:bg-transparent print:border-gray-300">
                    <Ruler className="mx-auto text-blue-900 mb-1 print:text-black" size={20} />
                    <span className="block font-bold text-lg">{property.area}</span>
                    <span className="text-[10px] text-gray-600 uppercase">m² Útil</span>
                </div>
            </div>

            {/* --- CONTEÚDO PRINCIPAL EM BLOCO VERTICAL PARA IMPRESSÃO --- */}
            {/* Alteração crítica: 'print:block' em vez de grid para forçar um abaixo do outro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:block">

                {/* DESCRIÇÃO - VAI PRIMEIRO */}
                <div className="md:col-span-2 space-y-6 print:mb-8 break-inside-avoid">
                    <div className="prose text-sm text-gray-800 text-justify leading-relaxed">
                        <h3 className="text-base font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">Descrição do Imóvel</h3>
                        <p className="whitespace-pre-line">{property.descricao}</p>
                    </div>

                    <div className="pt-4">
                        <h3 className="text-base font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Comodidades & Diferenciais</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {features.map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                                    <CheckCircle2 size={12} className="text-green-600 print:text-black" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FICHA TÉCNICA E VALORES - VAI DEPOIS NA IMPRESSÃO */}
                {/* Alteração: print:grid print:grid-cols-2 para ficar lado a lado embaixo do texto */}
                <div className="space-y-6 print:grid print:grid-cols-2 print:gap-6 print:space-y-0 break-inside-avoid">

                    {/* Coluna 1: Valores e Ficha */}
                    <div className="space-y-6 print:col-span-1">
                        {/* Valores Extras */}
                        {((property.valorCondominio ?? 0) > 0 || (property.depositoSeguranca ?? 0) > 0) && (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 print:bg-transparent print:border-gray-300">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                                    <Building2 size={16} /> Custos Adicionais
                                </h3>
                                <div className="space-y-2 text-xs">
                                    {(property.valorCondominio ?? 0) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Condomínio:</span>
                                            <span className="font-bold">{formatCurrency(property.valorCondominio ?? 0)}</span>
                                        </div>
                                    )}
                                    {property.periodicidadeCondominio && (
                                        <div className="text-right text-[10px] text-gray-400 -mt-1 mb-2">{property.periodicidadeCondominio}</div>
                                    )}
                                    {(property.depositoSeguranca ?? 0) > 0 && (
                                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Shield size={12} />
                                                <span>Depósito:</span>
                                            </div>
                                            <span className="font-bold">{formatCurrency(property.depositoSeguranca ?? 0)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Ficha Técnica */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 print:bg-transparent print:border-gray-300">
                            <h3 className="font-bold text-gray-900 mb-3 text-sm">Ficha Técnica</h3>
                            <ul className="space-y-2 text-xs">
                                <li className="flex justify-between border-b border-gray-100 pb-1">
                                    <span className="text-gray-600">Ano Construção:</span>
                                    <span className="font-medium">{property.anoConstrucao || "-"}</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-100 pb-1">
                                    <span className="text-gray-600">Área Terreno:</span>
                                    <span className="font-medium">{property.areaTerreno ? `${property.areaTerreno} m²` : "-"}</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-100 pb-1">
                                    <span className="text-gray-600">Vagas Cobertas:</span>
                                    <span className="font-medium">{property.vagasCobertas || 0}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-600">Vagas Descobertas:</span>
                                    <span className="font-medium">{property.vagasDescobertas || 0}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Coluna 2: Corretor */}
                    <div className="print:col-span-1">
                        <div className="border-2 border-blue-900/10 rounded-xl p-4 text-center h-full flex flex-col justify-center print:border-gray-300">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Corretor Responsável</p>
                            <p className="font-black text-base text-blue-900 print:text-black">{property.corretor.name}</p>
                            {property.corretor.creci && <p className="text-xs text-gray-600 font-medium mb-3">CRECI: {property.corretor.creci}</p>}

                            <div className="flex justify-center gap-3 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Phone size={14} />
                                    <span>(11) 94600-9103</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-[10px] text-gray-400 break-inside-avoid">
                <p>Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}.</p>
                <p>As informações estão sujeitas a alterações sem aviso prévio. Consulte o corretor responsável para confirmar disponibilidade e valores.</p>
            </footer>
        </div>
    );
}
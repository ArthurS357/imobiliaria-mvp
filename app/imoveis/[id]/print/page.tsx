import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Bed, Bath, Car, Maximize, Mail, Globe, CheckCircle2, Ruler, Calendar, Shield, Building } from "lucide-react";
import { PrintTrigger } from "@/components/PrintTrigger";

export default async function PrintPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Busca dados completos
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            corretor: {
                select: {
                    name: true,
                    email: true,
                    creci: true,
                }
            }
        }
    });

    if (!property) return notFound();

    // Tratamento de imagens e listas
    const fotoPrincipal = property.fotos ? property.fotos.split(";")[0] : null;
    const fotosSecundarias = property.fotos ? property.fotos.split(";").slice(1, 4) : [];
    const features = property.features ? property.features.split(",") : [];

    // QR Code
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://matielloimoveis.vercel.app";
    const propertyUrl = `${baseUrl}/imoveis/${property.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(propertyUrl)}&bgcolor=ffffff`;

    return (
        <div className="bg-gray-100 min-h-screen text-gray-900 font-sans print:bg-white">

            {/* ÁREA DE CONTROLE (Não sai na impressão) */}
            <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[210mm] mx-auto p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="font-bold text-gray-800">Visualização de Ficha</h1>
                        <p className="text-sm text-gray-500">Layout otimizado para impressão A4 ou salvar como PDF.</p>
                    </div>
                    <PrintTrigger />
                </div>
            </div>

            {/* FOLHA A4 */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none my-8 print:my-0 overflow-hidden relative">

                {/* CABEÇALHO AZUL */}
                <header className="bg-blue-900 text-white p-8 flex justify-between items-center print:p-6">
                    {/* Lado Esquerdo: Logo e Nome */}
                    <div className="flex items-center gap-5">
                        <img src="/logo.png" alt="Matiello Imóveis" className="h-14 w-auto object-contain" />
                        <div className="h-12 w-0.5 bg-blue-700/50"></div>
                        <div>
                            <h2 className="text-xl font-bold leading-none tracking-tight">MATIELLO</h2>
                            <span className="text-sm font-normal text-blue-200 tracking-widest">IMÓVEIS</span>
                        </div>
                    </div>

                    {/* Lado Direito: Preço e Status */}
                    <div className="text-right">
                        <div className="flex flex-col items-end gap-1 mb-1">
                            <span className="bg-blue-800 text-blue-200 text-[10px] uppercase font-bold px-2 py-1 rounded">
                                {property.finalidade || "Venda"} - {property.tipo}
                            </span>
                            {property.status !== 'DISPONIVEL' && (
                                <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                                    {property.status}
                                </span>
                            )}
                        </div>

                        <p className="text-xs text-blue-300 uppercase font-bold mb-0.5">
                            {property.tipoValor || "Valor"}
                        </p>
                        <p className="text-3xl md:text-4xl font-extrabold text-white leading-none flex items-baseline justify-end gap-1">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                            {property.finalidade === 'Locação' && property.periodoPagamento && (
                                <span className="text-lg font-medium opacity-80">/{property.periodoPagamento}</span>
                            )}
                        </p>
                    </div>
                </header>

                {/* CONTEÚDO DA FICHA */}
                <div className="p-8 print:p-6">

                    {/* TÍTULO E LOCALIZAÇÃO */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 uppercase mb-2 leading-tight">{property.titulo}</h1>
                        <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                            <MapPin size={18} className="text-blue-900 shrink-0" />
                            <span>{property.bairro}, {property.cidade}</span>
                            {property.endereco && <span className="text-gray-500 font-normal">| {property.endereco}</span>}
                        </div>
                    </div>

                    {/* GRID DE FOTOS */}
                    <div className="grid grid-cols-4 gap-2 mb-8 h-[300px] rounded-xl overflow-hidden border border-gray-100">
                        <div className="col-span-3 h-full relative bg-gray-100">
                            {fotoPrincipal ? (
                                <img src={fotoPrincipal} alt="Principal" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">Sem foto principal</div>
                            )}
                        </div>
                        <div className="col-span-1 flex flex-col gap-2 h-full">
                            {fotosSecundarias.map((foto, idx) => (
                                <div key={idx} className="flex-1 overflow-hidden bg-gray-100 relative">
                                    <img src={foto} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            {Array.from({ length: 3 - fotosSecundarias.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="flex-1 bg-gray-50 flex items-center justify-center text-gray-300 text-xs">Foto {i + 2}</div>
                            ))}
                        </div>
                    </div>

                    {/* CARACTERÍSTICAS (Grid de 5 colunas para caber Suítes) */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-8 print:bg-gray-50 print:border-gray-200">
                        <div className="grid grid-cols-5 gap-2 text-center divide-x divide-blue-200 print:divide-gray-200">
                            <div className="px-1">
                                <Bed className="mx-auto text-blue-900 mb-1 h-5 w-5" />
                                <span className="block text-lg font-extrabold text-gray-900">{property.quarto}</span>
                                <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Dormitórios</span>
                            </div>
                            <div className="px-1">
                                <Bath className="mx-auto text-blue-900 mb-1 h-5 w-5" />
                                <span className="block text-lg font-extrabold text-gray-900">{property.suites || 0}</span>
                                <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Suítes</span>
                            </div>
                            <div className="px-1">
                                <div className="mx-auto text-blue-900 mb-1 h-5 w-5 flex items-center justify-center font-bold border-2 border-blue-900 rounded-full text-[10px]">WC</div>
                                <span className="block text-lg font-extrabold text-gray-900">{property.banheiro}</span>
                                <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Banheiros</span>
                            </div>
                            <div className="px-1">
                                <Car className="mx-auto text-blue-900 mb-1 h-5 w-5" />
                                <span className="block text-lg font-extrabold text-gray-900">{property.garagem}</span>
                                <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Vagas</span>
                            </div>
                            <div className="px-1">
                                <Maximize className="mx-auto text-blue-900 mb-1 h-5 w-5" />
                                <span className="block text-lg font-extrabold text-gray-900">{property.area} <span className="text-xs font-normal">m²</span></span>
                                <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Área Útil</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        {/* Coluna Esquerda: Descrição e Checklist */}
                        <div className="col-span-2">
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-blue-900 uppercase border-b-2 border-blue-900/10 pb-2 mb-3 tracking-wider">Sobre o Imóvel</h3>
                                {property.sobreTitulo && (
                                    <h4 className="font-bold text-gray-800 mb-2 text-base">{property.sobreTitulo}</h4>
                                )}
                                <p className="text-gray-700 text-sm leading-relaxed text-justify whitespace-pre-line">
                                    {property.descricao}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-blue-900 uppercase border-b-2 border-blue-900/10 pb-2 mb-3 tracking-wider">Diferenciais</h3>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                    {features.slice(0, 12).map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                                            <CheckCircle2 size={12} className="text-green-600 shrink-0" /> {item}
                                        </div>
                                    ))}
                                    {features.length > 12 && (
                                        <div className="text-xs text-gray-500 italic mt-1 col-span-2">...e muito mais.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Coluna Direita: Ficha Técnica e Contato */}
                        <div className="col-span-1 space-y-6">

                            {/* Ficha Técnica */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs space-y-3">
                                <h3 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                                    <Building size={16} /> Ficha Técnica
                                </h3>

                                {property.anoConstrucao && (
                                    <div className="flex justify-between border-b border-gray-200 pb-1">
                                        <span className="text-gray-500">Ano Const.</span>
                                        <span className="font-bold text-gray-800">{property.anoConstrucao}</span>
                                    </div>
                                )}
                                {property.areaTerreno && (
                                    <div className="flex justify-between border-b border-gray-200 pb-1">
                                        <span className="text-gray-500">Área Terreno</span>
                                        <span className="font-bold text-gray-800">{property.areaTerreno} m²</span>
                                    </div>
                                )}
                                {property.condicaoImovel && (
                                    <div className="flex justify-between border-b border-gray-200 pb-1">
                                        <span className="text-gray-500">Condição</span>
                                        <span className="font-bold text-gray-800">{property.condicaoImovel}</span>
                                    </div>
                                )}
                                {(property.vagasCobertas > 0 || property.vagasDescobertas > 0) && (
                                    <div className="flex justify-between border-b border-gray-200 pb-1 flex-col gap-1">
                                        <span className="text-gray-500">Detalhe Vagas</span>
                                        <span className="font-bold text-gray-800 text-[10px]">
                                            {property.vagasCobertas} Cob. / {property.vagasDescobertas} Desc.
                                            {property.vagasSubsolo ? ' (Subsolo)' : ''}
                                        </span>
                                    </div>
                                )}

                                {/* Custos Adicionais */}
                                {(property.valorCondominio ?? 0) > 0 && (
                                    <div className="flex justify-between pt-1 text-blue-900">
                                        <span>Condomínio</span>
                                        <span className="font-bold">R$ {property.valorCondominio}</span>
                                    </div>
                                )}
                            </div>

                            {/* Box do Corretor */}
                            <div className="border-2 border-blue-900 rounded-xl p-4 text-center break-inside-avoid">
                                <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">Para mais informações</p>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold text-lg mx-auto mb-2">
                                    {property.corretor.name.charAt(0)}
                                </div>
                                <h3 className="font-bold text-sm text-blue-900 line-clamp-1">{property.corretor.name}</h3>
                                {property.corretor.creci && <p className="text-[10px] text-gray-500 mb-3">CRECI: {property.corretor.creci}</p>}

                                <div className="space-y-1 text-xs">
                                    <div className="flex items-center justify-center gap-1 text-gray-700 truncate">
                                        <Mail size={12} /> {property.corretor.email}
                                    </div>
                                    <div className="flex items-center justify-center gap-1 text-gray-900 font-bold mt-2 bg-gray-100 py-1 rounded">
                                        (11) 99999-9999
                                    </div>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="text-center">
                                <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20 mx-auto mb-1" />
                                <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                                    <Globe size={10} /> matielloimoveis.com.br
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rodapé Fixo */}
                <div className="absolute bottom-0 w-full border-t border-gray-200 py-2 text-center bg-white">
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest">Documento gerado em {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
            </div>
        </div>
    );
}
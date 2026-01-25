import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Bed, Bath, Car, Maximize, Mail, Globe } from "lucide-react";
import { PrintTrigger } from "@/components/PrintTrigger";

export default async function PrintPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Busca dados completos, incluindo o corretor com CRECI
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

    // Tratamento de imagens
    const fotoPrincipal = property.fotos ? property.fotos.split(";")[0] : null;
    const fotosSecundarias = property.fotos ? property.fotos.split(";").slice(1, 4) : [];

    // QR Code
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://matielloimoveis.vercel.app";
    const propertyUrl = `${baseUrl}/imoveis/${property.id}`;
    // Usando uma API pública confiável para gerar o QR Code
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

                {/* CABEÇALHO AZUL (Corrigido para destacar a logo branca) */}
                {/* As margens negativas (-mx e -mt) servem para o cabeçalho encostar nas bordas do papel */}
                <header className="bg-blue-900 text-white p-8 flex justify-between items-center print:p-6">
                    {/* Lado Esquerdo: Logo e Nome */}
                    <div className="flex items-center gap-5">
                        {/* Logo Branca */}
                        <img src="/logo.png" alt="Matiello Imóveis" className="h-14 w-auto object-contain" />

                        {/* Separador */}
                        <div className="h-12 w-0.5 bg-blue-700/50"></div>

                        {/* Nome */}
                        <div>
                            <h2 className="text-xl font-bold leading-none tracking-tight">MATIELLO</h2>
                            <span className="text-sm font-normal text-blue-200 tracking-widest">IMÓVEIS</span>
                        </div>
                    </div>

                    {/* Lado Direito: Preço */}
                    <div className="text-right">
                        <span className="inline-block bg-blue-800 text-blue-200 text-[10px] uppercase font-bold px-2 py-1 rounded mb-1">
                            {property.tipo} {property.status === 'VENDIDO' ? '(Vendido)' : ''}
                        </span>
                        <p className="text-3xl md:text-4xl font-extrabold text-white leading-none">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
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

                    {/* GRID DE FOTOS (1 Grande + 3 Pequenas) */}
                    <div className="grid grid-cols-4 gap-2 mb-8 h-[350px] rounded-xl overflow-hidden border border-gray-100">
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
                            {/* Preenchimento se faltar fotos */}
                            {Array.from({ length: 3 - fotosSecundarias.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="flex-1 bg-gray-50 flex items-center justify-center text-gray-300 text-xs">Foto {i + 2}</div>
                            ))}
                        </div>
                    </div>

                    {/* CARACTERÍSTICAS (Ícones) */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-8 print:bg-gray-50 print:border-gray-200">
                        <div className="grid grid-cols-4 gap-4 text-center divide-x divide-blue-200 print:divide-gray-200">
                            <div className="px-2">
                                <Maximize className="mx-auto text-blue-900 mb-2 h-5 w-5" />
                                <span className="block text-xl font-extrabold text-gray-900">{property.area} <span className="text-sm font-normal text-gray-500">m²</span></span>
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Área Útil</span>
                            </div>
                            <div className="px-2">
                                <Bed className="mx-auto text-blue-900 mb-2 h-5 w-5" />
                                <span className="block text-xl font-extrabold text-gray-900">{property.quarto}</span>
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Quartos</span>
                            </div>
                            <div className="px-2">
                                <Bath className="mx-auto text-blue-900 mb-2 h-5 w-5" />
                                <span className="block text-xl font-extrabold text-gray-900">{property.banheiro}</span>
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Banheiros</span>
                            </div>
                            <div className="px-2">
                                <Car className="mx-auto text-blue-900 mb-2 h-5 w-5" />
                                <span className="block text-xl font-extrabold text-gray-900">{property.garagem}</span>
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Vagas</span>
                            </div>
                        </div>
                    </div>

                    {/* DESCRIÇÃO */}
                    <div className="mb-10 break-inside-avoid">
                        <h3 className="text-sm font-bold text-blue-900 uppercase border-b-2 border-blue-900/10 pb-2 mb-4 tracking-wider">Detalhes do Imóvel</h3>
                        {/* Usando colunas para melhor leitura em papel */}
                        <p className="text-gray-700 text-sm leading-relaxed text-justify whitespace-pre-line columns-2 gap-8 font-medium">
                            {property.descricao}
                        </p>
                    </div>

                </div>

                {/* RODAPÉ (Fixo na parte inferior da folha) */}
                <div className="bg-gray-50 p-6 print:p-6 border-t border-gray-200 break-inside-avoid absolute bottom-0 w-full">
                    <div className="flex justify-between items-center">

                        {/* Dados do Corretor */}
                        <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 bg-white border-2 border-blue-900 rounded-full flex items-center justify-center text-blue-900 font-bold text-xl shadow-sm print:border-gray-300 print:text-gray-700">
                                {property.corretor.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] text-blue-900 uppercase font-extrabold tracking-wider mb-0.5">Corretor Responsável</p>
                                <p className="text-lg font-bold text-gray-900 leading-tight">{property.corretor.name}</p>
                                <div className="text-sm text-gray-600 font-medium space-y-0.5 mt-1">
                                    {property.corretor.creci && <p className="text-blue-800 font-bold">CRECI: {property.corretor.creci}</p>}
                                    <p className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> {property.corretor.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* QR Code e Site */}
                        <div className="flex items-center gap-4 text-right">
                            <div className="hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">Acesse mais fotos e detalhes</p>
                                <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                                    <Globe size={12} /> www.matielloimoveis.com.br
                                </p>
                            </div>
                            <div className="bg-white p-1 rounded border border-gray-200 shrink-0">
                                <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />
                            </div>
                        </div>
                    </div>
                    {/* Linha final */}
                    <div className="mt-4 pt-2 border-t border-gray-200/50 text-center">
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest">Documento gerado em {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
                {/* Espaço para garantir que o conteúdo não fique atrás do rodapé absoluto */}
                <div className="h-[120px] print:h-[120px] w-full invisible"></div>

            </div>
        </div>
    );
}
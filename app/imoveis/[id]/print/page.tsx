import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Bed, Bath, Car, Maximize, Phone, Mail } from "lucide-react";
import { PrintTrigger } from "@/components/PrintTrigger"; // <--- Importe o novo componente

export default async function PrintPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const property = await prisma.property.findUnique({
        where: { id },
        include: { corretor: true }
    });

    if (!property) return notFound();

    const fotoPrincipal = property.fotos ? property.fotos.split(";")[0] : null;
    const fotosSecundarias = property.fotos ? property.fotos.split(";").slice(1, 4) : [];

    return (
        <div className="bg-white min-h-screen text-gray-900 p-8 max-w-[210mm] mx-auto print:p-0 print:max-w-none">

            {/* Botão para Imprimir (some na impressão) */}
            <div className="mb-8 print:hidden flex justify-between items-center bg-gray-100 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">Este é o modo de visualização para impressão (A4).</p>

                {/* Usamos o componente Client aqui para não dar erro */}
                <PrintTrigger />
            </div>

            {/* CABEÇALHO */}
            <header className="border-b-4 border-blue-900 pb-6 mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">{property.titulo}</h1>
                    <p className="text-gray-500 flex items-center gap-2 mt-2 text-lg">
                        <MapPin size={20} /> {property.bairro}, {property.cidade}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Valor de Venda</p>
                    <p className="text-4xl font-extrabold text-blue-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                    </p>
                </div>
            </header>

            {/* IMAGEM PRINCIPAL */}
            {fotoPrincipal && (
                <div className="w-full h-96 bg-gray-200 mb-6 rounded-lg overflow-hidden border border-gray-100 relative print:h-[300px]">
                    {/* Usamos img normal para garantir impressão correta em todos navegadores */}
                    <img src={fotoPrincipal} alt="Capa" className="w-full h-full object-cover" />
                </div>
            )}

            {/* GRID DE CARACTERÍSTICAS */}
            <div className="grid grid-cols-4 gap-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100 print:bg-white print:border-y print:border-x-0 print:rounded-none">
                <div className="text-center">
                    <Bed className="mx-auto text-blue-900 mb-2" size={32} />
                    <span className="block text-2xl font-bold">{property.quarto}</span>
                    <span className="text-xs uppercase text-gray-500 font-bold">Quartos</span>
                </div>
                <div className="text-center border-l border-gray-200">
                    <Bath className="mx-auto text-blue-900 mb-2" size={32} />
                    <span className="block text-2xl font-bold">{property.banheiro}</span>
                    <span className="text-xs uppercase text-gray-500 font-bold">Banheiros</span>
                </div>
                <div className="text-center border-l border-gray-200">
                    <Car className="mx-auto text-blue-900 mb-2" size={32} />
                    <span className="block text-2xl font-bold">{property.garagem}</span>
                    <span className="text-xs uppercase text-gray-500 font-bold">Vagas</span>
                </div>
                <div className="text-center border-l border-gray-200">
                    <Maximize className="mx-auto text-blue-900 mb-2" size={32} />
                    <span className="block text-2xl font-bold">{property.area}</span>
                    <span className="text-xs uppercase text-gray-500 font-bold">m² Útil</span>
                </div>
            </div>

            {/* DESCRIÇÃO E FOTOS SECUNDÁRIAS */}
            <div className="grid grid-cols-3 gap-8 mb-8">
                <div className="col-span-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Sobre o Imóvel</h2>
                    <p className="text-gray-600 text-justify leading-relaxed text-sm whitespace-pre-line font-medium">
                        {property.descricao}
                    </p>
                </div>
                <div className="col-span-1 space-y-4">
                    {fotosSecundarias.map((foto, idx) => (
                        <div key={idx} className="h-32 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                            <img src={foto} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* RODAPÉ COM CONTATO DO CORRETOR */}
            <footer className="mt-auto border-t-2 border-gray-200 pt-6 flex items-center justify-between bg-gray-50 p-6 rounded-xl print:bg-transparent print:p-0 print:mt-10 break-inside-avoid">
                <div>
                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Responsável pelo Imóvel</p>
                    <p className="text-xl font-bold text-blue-900">{property.corretor.name}</p>
                    <p className="text-sm text-gray-600">CRECI: 12345-F</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="flex items-center justify-end gap-2 text-gray-700 font-medium">
                        <Mail size={16} /> {property.corretor.email}
                    </p>
                    <p className="flex items-center justify-end gap-2 text-gray-700 font-medium">
                        <Phone size={16} /> (11) 99999-9999
                    </p>
                </div>
            </footer>

            <div className="text-center mt-8 text-xs text-gray-300 print:fixed print:bottom-4 print:left-0 print:w-full">
                Gerado automaticamente pelo sistema Imobiliária MVP em {new Date().toLocaleDateString('pt-BR')}
            </div>
        </div>
    );
}
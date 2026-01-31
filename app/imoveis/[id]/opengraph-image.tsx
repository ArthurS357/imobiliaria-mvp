import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const alt = 'Detalhes do Imóvel - Matiello Imóveis';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Função auxiliar para formatar moeda (BRL)
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
    }).format(value);
};

export default async function Image({ params }: { params: { id: string } }) {
    // 1. Buscar dados do imóvel no banco
    const property = await prisma.property.findUnique({
        where: { id: params.id },
        select: {
            titulo: true,
            preco: true,
            cidade: true,
            bairro: true,
            fotos: true,
            finalidade: true
        }
    });

    // Fallback se o imóvel não existir (ou imagem global será usada)
    if (!property) {
        return new Response('Imóvel não encontrado', { status: 404 });
    }

    // 2. Processar a imagem principal
    const rawFotos = property.fotos ? property.fotos.split(';') : [];
    // Pega a primeira foto ou uma imagem de placeholder se não tiver fotos
    const bgImage = rawFotos.length > 0 ? rawFotos[0] : 'https://matielloimoveis.com.br/placeholder-house.jpg';

    // Tenta usar a imagem com marca d'água se sua função getWatermarkedImage gerar URLs públicas acessíveis. 
    // Para garantir, vamos usar a imagem raw que o Vercel OG consegue baixar mais facilmente.

    const isLocacao = property.finalidade === 'Locação';
    const precoFormatado = formatCurrency(Number(property.preco));

    return new ImageResponse(
        (
            // Container Principal (Usa a foto como background)
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end', // Conteúdo no final (fundo)
                    backgroundColor: '#1e3a8a', // Cor de fundo caso a imagem falhe
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Camada da Imagem de Fundo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={bgImage}
                    alt={property.titulo}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                    }}
                />

                {/* Overlay Gradiente para garantir leitura do texto */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
                }} />

                {/* Conteúdo de Texto (Fica sobre o gradiente) */}
                <div style={{
                    padding: '40px 60px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    color: 'white',
                    position: 'relative', // Z-index implícito maior que o overlay
                    zIndex: 10
                }}>

                    {/* Badge de Finalidade */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: isLocacao ? '#ea580c' : '#1d4ed8', // Laranja para locação, Azul para venda
                        padding: '8px 16px',
                        borderRadius: '50px',
                        fontSize: 20,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        width: 'fit-content',
                        marginBottom: '10px'
                    }}>
                        {property.finalidade}
                    </div>

                    {/* Título do Imóvel */}
                    <div style={{
                        fontSize: 48,
                        fontWeight: 800,
                        lineHeight: 1.1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        maxWidth: '90%'
                    }}>
                        {property.titulo}
                    </div>

                    {/* Localização */}
                    <div style={{ fontSize: 28, opacity: 0.9, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#eaca42" stroke="none">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3" fill="white"></circle>
                        </svg>
                        {property.bairro}, {property.cidade}
                    </div>

                    {/* Preço em Destaque */}
                    <div style={{
                        fontSize: 64,
                        fontWeight: 900,
                        color: '#eaca42', // Cor dourada
                        marginTop: '10px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                        {precoFormatado}
                        {isLocacao && <span style={{ fontSize: 30, color: 'white', marginLeft: '10px' }}>/mês</span>}
                    </div>
                </div>

                {/* Marca da Imobiliária no canto superior direito */}
                <div style={{ position: 'absolute', top: 40, right: 40, display: 'flex', alignItems: 'center', gap: '10px', zIndex: 20 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Matiello Imóveis</div>
                </div>

            </div>
        ),
        { ...size }
    );
}
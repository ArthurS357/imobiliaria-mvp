import { ImageResponse } from 'next/og';

// Configurações da imagem
export const alt = 'Matiello Imóveis - Excelência em Arujá e Região';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Otimização: Roda na borda para ser super rápido
export const runtime = 'edge';

// Função que gera a imagem usando JSX/CSS (flexbox)
export default async function Image() {
    // Podemos carregar fontes personalizadas aqui se necessário, 
    // mas para simplificar vamos usar a fonte do sistema por enquanto.

    return new ImageResponse(
        (
            // Container Principal (Fundo Azul Escuro com Gradiente)
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(to bottom right, #1e3a8a, #172554)', // blue-900 to darker blue
                    color: 'white',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Simulação de Logo/Ícone */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        marginBottom: '20px',
                        border: '2px solid #eaca42' // Cor dourada do seu design
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#eaca42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </div>

                {/* Título Principal */}
                <div style={{ fontSize: 60, fontWeight: 800, letterSpacing: '-0.025em', textAlign: 'center' }}>
                    Matiello Imóveis
                </div>

                {/* Subtítulo */}
                <div style={{ fontSize: 30, marginTop: 20, opacity: 0.8, textAlign: 'center', maxWidth: '800px' }}>
                    Encontre o lugar onde sua vida acontece em Arujá e região.
                </div>

                {/* "Rodapé" da imagem */}
                <div style={{ position: 'absolute', bottom: 40, display: 'flex', alignItems: 'center', gap: '10px', fontSize: 20, opacity: 0.6 }}>
                    <div style={{ width: '10px', height: '10px', background: '#eaca42', borderRadius: '50%' }} />
                    matielloimoveis.com.br
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
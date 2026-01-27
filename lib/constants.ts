// lib/constants.ts

export const PROPERTY_TYPES = [
    "Casa",
    "Apartamento",
    "Terreno",
    "Comercial",
    "Sítio/Chácara",
    "Galpão",
    "Loja",
    "Sobrado",
    "Cobertura",
    "Studio/Flat",
    "Lote em Condomínio"
];

// Lista organizada por categorias para exibição no Front-end
export const PROPERTY_FEATURES_CATEGORIZED = [
    {
        category: "Lazer e Bem-estar",
        features: [
            "Piscina", "Piscina Aquecida", "Piscina Infantil", "Raia Olímpica",
            "Churrasqueira", "Forno de Pizza", "Espaço Gourmet", "Salão de Festas",
            "Salão de Jogos", "Brinquedoteca", "Playground", "Quadra Poliesportiva",
            "Quadra de Tênis", "Campo de Futebol", "Quadra de Squash", "Sauna",
            "Spa/Hidromassagem", "Ofurô", "Academia/Fitness", "Espaço Zen",
            "Cinema/Home Theater", "Pista de Cooper"
        ]
    },
    {
        category: "Infraestrutura do Condomínio",
        features: [
            "Elevador", "Elevador de Serviço", "Elevador Privativo", "Gerador de Energia",
            "Acessibilidade (PCD)", "Rampa de Acesso", "Bicicletário",
            "Carregador de Carro Elétrico", "Coworking", "Lavanderia Coletiva",
            "Mini Mercado", "Restaurante/Café", "Espaço Pet/Pet Place", "Área Verde/Jardim",
            "Heliponto", "Vaga para Visitantes"
        ]
    },
    {
        category: "Segurança",
        features: [
            "Portaria 24h", "Portaria Remota", "Guarita Blindada", "Portão Eletrônico",
            "Controle de Acesso Facial/Biometria", "Câmeras de Segurança", "Monitoramento 24h",
            "Ronda/Vigilância", "Interfone", "Cerca Elétrica", "Alarme", "Fechadura Digital"
        ]
    },
    {
        category: "Conforto e Diferenciais (Interno)",
        features: [
            "Ar Condicionado", "Preparação para Ar Condicionado", "Aquecimento a Gás",
            "Aquecimento Solar", "Lareira", "Mobiliado", "Armários Planejados", "Closet",
            "Home Office", "Varanda/Sacada", "Varanda Gourmet", "Cortina de Vidro",
            "Cozinha Americana", "Despensa", "Lavabo", "Área de Serviço",
            "Dependência de Empregada", "Depósito Privativo", "Isolamento Acústico"
        ]
    },
    {
        category: "Acabamento e Localização",
        features: [
            "Piso Porcelanato", "Piso de Madeira/Laminado", "Piso Vinílico",
            "Teto Rebaixado (Gesso)", "Iluminação em LED", "Box Blindex", "Pé Direito Alto",
            "Vista Panorâmica", "Vista para o Mar", "Vista para Montanha",
            "Sol da Manhã", "Sol da Tarde", "Andar Alto", "Andar Baixo", "Frente para Rua"
        ]
    }
];

// Lista achatada (Flat) para validações e uso geral
export const PROPERTY_FEATURES = PROPERTY_FEATURES_CATEGORIZED.flatMap(c => c.features);
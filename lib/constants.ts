// Tipos de propriedade organizados por categoria (Para uso em <optgroup>)

export const PROPERTY_TYPES_CATEGORIZED = [

    {

        label: "Residencial",

        types: [

            "Casa",

            "Casa de Condomínio",

            "Apartamento",

            "Cobertura",

            "Studio/Flat",

            "Duplex/Triplex",

            "Terreno",

            "Terreno em Condomínio",

            "Sítio/Chácara",

            "Kitnet",

        ]

    },

    {

        label: "Comercial / Industrial",

        types: [

            "Galpão",

            "Sala",

            "Terreno Comercial",

            "Prédio Comercial",

            "Área Industrial"

        ]

    },

    {

        label: "Rural",

        types: [

            "Chácara",

            "Fazenda",

            "Sítio",

            "Chalé"

        ]

    }

];



// Lista achatada para compatibilidade com o resto do sistema (Selects simples, validações)

export const PROPERTY_TYPES = PROPERTY_TYPES_CATEGORIZED.flatMap(category => category.types);



// Lista organizada por categorias para exibição no Front-end (Checklist de Features)

export const PROPERTY_FEATURES_CATEGORIZED = [

    {

        category: "Lazer e Bem-estar",

        features: [

            "Piscina", "Piscina Aquecida", "Piscina Infantil", "Piscina com Raia", "Piscina de Borda Infinita",

            "Churrasqueira", "Forno de Pizza", "Espaço Gourmet", "Salão de Festas",

            "Salão de Jogos", "Brinquedoteca", "Playground", "Quadra Poliesportiva",

            "Quadra de Tênis", "Quadra de Beach Tennis", "Campo de Futebol", "Quadra de Squash",

            "Sauna", "Spa/Hidromassagem", "Ofurô", "Academia/Fitness", "Espaço Zen",

            "Cinema/Home Theater", "Pista de Cooper", "Redário", "Horta Comunitária", "Rooftop"

        ]

    },

    {

        category: "Infraestrutura do Condomínio",

        features: [

            "Elevador", "Elevador de Serviço", "Elevador Privativo", "Gerador de Energia",

            "Acessibilidade (PCD)", "Rampa de Acesso", "Bicicletário",

            "Carregador de Carro Elétrico", "Coworking", "Lavanderia Coletiva",

            "Mini Mercado/Convenência", "Restaurante/Café", "Espaço Pet/Pet Place",

            "Área Verde/Jardim", "Heliponto", "Vaga para Visitantes", "Car Wash/Lava-Rápido",

            "Zeladoria", "Coleta Seletiva"

        ]

    },

    {

        category: "Segurança",

        features: [

            "Portaria 24h", "Portaria Remota/Eletrônica", "Guarita Blindada", "Portão Eletrônico",

            "Controle de Acesso Facial/Biometria", "Câmeras de Segurança", "Monitoramento 24h",

            "Ronda/Vigilância", "Interfone", "Cerca Elétrica", "Alarme", "Fechadura Digital",

            "Pulmão de Segurança"

        ]

    },

    {

        category: "Conforto e Diferenciais (Interno)",

        features: [

            "Ar Condicionado", "Preparação para Ar Condicionado", "Aquecimento a Gás",

            "Aquecimento Solar", "Lareira", "Mobiliado", "Semi-mobiliado", "Armários Planejados",

            "Closet", "Home Office", "Varanda/Sacada", "Varanda Gourmet", "Cortina de Vidro",

            "Cozinha Americana", "Despensa", "Lavabo", "Área de Serviço", "Lavanderia",

            "Dependência de Empregada", "Banheiro de Empregada", "Depósito Privativo",

            "Isolamento Acústico", "Automação Residencial", "Gás Individual", "Hidrômetro Individual"

        ]

    },

    {

        category: "Acabamento e Estrutura",

        features: [

            "Piso Porcelanato", "Piso de Madeira/Laminado", "Piso Vinílico", "Piso Frio",

            "Teto Rebaixado (Gesso)", "Sanca de Gesso", "Iluminação em LED", "Box Blindex",

            "Pé Direito Alto", "Janelas Grandes", "Vista Panorâmica", "Vista para o Mar",

            "Vista para Montanha", "Sol da Manhã", "Sol da Tarde", "Andar Alto", "Andar Baixo",

            "Frente para Rua", "Reformado Recentemente"

        ]

    },

    {

        category: "Rural e Agronegócio",

        features: [

            "Casa de Caseiro", "Curral", "Estábulo", "Galpão Agrícola", "Lago/Rio",

            "Nascente", "Poço Artesiano", "Pasto", "Pomar", "Horta", "Energia Rural",

            "Tanque de Peixes", "Silo", "Cerca", "Mata Nativa"

        ]

    },

    {

        category: "Comercial e Industrial",

        features: [

            "Mezanino", "Doca", "Entrada para Caminhões", "Pátio de Manobra",

            "Energia Trifásica", "Piso Reforçado/Industrial", "Escritório Integrado",

            "Copa/Refeitório", "Vestiário", "Recepção", "Auditório", "Cabeamento Estruturado"

        ]

    }

];



// Lista achatada (Flat) para validações e uso geral no banco de dados

export const PROPERTY_FEATURES = PROPERTY_FEATURES_CATEGORIZED.flatMap(c => c.features);
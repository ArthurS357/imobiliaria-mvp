// 1. TIPOS DE PROPRIEDADE
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
    ],
  },
  {
    label: "Comercial / Industrial",
    types: [
      "Galpão",
      "Sala",
      "Terreno Comercial",
      "Prédio Comercial",
      "Área Industrial",
      "Loja",
      "Ponto Comercial",
    ],
  },
  {
    label: "Rural",
    types: ["Chácara", "Fazenda", "Sítio", "Chalé"],
  },
];

// Lista achatada para compatibilidade com selects simples e validações
export const PROPERTY_TYPES = PROPERTY_TYPES_CATEGORIZED.flatMap(
  (category) => category.types,
);

// 2. CONSTANTES PARA O SISTEMA DE CADASTRO

export const FINALIDADES = ["Venda", "Locação", "Venda e Locação"];

export const TIPOS_CONTRATO = ["Sem Exclusividade", "Com Exclusividade"];

export const STATUS_MERCADO = [
  "Padrão",
  "Ótimo preço",
  "Preço reduzido",
  "Reformado",
  "Em breve",
  "Nova construção",
  "Na planta",
  "Oportunidade",
];

export const TIPOS_VALOR = [
  "Preço fixo",
  "Aluguel mensal",
  "Consultar o preço",
  "Negociável",
  "Os preços começam em",
  "Pacote (Aluguel + Condomínio + IPTU)",
];

export const CONDICAO_IMOVEL = [
  "Em ótimas condições",
  "Boas condições",
  "Condição regular",
  "Más condições",
  "Precisa de reforma",
  "Em construção",
  "Recém-entregue",
];

export const PERIODICIDADE = [
  "Mensal",
  "Anual",
  "Semestral",
  "Trimestral",
  "Semanal",
  "Diária",
];

// 3. CHECKLIST DE CARACTERÍSTICAS (FEATURES)

export const PROPERTY_FEATURES_CATEGORIZED = [
  {
    category: "Localização e Vista",
    features: [
      "Acessível de barco",
      "Área residencial",
      "Casa de campo",
      "Centro da cidade",
      "Com vista para o mar",
      "Vista Panorâmica",
      "Vista para Montanha",
      "Em rua movimentada",
      "Em rua tranquila",
      "Rua asfaltada",
      "Remoto (distante)",
      "Perto de estação ferroviária",
      "Perto de metrô",
      "Perto de ônibus",
      "Perto de rodovia",
      "Perto de aeroporto",
      "Perto de escolas",
      "Perto de hospital",
      "Perto de igreja",
      "Perto de lojas/shopping",
      "Perto de parque",
      "Perto de praça",
      "Frente para o Norte",
      "Frente para o Sul",
      "Frente para o Leste",
      "Frente para o Oeste",
      "Vista Nordeste",
      "Vista Noroeste",
      "Vista Sudeste",
      "Vista Sudoeste",
      "Sol da Manhã",
      "Sol da Tarde",
    ],
  },
  {
    category: "Lazer e Bem-estar",
    features: [
      "Piscina",
      "Piscina Aquecida",
      "Piscina Infantil",
      "Piscina com Raia",
      "Piscina de Borda Infinita",
      "Churrasqueira",
      "Forno de Pizza",
      "Espaço Gourmet",
      "Salão de Festas",
      "Salão de Jogos",
      "Brinquedoteca",
      "Playground",
      "Quadra Poliesportiva",
      "Quadra de Tênis",
      "Quadra de Beach Tennis",
      "Campo de Futebol",
      "Quadra de Squash",
      "Sauna",
      "Spa/Hidromassagem",
      "Ofurô",
      "Academia/Fitness",
      "Espaço Zen",
      "Cinema/Home Theater",
      "Pista de Cooper",
      "Redário",
      "Horta Comunitária",
      "Rooftop",
    ],
  },
  {
    category: "Infraestrutura do Condomínio",
    features: [
      "Elevador",
      "Elevador de Serviço",
      "Elevador Privativo",
      "Gerador de Energia",
      "Acessibilidade (PCD)",
      "Rampa de Acesso",
      "Bicicletário",
      "Carregador de Carro Elétrico",
      "Coworking",
      "Lavanderia Coletiva",
      "Mini Mercado/Convenência",
      "Restaurante/Café",
      "Espaço Pet/Pet Place",
      "Área Verde/Jardim",
      "Heliponto",
      "Vaga para Visitantes",
      "Car Wash/Lava-Rápido",
      "Zeladoria",
      "Coleta Seletiva",
    ],
  },
  {
    category: "Segurança",
    features: [
      "Portaria 24h",
      "Portaria Remota/Eletrônica",
      "Guarita Blindada",
      "Portão Eletrônico",
      "Controle de Acesso Facial/Biometria",
      "Câmeras de Segurança",
      "Monitoramento 24h",
      "Ronda/Vigilância",
      "Interfone",
      "Cerca Elétrica",
      "Alarme",
      "Fechadura Digital",
      "Pulmão de Segurança",
    ],
  },
  {
    category: "Conforto e Diferenciais (Interno)",
    features: [
      "Ar Condicionado",
      "Preparação para Ar Condicionado",
      "Aquecimento a Gás",
      "Aquecimento Solar",
      "Lareira",
      "Mobiliado",
      "Semi-mobiliado",
      "Sem Mobília",
      "Ambientes Integrados",
      "Biblioteca",
      "Hall de Entrada",
      "Armários Planejados",
      "Closet",
      "Home Office",
      "Varanda/Sacada",
      "Varanda Gourmet",
      "Cortina de Vidro",
      "Cozinha Americana",
      "Despensa",
      "Lavabo",
      "Área de Serviço",
      "Lavanderia",
      "Dependência de Empregada",
      "Banheiro de Empregada",
      "Depósito Privativo",
      "Depósito",
      "Isolamento Acústico",
      "Automação Residencial",
      "Gás Individual",
      "Hidrômetro Individual",
      "Chuveiro a Gás",
      "Carpete",
      "Pé Direito Alto",
      "Janelas Grandes",
    ],
  },
  {
    category: "Acabamento e Estrutura",
    features: [
      "Piso Porcelanato",
      "Piso de Madeira/Laminado",
      "Piso Vinílico",
      "Piso Frio",
      "Teto Rebaixado (Gesso)",
      "Sanca de Gesso",
      "Iluminação em LED",
      "Box Blindex",
      "Reformado Recentemente",
      "Andar Alto",
      "Andar Baixo",
      "Frente para Rua",
    ],
  },
  {
    category: "Rural e Agronegócio",
    features: [
      "Casa de Caseiro",
      "Curral",
      "Estábulo",
      "Galpão Agrícola",
      "Lago/Rio",
      "Nascente",
      "Poço Artesiano",
      "Pasto",
      "Pomar",
      "Horta",
      "Energia Rural",
      "Tanque de Peixes",
      "Silo",
      "Cerca",
      "Mata Nativa",
    ],
  },
  {
    category: "Comercial e Industrial",
    features: [
      "Mezanino",
      "Doca",
      "Entrada para Caminhões",
      "Pátio de Manobra",
      "Energia Trifásica",
      "Piso Reforçado/Industrial",
      "Escritório Integrado",
      "Copa/Refeitório",
      "Vestiário",
      "Recepção",
      "Auditório",
      "Cabeamento Estruturado",
    ],
  },
];

// Lista achatada (Flat) para validações e uso geral no banco de dados
export const PROPERTY_FEATURES = PROPERTY_FEATURES_CATEGORIZED.flatMap(
  (c) => c.features,
);

export const APP_NAME = "Matiello Imóveis";

// SEGURANÇA: Lê apenas do .env.
// Se não estiver configurado, será undefined e as funções que dependem disso (login/reset) falharão,
// o que é o comportamento correto (Fail Closed) para segurança.
export const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD;

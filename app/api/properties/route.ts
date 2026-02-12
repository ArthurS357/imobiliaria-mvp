import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Tipos para melhor type safety
interface PropertyFilters {
  status?: string;
  tipo?: string;
  minPrice?: string;
  maxPrice?: string;
  quartos?: string;
  garagem?: string;
  finalidade?: string;
}

interface PropertyCreateData {
  titulo: string;
  sobreTitulo?: string;
  descricao: string;
  tipo: string;
  finalidade?: string;
  preco: string;
  precoLocacao?: string;
  tipoValor: string;
  periodoPagamento: string;
  depositoSeguranca?: string;
  valorCondominio?: string;
  periodicidadeCondominio?: string;
  cidade: string;
  bairro: string;
  endereco: string;
  latitude?: string;
  longitude?: string;
  quarto: string;
  suites?: string;
  banheiro: string;
  garagem: string;
  vagasCobertas?: string;
  vagasDescobertas?: string;
  vagasSubsolo?: boolean;
  area: string;
  areaTerreno?: string;
  statusMercado?: string;
  condicaoImovel?: string;
  anoConstrucao?: string;
  tipoContrato?: string;
  fotos?: string[];
  features?: string[];
  displayAddress?: boolean;
  displayDetails?: boolean;
}

// Utilitário para conversão segura de valores
const safeParseFloat = (value: string | undefined): number => {
  if (!value) return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

const safeParseInt = (value: string | undefined): number => {
  if (!value) return 0;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
};

// GET: Listar imóveis
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";
    const userId = session?.user?.id;

    const { searchParams } = new URL(request.url);

    // VERIFICAÇÃO DE CONTEXTO: É painel ou site público?
    const isDashboardRequest = searchParams.get("dashboard") === "true";

    // Validação e tipagem dos parâmetros
    const filters: PropertyFilters = {
      status: searchParams.get("status") || undefined,
      tipo: searchParams.get("tipo") || undefined,
      minPrice: searchParams.get("minPrice") || undefined,
      maxPrice: searchParams.get("maxPrice") || undefined,
      quartos: searchParams.get("quartos") || undefined,
      garagem: searchParams.get("garagem") || undefined,
      finalidade: searchParams.get("finalidade") || undefined,
    };

    // Construção do objeto where com type safety
    const where: Prisma.PropertyWhereInput = {};

    // 🔒 LÓGICA DE FILTRO DE SEGURANÇA CORRIGIDA
    if (isDashboardRequest) {
      // --- MODO PAINEL ADMIN (Requer Login) ---
      if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }

      if (!isAdmin) {
        // Corretores veem APENAS seus próprios imóveis no painel
        where.corretorId = userId;
      }
      // Admins veem tudo (nenhum filtro de ID aplicado)
    } else {
      // --- MODO SITE PÚBLICO (Home/Busca) ---
      // Regra: Mostrar apenas imóveis disponíveis para TODOS (mesmo se for corretor logado)
      where.status = "DISPONIVEL";
    }

    // Aplicação dos filtros dinâmicos (Comuns a ambos os modos)
    if (filters.status && filters.status !== "TODOS") {
      where.status = filters.status;
    }

    if (filters.tipo && filters.tipo !== "Todos") {
      where.tipo = filters.tipo;
    }

    if (filters.finalidade && filters.finalidade !== "Todos") {
      where.finalidade = filters.finalidade;
    }

    // Filtros de preço com validação
    if (filters.minPrice || filters.maxPrice) {
      where.preco = {};
      if (filters.minPrice) {
        const minVal = safeParseFloat(filters.minPrice);
        if (minVal > 0) where.preco.gte = minVal;
      }
      if (filters.maxPrice) {
        const maxVal = safeParseFloat(filters.maxPrice);
        if (maxVal > 0) where.preco.lte = maxVal;
      }
    }

    // Filtros numéricos com validação
    if (filters.quartos && safeParseInt(filters.quartos) > 0) {
      where.quarto = { gte: safeParseInt(filters.quartos) };
    }

    if (filters.garagem && safeParseInt(filters.garagem) > 0) {
      where.garagem = { gte: safeParseInt(filters.garagem) };
    }

    // Busca com paginação implícita (limitando resultados)
    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100, // Limita resultados para performance
      include: {
        corretor: {
          select: {
            name: true,
            email: true,
            id: true,
          },
        },
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("❌ Erro na API GET properties:", error);
    return NextResponse.json(
      { error: "Erro ao buscar imóveis" },
      { status: 500 },
    );
  }
}

// POST: Cadastrar novo imóvel (Mantido Protegido 🔒)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autorizado - Faça login para cadastrar imóveis" },
        { status: 401 },
      );
    }

    const data: PropertyCreateData = await request.json();

    // Validação de dados obrigatórios
    if (!data.titulo || !data.descricao || !data.tipo || !data.preco) {
      return NextResponse.json(
        { error: "Dados obrigatórios faltando" },
        { status: 400 },
      );
    }

    // Regra de Negócio: Admin publica direto, Corretores vão para revisão
    const initialStatus =
      session.user.role === "ADMIN" ? "DISPONIVEL" : "PENDENTE";

    // Processamento seguro de arrays
    const fotosString = Array.isArray(data.fotos)
      ? data.fotos
          .filter((url) => typeof url === "string" && url.length > 0)
          .join(";")
      : "";

    const featuresString = Array.isArray(data.features)
      ? data.features
          .filter(
            (feature) => typeof feature === "string" && feature.length > 0,
          )
          .join(",")
      : "";

    // Validação e sanitização de dados
    const propertyData = {
      // DADOS BÁSICOS
      titulo: data.titulo.trim(),
      sobreTitulo: data.sobreTitulo?.trim() || "",
      descricao: data.descricao.trim(),
      tipo: data.tipo.trim(),
      finalidade: (data.finalidade || "Venda").trim(),

      // VALORES - Com validação segura
      preco: safeParseFloat(data.preco),
      precoLocacao: safeParseFloat(data.precoLocacao),
      tipoValor: data.tipoValor?.trim() || "",
      periodoPagamento: data.periodoPagamento?.trim() || "",
      depositoSeguranca: safeParseFloat(data.depositoSeguranca),
      valorCondominio: safeParseFloat(data.valorCondominio),
      periodicidadeCondominio: data.periodicidadeCondominio?.trim() || "",

      // ENDEREÇO
      cidade: data.cidade?.trim() || "",
      bairro: data.bairro?.trim() || "",
      endereco: data.endereco?.trim() || "",
      latitude: data.latitude ? safeParseFloat(data.latitude) : null,
      longitude: data.longitude ? safeParseFloat(data.longitude) : null,

      // DETALHES FÍSICOS
      quarto: safeParseInt(data.quarto),
      suites: safeParseInt(data.suites),
      banheiro: safeParseInt(data.banheiro),
      garagem: safeParseInt(data.garagem),
      vagasCobertas: safeParseInt(data.vagasCobertas),
      vagasDescobertas: safeParseInt(data.vagasDescobertas),
      vagasSubsolo: Boolean(data.vagasSubsolo),

      // ÁREAS
      area: safeParseFloat(data.area),
      areaTerreno: safeParseFloat(data.areaTerreno),

      // DETALHES DE MERCADO
      statusMercado: data.statusMercado?.trim() || "",
      condicaoImovel: data.condicaoImovel?.trim() || "",
      anoConstrucao: data.anoConstrucao
        ? safeParseInt(data.anoConstrucao)
        : null,
      tipoContrato: data.tipoContrato?.trim() || "",

      // MÍDIA E SISTEMA
      fotos: fotosString,
      features: featuresString,
      status: initialStatus,
      destaque: false,
      displayAddress: data.displayAddress ?? true,
      displayDetails: data.displayDetails ?? true,

      // VINCULAÇÃO AO USUÁRIO LOGADO
      corretorId: session.user.id,
    };

    // Validação final antes de salvar
    if (propertyData.preco <= 0) {
      return NextResponse.json(
        { error: "Preço deve ser maior que zero" },
        { status: 400 },
      );
    }

    if (propertyData.area <= 0) {
      return NextResponse.json(
        { error: "Área deve ser maior que zero" },
        { status: 400 },
      );
    }

    const property = await prisma.property.create({
      data: propertyData,
      include: {
        corretor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`✅ Imóvel criado por ${session.user.email}: ${property.id}`);

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("❌ Erro ao cadastrar imóvel:", error);

    // Tratamento específico para erros do Prisma
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Imóvel já cadastrado com esses dados" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar imóvel - Tente novamente" },
      { status: 500 },
    );
  }
}

// Middleware para logging (opcional)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        Allow: "GET, POST, OPTIONS",
        "Content-Type": "application/json",
      },
    },
  );
}

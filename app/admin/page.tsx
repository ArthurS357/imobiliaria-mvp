import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Building2,
  Users,
  MessageSquare,
  Calendar,
  LayoutDashboard,
  TrendingUp,
  Clock,
  ArrowRight,
  LucideIcon,
  Lock,
  Home,
  User,
  Plus,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { Suspense } from "react";

// --- Configuration & Types ---

const ALLOWED_ROLES = ["ADMIN", "CORRETOR", "BROKER", "FUNCIONARIO"];

type UserRole = "ADMIN" | "CORRETOR" | "BROKER" | "FUNCIONARIO";
type ThemeVariant = "blue" | "yellow" | "green" | "purple" | "pink" | "indigo";

interface ThemeConfig {
  bg: string;
  text: string;
  number: string;
  iconBg: string;
  iconText: string;
  borderHover: string;
  gradient: string;
}

const THEME_STYLES: Record<ThemeVariant, ThemeConfig> = {
  blue: {
    bg: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700",
    text: "text-gray-500 dark:text-gray-400",
    number: "text-gray-900 dark:text-white",
    iconBg: "bg-blue-50 dark:bg-blue-900/30",
    iconText: "text-blue-600 dark:text-blue-400",
    borderHover: "hover:border-blue-500 dark:hover:border-blue-500",
    gradient: "from-blue-500 to-blue-600",
  },
  yellow: {
    bg: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700",
    text: "text-gray-500 dark:text-gray-400",
    number: "text-gray-900 dark:text-white",
    iconBg: "bg-yellow-50 dark:bg-yellow-900/30",
    iconText: "text-yellow-600 dark:text-yellow-400",
    borderHover: "hover:border-yellow-500 dark:hover:border-yellow-500",
    gradient: "from-yellow-500 to-orange-500",
  },
  green: {
    bg: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700",
    text: "text-gray-500 dark:text-gray-400",
    number: "text-gray-900 dark:text-white",
    iconBg: "bg-green-50 dark:bg-green-900/30",
    iconText: "text-green-600 dark:text-green-400",
    borderHover: "hover:border-green-500 dark:hover:border-green-500",
    gradient: "from-green-500 to-emerald-600",
  },
  purple: {
    bg: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700",
    text: "text-gray-500 dark:text-gray-400",
    number: "text-gray-900 dark:text-white",
    iconBg: "bg-purple-50 dark:bg-purple-900/30",
    iconText: "text-purple-600 dark:text-purple-400",
    borderHover: "hover:border-purple-500 dark:hover:border-purple-500",
    gradient: "from-purple-500 to-indigo-600",
  },
  pink: {
    bg: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700",
    text: "text-gray-500 dark:text-gray-400",
    number: "text-gray-900 dark:text-white",
    iconBg: "bg-pink-50 dark:bg-pink-900/30",
    iconText: "text-pink-600 dark:text-pink-400",
    borderHover: "hover:border-pink-500 dark:hover:border-pink-500",
    gradient: "from-pink-500 to-rose-500",
  },
  indigo: {
    bg: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700",
    text: "text-gray-500 dark:text-gray-400",
    number: "text-gray-900 dark:text-white",
    iconBg: "bg-indigo-50 dark:bg-indigo-900/30",
    iconText: "text-indigo-600 dark:text-indigo-400",
    borderHover: "hover:border-indigo-500 dark:hover:border-indigo-500",
    gradient: "from-indigo-500 to-violet-600",
  },
};

const ALERT_STYLES = {
  wrapper:
    "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-800",
  text: "text-yellow-700 dark:text-yellow-300",
  number: "text-yellow-800 dark:text-yellow-200",
  iconBg:
    "bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-700 dark:from-yellow-900/40 dark:to-orange-900/40 dark:text-yellow-300",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// --- Data Fetching Logic ---

async function getUserStats(userId: string, role: UserRole) {
  const isAdmin = role === "ADMIN";

  const propertyWhere = isAdmin ? {} : { corretorId: userId };
  const leadWhere = isAdmin ? {} : { assignedToId: userId };
  const visitWhere = {
    status: "PENDENTE",
    ...(!isAdmin && { assignedToId: userId }),
  };

  const [
    propertyCount,
    leadCount,
    pendingVisits,
    publishedProperties,
    draftProperties,
  ] = await Promise.all([
    prisma.property.count({ where: propertyWhere }),
    prisma.lead.count({ where: leadWhere }),
    prisma.visit.count({ where: visitWhere }),
    prisma.property.count({
      where: {
        ...propertyWhere,
        status: "DISPONIVEL",
      },
    }),
    prisma.property.count({
      where: {
        ...propertyWhere,
        status: "PENDENTE",
      },
    }),
  ]);

  return {
    propertyCount,
    leadCount,
    pendingVisits,
    publishedProperties,
    draftProperties,
  };
}

// --- Components ---

function StatCard({
  label,
  value,
  icon: Icon,
  variant,
  subtext,
  isAlert,
  trend,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  variant: ThemeVariant;
  subtext?: string;
  isAlert?: boolean;
  trend?: { value: number; positive: boolean };
}) {
  const theme = THEME_STYLES[variant];
  const activeAlert = isAlert && value > 0;

  const wrapperClass = activeAlert
    ? `${ALERT_STYLES.wrapper} border-l-4 border-yellow-500 dark:border-yellow-400`
    : `${theme.bg} border`;

  const textClass = activeAlert ? ALERT_STYLES.text : theme.text;
  const numberClass = activeAlert ? ALERT_STYLES.number : theme.number;
  const iconBgClass = activeAlert
    ? ALERT_STYLES.iconBg
    : `${theme.iconBg} ${theme.iconText}`;

  // Ajuste Mobile: padding reduzido (p-3 sm:p-6), fonte ajustada
  return (
    <div
      className={`p-3 sm:p-6 rounded-2xl shadow-sm border flex flex-col justify-between transition-all group relative overflow-hidden ${wrapperClass} hover:shadow-md`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs sm:text-sm font-medium mb-1 truncate ${textClass}`}
          >
            {label}
          </p>
          <div className="flex flex-wrap items-baseline gap-2">
            <p
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${numberClass}`}
            >
              {value.toLocaleString("pt-BR")}
            </p>
            {trend && (
              <span
                className={`text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full ${
                  trend.positive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {trend.positive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
          {subtext && !activeAlert && (
            <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1 sm:mt-2 truncate">
              {subtext}
            </p>
          )}
        </div>
        <div
          className={`p-2 sm:p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${iconBgClass}`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
      {activeAlert && (
        <div className="mt-2 sm:mt-3 flex items-center gap-2">
          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-[10px] sm:text-xs text-yellow-700 dark:text-yellow-300 font-medium">
            Ação necessária
          </span>
        </div>
      )}
    </div>
  );
}

function QuickLinkCard({
  href,
  title,
  subtitle,
  icon: Icon,
  variant,
  isAdminOnly,
  isNew,
  count,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  variant: ThemeVariant;
  isAdminOnly?: boolean;
  isNew?: boolean;
  count?: number;
}) {
  const theme = THEME_STYLES[variant];
  // Ajuste Mobile: padding reduzido (p-4 sm:p-6), altura controlada
  return (
    <Link
      href={href}
      className={`group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${theme.borderHover} hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden h-full justify-between`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Icon
          size={100}
          className={`${theme.iconText} transform ${variant === "yellow" || variant === "purple" ? "-rotate-12" : "rotate-12"}`}
        />
      </div>
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div
            className={`p-2 sm:p-3 rounded-lg ${theme.iconBg} ${theme.iconText}`}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-lg text-gray-800 dark:text-white flex items-center gap-1 sm:gap-2 flex-wrap">
              <span className="truncate">{title}</span>
              {isNew && (
                <span className="text-[9px] sm:text-[10px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 sm:px-2 rounded-full font-bold uppercase whitespace-nowrap">
                  Novo
                </span>
              )}
            </h3>
            {isAdminOnly && (
              <span className="text-[9px] sm:text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 sm:px-2 rounded-full font-bold uppercase inline-block">
                Admin
              </span>
            )}
          </div>
        </div>
        {count !== undefined && (
          <div
            className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${
              count > 0
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            {count}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-1 sm:mt-2">
        <span
          className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors group-hover:${theme.iconText.split(" ")[0]} truncate pr-2`}
        >
          {subtitle}
        </span>
        <ArrowRight
          className={`w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-300 transition-all group-hover:translate-x-1 group-hover:${theme.iconText.split(" ")[0]}`}
        />
      </div>
    </Link>
  );
}

function UserProfileCard({
  name,
  role,
  email,
}: {
  name: string;
  role: string;
  email: string;
}) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="bg-white/20 p-2 sm:p-3 rounded-full">
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-base sm:text-lg truncate">{name}</h3>
          <p className="text-blue-100 dark:text-blue-200 text-xs sm:text-sm truncate">
            {email}
          </p>
          <span className="inline-block mt-1 sm:mt-2 px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 rounded-full text-[10px] sm:text-xs font-bold">
            {role}
          </span>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20 flex gap-3">
        <Link
          href="/admin/perfil/senha"
          className="flex-1 text-center py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Lock className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
          Alterar Senha
        </Link>
      </div>
    </div>
  );
}

// --- Main Page ---

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  const userRole = (session.user.role || "") as UserRole;

  if (!ALLOWED_ROLES.includes(userRole)) {
    redirect("/");
  }

  const { id: userId, name, email } = session.user;
  const isAdmin = userRole === "ADMIN";
  const userName = name || "Usuário";

  const formattedDate = dateFormatter.format(new Date());

  // Correção "Sambando": overflow-x-hidden e w-full no container principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-500 w-full overflow-x-hidden">
      {/* Navbar com melhor responsividade */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm transition-colors w-full">
        <div className="flex items-center gap-2 sm:gap-3 text-blue-900 dark:text-blue-400">
          <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg text-white">
            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="font-bold text-lg sm:text-xl tracking-tight block leading-none text-gray-900 dark:text-white">
              Matiello
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Admin
              </span>
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold hidden xs:block">
              {isAdmin ? "Gerencial" : "Corretor"}
            </span>
          </div>
        </div>

        {/* Agrupamento de ícones otimizado - Sem Sino e Sem Cadeado duplicado */}
        <div className="flex items-center gap-1 sm:gap-4">
          <Link
            href="/"
            title="Voltar para o Site"
            className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Home className="w-5 h-5 sm:w-5 sm:h-5" />
            <span className="hidden lg:inline text-sm font-medium">
              Ver Site
            </span>
          </Link>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <div className="hidden md:flex items-center gap-3 border-r border-gray-200 dark:border-gray-700 pr-4 mr-2">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate max-w-[120px]">
                {userName.split(" ")[0]}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {userName.charAt(0)}
            </div>
          </div>

          <LogoutButton />
        </div>
      </header>

      <main className="flex-grow p-3 sm:p-6 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="sm:hidden flex justify-end mb-4 gap-2">
          <ThemeToggle />
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2 truncate">
            Olá, {userName.split(" ")[0]}! 👋
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            <Clock size={14} className="sm:w-4 sm:h-4" />
            <span className="capitalize">{formattedDate}</span>
          </div>
        </div>

        {/* Suspense Wrapper */}
        <Suspense
          fallback={
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-3 sm:p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 sm:mb-4"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          }
        >
          <MetricsSection userId={userId} userRole={userRole} />
        </Suspense>

        <hr className="border-gray-200 dark:border-gray-700 mb-6 sm:mb-8 opacity-50" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <TrendingUp className="w-5 h-5 sm:w-5 sm:h-5 text-blue-900 dark:text-blue-400" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                Acesso Rápido
              </h2>
            </div>

            {/* Grid ajustado: 2 colunas no mobile para aproveitar espaço */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <QuickLinkCard
                href="/admin/imoveis/novo"
                title="Novo Imóvel"
                subtitle="Adicionar"
                icon={Plus}
                variant="pink"
                isNew
              />

              <QuickLinkCard
                href="/admin/imoveis"
                title="Imóveis"
                subtitle="Gerenciar"
                icon={Building2}
                variant="blue"
                count={await prisma.property.count({
                  where: isAdmin ? {} : { corretorId: userId },
                })}
              />

              <QuickLinkCard
                href="/admin/visitas"
                title="Agenda"
                subtitle="Solicitações"
                icon={Calendar}
                variant="yellow"
                isNew
                count={await prisma.visit.count({
                  where: {
                    status: "PENDENTE",
                    ...(!isAdmin && { assignedToId: userId }),
                  },
                })}
              />

              <QuickLinkCard
                href="/admin/mensagens"
                title="Leads"
                subtitle="Mensagens"
                icon={MessageSquare}
                variant="green"
                count={await prisma.lead.count({
                  where: isAdmin ? {} : { assignedToId: userId },
                })}
              />
            </div>
          </div>

          <div>
            <div className="mt-4 lg:mt-0">
              <UserProfileCard
                name={userName}
                role={userRole}
                email={email || ""}
              />
            </div>

            {isAdmin && (
              <div className="mt-4 sm:mt-6">
                <QuickLinkCard
                  href="/admin/usuarios"
                  title="Equipe"
                  subtitle="Controle"
                  icon={Users}
                  variant="purple"
                  isAdminOnly={true}
                  count={await prisma.user.count()}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

async function MetricsSection({
  userId,
  userRole,
}: {
  userId: string;
  userRole: UserRole;
}) {
  const {
    propertyCount,
    leadCount,
    pendingVisits,
    publishedProperties,
    draftProperties,
  } = await getUserStats(userId, userRole);

  const isAdmin = userRole === "ADMIN";

  // Grid Mobile: 2 colunas (grid-cols-2) em vez de 1 para evitar rolagem excessiva
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
      <StatCard
        label={isAdmin ? "Total Imóveis" : "Meus Imóveis"}
        value={propertyCount}
        icon={Building2}
        variant="blue"
        subtext={`${publishedProperties} pub`}
        trend={{ value: 12, positive: true }}
      />
      <StatCard
        label="Pendentes"
        value={pendingVisits}
        icon={Calendar}
        variant="yellow"
        isAlert={true}
        subtext="Visitas"
      />
      <StatCard
        label={isAdmin ? "Total Leads" : "Meus Leads"}
        value={leadCount}
        icon={MessageSquare}
        variant="green"
        subtext="Novos (30d)"
        trend={{ value: 8, positive: true }}
      />
      <StatCard
        label="Conversão"
        value={24}
        icon={UserCheck}
        variant="indigo"
        subtext="Taxa %"
        trend={{ value: 3, positive: true }}
      />
    </div>
  );
}

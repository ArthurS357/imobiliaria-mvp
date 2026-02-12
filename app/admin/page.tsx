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
  Lock, // Adicionado para o botão de senha
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/admin/LogoutButton";

// --- Configuration & Types ---

// FIX: Lista completa de roles permitidos para evitar loop infinito
const ALLOWED_ROLES = ["ADMIN", "CORRETOR", "BROKER", "FUNCIONARIO"];

type ThemeVariant = "blue" | "yellow" | "green" | "purple";

interface ThemeConfig {
  bg: string;
  text: string;
  number: string;
  iconBg: string;
  iconText: string;
  borderHover: string;
}

const THEME_STYLES: Record<ThemeVariant, ThemeConfig> = {
  blue: {
    bg: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700",
    text: "text-gray-500 dark:text-gray-400",
    number: "text-gray-900 dark:text-white",
    iconBg: "bg-blue-50 dark:bg-blue-900/30",
    iconText: "text-blue-600 dark:text-blue-400",
    borderHover: "hover:border-blue-500 dark:hover:border-blue-500",
  },
  yellow: {
    bg: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700",
    text: "text-gray-500 dark:text-gray-400",
    number: "text-gray-900 dark:text-white",
    iconBg: "bg-yellow-50 dark:bg-yellow-900/30",
    iconText: "text-yellow-600 dark:text-yellow-400",
    borderHover: "hover:border-yellow-500 dark:hover:border-yellow-500",
  },
  green: {
    bg: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700",
    text: "text-gray-500 dark:text-gray-400",
    number: "text-gray-900 dark:text-white",
    iconBg: "bg-green-50 dark:bg-green-900/30",
    iconText: "text-green-600 dark:text-green-400",
    borderHover: "hover:border-green-500 dark:hover:border-green-500",
  },
  purple: {
    bg: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700",
    text: "text-gray-500 dark:text-gray-400",
    number: "text-gray-900 dark:text-white",
    iconBg: "bg-purple-50 dark:bg-purple-900/30",
    iconText: "text-purple-600 dark:text-purple-400",
    borderHover: "hover:border-purple-500 dark:hover:border-purple-500",
  },
};

const ALERT_STYLES = {
  wrapper:
    "bg-yellow-50/50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800",
  text: "text-yellow-700 dark:text-yellow-500",
  number: "text-yellow-700 dark:text-yellow-400",
  iconBg:
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// --- Data Fetching Logic ---

async function getDashboardMetrics(userId: string, role: string) {
  const isAdmin = role === "ADMIN";

  // Filtros de segurança: Não-Admins veem apenas seus próprios registros
  const propertyWhere = isAdmin ? {} : { corretorId: userId };
  const leadWhere = isAdmin ? {} : { assignedToId: userId };
  const visitWhere = {
    status: "PENDENTE",
    ...(!isAdmin && { assignedToId: userId }),
  };

  const [propertyCount, leadCount, pendingVisits] = await Promise.all([
    prisma.property.count({ where: propertyWhere }),
    prisma.lead.count({ where: leadWhere }),
    prisma.visit.count({ where: visitWhere }),
  ]);

  return { propertyCount, leadCount, pendingVisits };
}

// --- Components ---

function StatCard({
  label,
  value,
  icon: Icon,
  variant,
  subtext,
  isAlert,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  variant: ThemeVariant;
  subtext?: string;
  isAlert?: boolean;
}) {
  const theme = THEME_STYLES[variant];
  const activeAlert = isAlert && value > 0;

  const wrapperClass = activeAlert ? ALERT_STYLES.wrapper : theme.bg;
  const textClass = activeAlert ? ALERT_STYLES.text : theme.text;
  const numberClass = activeAlert ? ALERT_STYLES.number : theme.number;
  const iconBgClass = activeAlert
    ? ALERT_STYLES.iconBg
    : `${theme.iconBg} ${theme.iconText}`;

  return (
    <div
      className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between hover:shadow-md transition-all group relative overflow-hidden ${wrapperClass}`}
    >
      <div>
        <p className={`text-sm font-medium mb-1 ${textClass}`}>{label}</p>
        <div className="flex items-baseline gap-2">
          <p
            className={`text-4xl font-extrabold tracking-tight ${numberClass}`}
          >
            {value}
          </p>
          {activeAlert && (
            <span className="text-[10px] font-bold uppercase bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300 animate-pulse">
              Ação Necessária
            </span>
          )}
        </div>
        {subtext && !activeAlert && (
          <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        )}
      </div>
      <div
        className={`p-4 rounded-xl transition-transform duration-300 group-hover:scale-110 ${iconBgClass}`}
      >
        <Icon size={28} />
      </div>
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
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  variant: ThemeVariant;
  isAdminOnly?: boolean;
}) {
  const theme = THEME_STYLES[variant];
  return (
    <Link
      href={href}
      className={`group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${theme.borderHover} hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden h-full justify-between`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon
          size={80}
          className={`${theme.iconText} transform ${variant === "yellow" || variant === "purple" ? "-rotate-12" : "rotate-12"}`}
        />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-lg ${theme.iconBg} ${theme.iconText}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">
            {title}
          </h3>
          {isAdminOnly && (
            <span className="text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold uppercase">
              Admin
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span
          className={`text-sm text-gray-500 dark:text-gray-400 transition-colors group-hover:${theme.iconText.split(" ")[0]}`}
        >
          {subtitle}
        </span>
        <ArrowRight
          size={18}
          className={`text-gray-300 transition-all group-hover:translate-x-1 group-hover:${theme.iconText.split(" ")[0]}`}
        />
      </div>
    </Link>
  );
}

// --- Main Page ---

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  const userRole = session.user.role || "";

  // FIX: Se o role não estiver na lista permitida, redireciona para HOME (/) para evitar loop infinito no login
  if (!ALLOWED_ROLES.includes(userRole)) {
    redirect("/");
  }

  const { id: userId, name } = session.user;
  const isAdmin = userRole === "ADMIN";
  const userName = name || "Usuário";

  const { propertyCount, leadCount, pendingVisits } = await getDashboardMetrics(
    userId,
    userRole,
  );

  const formattedDate = dateFormatter.format(new Date());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-500">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm transition-colors">
        <div className="flex items-center gap-3 text-blue-900 dark:text-blue-400">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight block leading-none text-gray-900 dark:text-white">
              Matiello
              <span className="text-blue-600 dark:text-blue-400">Admin</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
              Painel {isAdmin ? "Gerencial" : "do Corretor"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <div className="text-right hidden sm:block border-r border-gray-200 dark:border-gray-700 pr-6 mr-2">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
              {userName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full inline-block mt-0.5">
              {userRole}
            </p>
          </div>

          {/* BOTÃO DE ALTERAR SENHA */}
          <Link
            href="/admin/perfil/senha"
            title="Alterar Minha Senha"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Lock size={20} />
          </Link>

          <LogoutButton />
        </div>
      </header>

      <main className="flex-grow p-6 max-w-7xl mx-auto w-full animate-enter">
        <div className="sm:hidden flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Olá, {userName.split(" ")[0]}! 👋
          </h1>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <Clock size={16} />
            <span className="capitalize">{formattedDate}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            label={isAdmin ? "Total de Imóveis" : "Meus Imóveis"}
            value={propertyCount}
            icon={Building2}
            variant="blue"
            subtext={isAdmin ? "Ativos na plataforma" : "Do seu portfólio"}
          />
          <StatCard
            label="Visitas Pendentes"
            value={pendingVisits}
            icon={Calendar}
            variant="yellow"
            isAlert={true}
          />
          <StatCard
            label={isAdmin ? "Total de Leads" : "Meus Leads"}
            value={leadCount}
            icon={MessageSquare}
            variant="green"
          />
        </div>

        <hr className="border-gray-200 dark:border-gray-700 mb-8 opacity-50" />

        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={20} className="text-blue-900 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Acesso Rápido
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickLinkCard
            href="/admin/imoveis"
            title="Imóveis"
            subtitle="Gerenciar portfólio"
            icon={Building2}
            variant="blue"
          />
          <QuickLinkCard
            href="/admin/visitas"
            title="Agenda"
            subtitle="Ver solicitações"
            icon={Calendar}
            variant="yellow"
          />
          <QuickLinkCard
            href="/admin/mensagens"
            title="Leads"
            subtitle="Caixa de entrada"
            icon={MessageSquare}
            variant="green"
          />
          {isAdmin && (
            <QuickLinkCard
              href="/admin/usuarios"
              title="Equipe"
              subtitle="Controle de acesso"
              icon={Users}
              variant="purple"
              isAdminOnly={true}
            />
          )}
        </div>
      </main>
    </div>
  );
}

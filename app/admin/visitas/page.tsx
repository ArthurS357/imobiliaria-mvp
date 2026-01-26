import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowLeft, Phone, Mail, User, Smartphone } from "lucide-react";
import { VisitActions } from "@/components/admin/VisitActions";
import { VisitAssigner } from "@/components/admin/VisitAssigner";

export default async function AdminVisitsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/admin/login");

    const isAdmin = session.user.role === "ADMIN";
    const userId = session.user.id;

    // Definição das variáveis
    let visits = [];
    let brokers: { id: string; name: string }[] = [];

    // Busca de Dados
    if (isAdmin) {
        // ADMIN: Vê todas as visitas + Lista de corretores
        visits = await prisma.visit.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                property: { select: { titulo: true, bairro: true } },
                assignedTo: true,
                // Assumindo que os dados do cliente estão na própria tabela Visit
            }
        });

        brokers = await prisma.user.findMany({
            select: { id: true, name: true },
        });
    } else {
        // CORRETOR: Vê apenas as suas
        visits = await prisma.visit.findMany({
            where: { assignedToId: userId },
            orderBy: { createdAt: "desc" },
            include: {
                property: { select: { titulo: true, bairro: true } }
            }
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                            <Calendar className="text-blue-900 dark:text-blue-400" />
                            {isAdmin ? "Agenda Geral" : "Minhas Visitas"}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {isAdmin
                                ? "Distribua as visitas entre a equipe."
                                : "Confira seus agendamentos atribuídos."}
                        </p>
                    </div>
                    <Link href="/admin" className="text-gray-600 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 flex items-center gap-2 font-medium bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                </div>

                <div className="space-y-4">
                    {visits.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                            <Calendar className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhuma visita encontrada</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {isAdmin ? "Nenhum cliente agendou ainda." : "Você não tem visitas agendadas."}
                            </p>
                        </div>
                    ) : (
                        visits.map((visit) => {
                            // Lógica para o Link do WhatsApp
                            const cleanPhone = visit.phone ? visit.phone.replace(/\D/g, "") : "";
                            const visitDate = new Date(visit.date).toLocaleDateString('pt-BR');
                            const visitTime = visit.timeOfDay === 'MANHA' ? 'Manhã' : 'Tarde';
                            const whatsappMessage = `Olá ${visit.name.split(" ")[0]}, tudo bem? Gostaria de confirmar sua visita agendada para dia ${visitDate} (${visitTime}) no imóvel "${visit.property.titulo}".`;
                            const whatsappLink = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

                            return (
                                <div key={visit.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row justify-between gap-6 transition hover:shadow-md dark:hover:border-gray-600 group">

                                    {/* Informações da Visita */}
                                    <div className="space-y-4 flex-grow">

                                        {/* Badge Status + Data */}
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border
                                                ${visit.status === 'PENDENTE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' : ''}
                                                ${visit.status === 'CONFIRMADA' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : ''}
                                                ${visit.status === 'CANCELADA' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : ''}
                                            `}>
                                                {visit.status}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">Solicitado em {new Date(visit.createdAt).toLocaleDateString('pt-BR')}</span>
                                        </div>

                                        {/* Data e Hora Destacados */}
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <Calendar size={20} className="text-blue-900 dark:text-blue-400" />
                                                {new Date(visit.date).toLocaleDateString('pt-BR')}
                                                <span className="text-gray-300 dark:text-gray-600 font-light">|</span>
                                                <span className="text-base font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                                    <Clock size={16} /> {visit.timeOfDay === "MANHA" ? "Manhã (08h - 12h)" : "Tarde (13h - 18h)"}
                                                </span>
                                            </h3>
                                        </div>

                                        {/* Card do Cliente */}
                                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700 w-full md:w-fit">
                                            <div className="flex items-center gap-2 mb-2">
                                                <User size={16} className="text-blue-900 dark:text-blue-400" />
                                                <span className="font-bold text-gray-800 dark:text-gray-200">{visit.name}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400 ml-6">
                                                <span className="flex items-center gap-1.5"><Mail size={14} /> {visit.email}</span>
                                                {visit.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {visit.phone}</span>}
                                            </div>
                                        </div>

                                        {/* Localização */}
                                        <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-300 font-medium bg-blue-50 dark:bg-blue-900/10 px-3 py-2 rounded-lg w-fit">
                                            <MapPin size={16} className="flex-shrink-0" />
                                            {visit.property.titulo} - {visit.property.bairro}
                                        </div>
                                    </div>

                                    {/* Coluna da Direita: Ações */}
                                    <div className="flex flex-col items-end justify-between gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6">

                                        <div className="flex flex-col gap-2 w-full">
                                            {/* Botão de Ação (Confirmar/Cancelar) */}
                                            <VisitActions
                                                id={visit.id}
                                                currentStatus={visit.status}
                                                isAdmin={isAdmin} // Passa permissão para o componente
                                            />

                                            {/* Botão WhatsApp */}
                                            {cleanPhone && (
                                                <a
                                                    href={whatsappLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-lg transition-colors font-bold text-sm"
                                                >
                                                    <Smartphone size={16} /> Falar no WhatsApp
                                                </a>
                                            )}
                                        </div>

                                        {/* Dropdown de Atribuição (SÓ ADMIN) */}
                                        {isAdmin && (
                                            <div className="w-full">
                                                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 flex items-center gap-1">
                                                    <User size={10} /> Corretor Responsável
                                                </label>
                                                <VisitAssigner
                                                    visitId={visit.id}
                                                    // @ts-ignore
                                                    currentAssignedId={visit.assignedToId}
                                                    brokers={brokers}
                                                />
                                            </div>
                                        )}
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
}
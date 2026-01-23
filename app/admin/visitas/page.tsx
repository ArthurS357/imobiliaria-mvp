import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowLeft, Phone, Mail, User } from "lucide-react";
import { VisitActions } from "@/components/admin/VisitActions";
import { VisitAssigner } from "@/components/admin/VisitAssigner"; // <--- Importe o novo componente

export default async function AdminVisitsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/admin/login");

    const isAdmin = session.user.role === "ADMIN";
    const userId = session.user.id;

    let visits = [];
    let brokers: { id: string; name: string }[] = [];

    if (isAdmin) {
        // ADMIN: Busca TUDO e carrega corretores para o dropdown
        visits = await prisma.visit.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                property: { select: { titulo: true, bairro: true } },
                assignedTo: true // Para saber quem já está cuidando
            }
        });

        brokers = await prisma.user.findMany({
            select: { id: true, name: true },
        });
    } else {
        // CORRETOR: Busca apenas as visitas DELE
        visits = await prisma.visit.findMany({
            where: { assignedToId: userId },
            orderBy: { createdAt: "desc" },
            include: {
                property: { select: { titulo: true, bairro: true } }
            }
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {isAdmin ? "Agenda Geral" : "Minhas Visitas"}
                        </h1>
                        <p className="text-gray-500">
                            {isAdmin
                                ? "Distribua as visitas entre a equipe."
                                : "Confira seus agendamentos atribuídos."}
                        </p>
                    </div>
                    <Link href="/admin" className="text-gray-600 hover:text-blue-900 flex items-center gap-2 font-medium">
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                </div>

                <div className="space-y-4">
                    {visits.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900">Nenhuma visita encontrada</h3>
                            <p className="text-gray-500">
                                {isAdmin ? "Nenhum cliente agendou ainda." : "Você não tem visitas agendadas."}
                            </p>
                        </div>
                    ) : (
                        visits.map((visit) => (
                            <div key={visit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between gap-6 transition hover:shadow-md">

                                {/* Informações da Visita */}
                                <div className="space-y-3 flex-grow">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide
                        ${visit.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${visit.status === 'CONFIRMADA' ? 'bg-green-100 text-green-700' : ''}
                        ${visit.status === 'CANCELADA' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                                            {visit.status}
                                        </span>
                                        <span className="text-xs text-gray-400">Solicitado em {new Date(visit.createdAt).toLocaleDateString('pt-BR')}</span>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                            <Calendar size={20} className="text-blue-900" />
                                            {new Date(visit.date).toLocaleDateString('pt-BR')}
                                            <span className="text-gray-300">|</span>
                                            <span className="text-base font-normal text-gray-600 flex items-center gap-1">
                                                <Clock size={16} /> {visit.timeOfDay === "MANHA" ? "Manhã" : "Tarde"}
                                            </span>
                                        </h3>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 inline-block w-full md:w-auto">
                                        <p className="font-bold text-gray-800 mb-1">{visit.name}</p>
                                        <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-600">
                                            <span className="flex items-center gap-1"><Mail size={14} /> {visit.email}</span>
                                            {visit.phone && <span className="flex items-center gap-1"><Phone size={14} /> {visit.phone}</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-blue-900 font-medium">
                                        <MapPin size={16} />
                                        {visit.property.titulo} - {visit.property.bairro}
                                    </div>
                                </div>

                                {/* Coluna da Direita: Ações e Atribuição */}
                                <div className="flex flex-col items-end gap-4 min-w-[160px]">

                                    {/* Botões de Confirmar/Cancelar */}
                                    <VisitActions id={visit.id} currentStatus={visit.status} />

                                    {/* Dropdown de Atribuição (SÓ ADMIN) */}
                                    {isAdmin && (
                                        <div className="border-t border-gray-100 pt-3 w-full flex flex-col items-end">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                                                <User size={10} /> Corretor Responsável
                                            </label>
                                            <VisitAssigner
                                                visitId={visit.id}
                                                // @ts-ignore: O TypeScript pode reclamar se assignedToId for null, mas funciona
                                                currentAssignedId={visit.assignedToId}
                                                brokers={brokers}
                                            />
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
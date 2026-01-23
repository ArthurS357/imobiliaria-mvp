import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowLeft, Phone, Mail } from "lucide-react";
import { VisitActions } from "@/components/admin/VisitActions";

export default async function AdminVisitsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/admin/login");

    // Busca as visitas ordenadas da mais recente para a mais antiga
    const visits = await prisma.visit.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            property: {
                select: { titulo: true, bairro: true }
            }
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Agenda de Visitas</h1>
                        <p className="text-gray-500">Gerencie os pedidos de visita dos clientes.</p>
                    </div>
                    <Link href="/admin" className="text-gray-600 hover:text-blue-900 flex items-center gap-2 font-medium">
                        <ArrowLeft size={20} /> Voltar ao Painel
                    </Link>
                </div>

                {/* Lista de Visitas */}
                <div className="space-y-4">
                    {visits.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900">Nenhuma visita agendada</h3>
                            <p className="text-gray-500">Os agendamentos do site aparecerão aqui.</p>
                        </div>
                    ) : (
                        visits.map((visit) => (
                            <div key={visit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between gap-6 transition hover:shadow-md">

                                {/* Informações Principais */}
                                <div className="space-y-3 flex-grow">
                                    <div className="flex items-center gap-3">
                                        {/* Badge de Status */}
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

                                {/* Botões de Ação */}
                                <div className="flex items-start justify-end">
                                    <VisitActions id={visit.id} currentStatus={visit.status} />
                                </div>

                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, CheckCircle, XCircle, Clock, MapPin, ArrowLeft } from "lucide-react";
import { VisitActions } from "@/components/admin/VisitActions"; 

export default async function AdminVisitsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/admin/login");

    // Busca visitas com dados do imóvel
    const visits = await prisma.visit.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            property: {
                select: { titulo: true, bairro: true, cidade: true, fotos: true }
            }
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
                        <p className="text-gray-500">Gerencie as solicitações de visita.</p>
                    </div>
                    <Link href="/admin" className="text-gray-600 hover:text-blue-900 flex items-center gap-2 font-medium">
                        <ArrowLeft size={20} /> Voltar ao Painel
                    </Link>
                </div>

                {/* Lista de Cards */}
                <div className="grid gap-6">
                    {visits.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900">Nenhuma visita agendada</h3>
                            <p className="text-gray-500">Quando um cliente solicitar, aparecerá aqui.</p>
                        </div>
                    ) : (
                        visits.map((visit) => (
                            <div key={visit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">

                                {/* Status Icon */}
                                <div className="hidden md:block">
                                    {visit.status === "PENDENTE" && <div className="bg-yellow-100 p-3 rounded-full text-yellow-600"><Clock size={24} /></div>}
                                    {visit.status === "CONFIRMADA" && <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle size={24} /></div>}
                                    {visit.status === "CANCELADA" && <div className="bg-red-100 p-3 rounded-full text-red-600"><XCircle size={24} /></div>}
                                </div>

                                {/* Info Principal */}
                                <div className="flex-grow space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide
                        ${visit.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${visit.status === 'CONFIRMADA' ? 'bg-green-100 text-green-700' : ''}
                        ${visit.status === 'CANCELADA' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                                            {visit.status}
                                        </span>
                                        <span className="text-sm text-gray-400">Solicitado em {new Date(visit.createdAt).toLocaleDateString('pt-BR')}</span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900">
                                        {new Date(visit.date).toLocaleDateString('pt-BR')} - {visit.timeOfDay === "MANHA" ? "Manhã" : "Tarde"}
                                    </h3>

                                    <p className="text-gray-600 flex items-center gap-1 text-sm">
                                        <span className="font-semibold">{visit.name}</span> • {visit.email} • {visit.phone}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded w-fit">
                                        <MapPin size={14} />
                                        {visit.property.titulo} ({visit.property.bairro})
                                    </div>
                                </div>

                                {/* Ações (Botões) - Componente Cliente separado para interatividade */}
                                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
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
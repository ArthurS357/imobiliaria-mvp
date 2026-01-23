import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Mail, Phone, Calendar, User } from "lucide-react";
import { LeadAssigner } from "@/components/admin/LeadAssigner";
import { LeadStatusUpdater } from "@/components/admin/LeadStatusUpdater"; // <--- NOVO COMPONENTE

export default async function AdminMessagesPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/admin/login");

    const isAdmin = session.user.role === "ADMIN";
    const userId = session.user.id;

    // Variáveis de dados
    let leads = [];
    let brokers: { id: string; name: string }[] = [];

    if (isAdmin) {
        // ADMIN: Vê todas as mensagens + Carrega lista de corretores
        leads = await prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
            include: { assignedTo: true }
        });

        // Busca usuários (Corretores e Admins)
        brokers = await prisma.user.findMany({
            select: { id: true, name: true },
        });

    } else {
        // CORRETOR: Vê apenas as mensagens atribuídas a ele
        leads = await prisma.lead.findMany({
            where: { assignedToId: userId },
            orderBy: { createdAt: "desc" },
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {isAdmin ? "Central de Leads" : "Meus Leads"}
                        </h1>
                        <p className="text-gray-500">
                            {isAdmin
                                ? "Gerencie e distribua os contatos recebidos."
                                : "Mensagens direcionadas para o seu atendimento."}
                        </p>
                    </div>
                    <Link href="/admin" className="text-gray-600 hover:text-blue-900 flex items-center gap-2 font-medium">
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                </div>

                <div className="space-y-4">
                    {leads.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900">Nenhuma mensagem encontrada</h3>
                            <p className="text-gray-500">
                                {isAdmin
                                    ? "Nenhum cliente entrou em contato ainda."
                                    : "Você não possui leads atribuídos no momento."}
                            </p>
                        </div>
                    ) : (
                        leads.map((lead) => (
                            <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition hover:shadow-md">

                                <div className="flex flex-col md:flex-row justify-between gap-6">

                                    {/* Conteúdo da Mensagem */}
                                    <div className="flex-grow space-y-3">
                                        <div className="flex items-center gap-2">
                                            {/* --- AQUI MUDOU: Componente interativo de Status --- */}
                                            <LeadStatusUpdater id={lead.id} currentStatus={lead.status} />

                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Calendar size={12} /> {new Date(lead.createdAt).toLocaleDateString('pt-BR')} às {new Date(lead.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                                                <span className="flex items-center gap-1 hover:text-blue-600"><Mail size={14} /> {lead.email}</span>
                                                {lead.phone && <span className="flex items-center gap-1 hover:text-green-600"><Phone size={14} /> {lead.phone}</span>}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm italic border-l-4 border-blue-200">
                                            "{lead.message}"
                                        </div>
                                    </div>

                                    {/* Área de Atribuição (SÓ ADMIN VÊ ISSO) */}
                                    {isAdmin && (
                                        <div className="min-w-[200px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                                <User size={12} /> Atribuir Corretor
                                            </label>
                                            <LeadAssigner
                                                leadId={lead.id}
                                                currentAssignedId={lead.assignedToId}
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
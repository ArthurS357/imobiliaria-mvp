import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Mail, Phone, Calendar, User, Smartphone } from "lucide-react";
import { LeadAssigner } from "@/components/admin/LeadAssigner";
import { LeadStatusUpdater } from "@/components/admin/LeadStatusUpdater";
import { DeleteLeadButton } from "@/components/admin/DeleteLeadButton";

export default async function AdminMessagesPage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/admin/login");

    const isAdmin = session.user.role === "ADMIN";
    const userId = session.user.id;

    // Variáveis de dados
    let leads = [];
    let brokers: { id: string; name: string }[] = [];

    // Busca os dados conforme o cargo
    if (isAdmin) {
        // ADMIN: Vê todas as mensagens
        leads = await prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                assignedTo: true,
                property: { // CORREÇÃO: Removemos 'codigo' daqui
                    select: { id: true, titulo: true }
                }
            }
        });

        // Busca lista de corretores para o select de atribuição
        brokers = await prisma.user.findMany({
            select: { id: true, name: true },
        });

    } else {
        // CORRETOR: Vê apenas as suas mensagens
        leads = await prisma.lead.findMany({
            where: { assignedToId: userId },
            orderBy: { createdAt: "desc" },
            include: {
                property: {
                    select: { id: true, titulo: true }
                }
            }
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-500">
            <div className="max-w-5xl mx-auto animate-enter">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                            <MessageSquare className="text-blue-600 dark:text-blue-400" />
                            {isAdmin ? "Central de Leads" : "Meus Leads"}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {isAdmin
                                ? "Gerencie e distribua os contatos recebidos."
                                : "Mensagens direcionadas para o seu atendimento."}
                        </p>
                    </div>
                    <Link href="/admin" className="text-gray-600 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 flex items-center gap-2 font-medium px-4 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                </div>

                <div className="space-y-4">
                    {leads.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                            <MessageSquare className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhuma mensagem encontrada</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {isAdmin
                                    ? "Nenhum cliente entrou em contato ainda."
                                    : "Você não possui leads atribuídos no momento."}
                            </p>
                        </div>
                    ) : (
                        leads.map((lead) => {
                            // Prepara link do WhatsApp
                            const cleanPhone = lead.phone ? lead.phone.replace(/\D/g, "") : "";
                            const whatsappMessage = `Olá ${lead.name.split(" ")[0]}, recebi seu contato pelo site referente ao imóvel "${lead.property?.titulo || 'que você gostou'}". Como posso ajudar?`;
                            const whatsappLink = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

                            return (
                                <div key={lead.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition hover:shadow-md group">

                                    <div className="flex flex-col md:flex-row justify-between gap-6">

                                        {/* Conteúdo da Mensagem */}
                                        <div className="flex-grow space-y-3">

                                            {/* Cabeçalho do Card: Status + Data + Ações */}
                                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-3 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <LeadStatusUpdater id={lead.id} currentStatus={lead.status} />
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')} às {new Date(lead.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Botão WhatsApp */}
                                                    {cleanPhone && (
                                                        <a
                                                            href={whatsappLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase"
                                                            title="Responder no WhatsApp"
                                                        >
                                                            <Smartphone size={16} /> <span className="hidden sm:inline">WhatsApp</span>
                                                        </a>
                                                    )}

                                                    {/* Botão Excluir (Só Admin) */}
                                                    {isAdmin && <DeleteLeadButton id={lead.id} />}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                    {lead.name}
                                                    {lead.property && (
                                                        <Link
                                                            href={`/imoveis/${lead.property.id}`}
                                                            target="_blank"
                                                            className="text-xs font-normal bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 ml-2"
                                                        >
                                                            Ref: {lead.property.titulo}
                                                        </Link>
                                                    )}
                                                </h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
                                                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                        <Mail size={14} /> {lead.email}
                                                    </a>
                                                    {lead.phone && (
                                                        <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                                            <Phone size={14} /> {lead.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg text-gray-700 dark:text-gray-300 text-sm italic border-l-4 border-blue-200 dark:border-blue-500/50 mt-2">
                                                "{lead.message}"
                                            </div>
                                        </div>

                                        {/* Área de Atribuição (SÓ ADMIN VÊ ISSO) */}
                                        {isAdmin && (
                                            <div className="min-w-[220px] border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6 flex flex-col justify-start mt-2 md:mt-0">
                                                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl">
                                                    <label className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase mb-3 flex items-center gap-1.5">
                                                        <User size={14} /> Atribuir Responsável
                                                    </label>
                                                    <LeadAssigner
                                                        leadId={lead.id}
                                                        currentAssignedId={lead.assignedToId}
                                                        brokers={brokers}
                                                    />
                                                    <p className="text-[10px] text-gray-400 mt-2 leading-tight">
                                                        O corretor selecionado verá este lead no painel dele.
                                                    </p>
                                                </div>
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
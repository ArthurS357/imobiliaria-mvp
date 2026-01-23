import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Mail, Calendar, Phone } from "lucide-react";

export default async function AdminLeadsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/admin/login");

    // Buscar mensagens do banco (mais recentes primeiro)
    const leads = await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Mensagens Recebidas</h1>
                        <p className="text-gray-500">Leads interessados que entraram em contato pelo site.</p>
                    </div>
                    <Link href="/admin" className="text-gray-600 hover:text-blue-900 flex items-center gap-2">
                        <ArrowLeft size={20} /> Voltar ao Painel
                    </Link>
                </div>

                <div className="grid gap-4">
                    {leads.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-lg shadow-sm text-gray-500">
                            <Mail size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Nenhuma mensagem recebida ainda.</p>
                        </div>
                    ) : (
                        leads.map((lead) => (
                            <div key={lead.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            {lead.name}
                                            {lead.status === "NOVO" && <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Novo</span>}
                                        </h3>
                                        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline text-sm block">{lead.email}</a>
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar size={14} />
                                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')} às {new Date(lead.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-md text-gray-700 text-sm whitespace-pre-line border border-gray-100">
                                    {lead.message}
                                </div>

                                {lead.phone && (
                                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={16} />
                                        <span className="font-medium">{lead.phone}</span>
                                        <a
                                            href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            className="text-green-600 text-xs font-bold hover:underline ml-2"
                                        >
                                            Chamar no WhatsApp
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
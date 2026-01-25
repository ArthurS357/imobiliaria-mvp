"use client";

import { useState } from "react";
import { Calendar, CheckCircle } from "lucide-react";

interface VisitSchedulerProps {
    propertyId: string;
}

export function VisitScheduler({ propertyId }: VisitSchedulerProps) {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        date: "",
        timeOfDay: "MANHA",
        name: "",
        email: "",
        phone: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/visits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Envia email e phone separados corretamente para o Zod validar
                body: JSON.stringify({ ...formData, propertyId }),
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                // Se der erro, tentamos ler a mensagem do backend
                const data = await res.json();
                console.error(data);
                alert("Erro ao agendar. Verifique os dados (Email deve ser válido).");
            }
        } catch (error) {
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800 text-center animate-enter">
                <div className="bg-green-100 dark:bg-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-200">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Solicitação Enviada!</h3>
                <p className="text-green-700 dark:text-green-400 text-sm">
                    Recebemos seu pedido de visita. Um corretor entrará em contato em breve para confirmar o horário.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-sm font-bold text-green-800 dark:text-green-300 hover:underline"
                >
                    Agendar outra visita
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full text-blue-900 dark:text-blue-400">
                    <Calendar size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Agendar Visita</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Data e Turno */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Data</label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split("T")[0]}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Período</label>
                        <select
                            value={formData.timeOfDay}
                            onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="MANHA">Manhã (08h - 12h)</option>
                            <option value="TARDE">Tarde (13h - 18h)</option>
                        </select>
                    </div>
                </div>

                {/* Nome */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Seu Nome</label>
                    <input
                        type="text"
                        required
                        placeholder="Nome completo"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Email (Obrigatório para validação Zod) */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Email</label>
                    <input
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Telefone (Opcional, mas separado) */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">WhatsApp / Telefone</label>
                    <input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-900 dark:bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 shadow-md"
                >
                    {loading ? "Enviando..." : "Solicitar Agendamento"}
                </button>

                <p className="text-xs text-gray-400 text-center">
                    *A confirmação será feita pelo corretor responsável.
                </p>
            </form>
        </div>
    );
}
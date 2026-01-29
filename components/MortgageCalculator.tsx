"use client";

import { useState, useEffect } from "react";
import { Calculator, DollarSign, TrendingDown, Minus } from "lucide-react";

interface CalculatorProps {
    propertyPrice: number;
}

export function MortgageCalculator({ propertyPrice }: CalculatorProps) {
    // Estados
    const [entrada, setEntrada] = useState(propertyPrice * 0.2);
    const [anos, setAnos] = useState(30);
    const [jurosAnuais, setJurosAnuais] = useState(10.5);
    const [sistema, setSistema] = useState<"PRICE" | "SAC">("SAC");

    // Resultados
    const [resultado, setResultado] = useState({
        primeira: 0,
        ultima: 0,
        mensalidadeFixa: 0
    });

    useEffect(() => {
        // Se o valor for muito baixo (ex: possível aluguel), não calcula ou reseta
        if (propertyPrice < 10000) {
            setResultado({ primeira: 0, ultima: 0, mensalidadeFixa: 0 });
            return;
        }

        const valorFinanciado = propertyPrice - entrada;
        const meses = anos * 12;
        const taxaMensal = jurosAnuais / 12 / 100;

        if (valorFinanciado <= 0) {
            setResultado({ primeira: 0, ultima: 0, mensalidadeFixa: 0 });
            return;
        }

        if (sistema === "PRICE") {
            // Tabela Price: Parcelas fixas
            // PMT = PV * i / (1 - (1+i)^-n)
            const parcela = (valorFinanciado * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -meses));
            setResultado({
                primeira: 0,
                ultima: 0,
                mensalidadeFixa: isFinite(parcela) ? parcela : 0
            });
        } else {
            // Tabela SAC: Amortização constante, parcelas decrescentes
            const amortizacao = valorFinanciado / meses;

            // Primeira parcela: Amortização + Juros sobre o total
            const juros1 = valorFinanciado * taxaMensal;
            const pmt1 = amortizacao + juros1;

            // Última parcela: Amortização + Juros sobre o saldo devedor (que é igual a 1 amortização)
            const jurosFinal = amortizacao * taxaMensal;
            const pmtFinal = amortizacao + jurosFinal;

            setResultado({
                primeira: pmt1,
                ultima: pmtFinal,
                mensalidadeFixa: 0
            });
        }
    }, [propertyPrice, entrada, anos, jurosAnuais, sistema]);

    // Oculta calculadora se o valor for irrelevante (ex: imóvel de locação barato)
    if (propertyPrice < 1000) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-8 transition-colors duration-300">
            {/* Cabeçalho */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-700 dark:text-green-400 transition-colors">
                    <Calculator size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white transition-colors">
                    Simulador de Financiamento
                </h3>
            </div>

            <div className="space-y-5">
                {/* Valor do Imóvel */}
                <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase transition-colors">Valor do Imóvel</label>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-500 dark:text-gray-300 cursor-not-allowed transition-colors border border-transparent dark:border-gray-600 mt-1">
                        <DollarSign size={16} />
                        <span className="font-bold">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(propertyPrice)}
                        </span>
                    </div>
                </div>

                {/* Entrada */}
                <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase transition-colors">Valor de Entrada (R$)</label>
                    <input
                        type="number"
                        value={entrada}
                        onChange={(e) => setEntrada(Number(e.target.value))}
                        className="w-full mt-1 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                    />
                </div>

                {/* Prazo e Juros */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase transition-colors">Prazo (Anos)</label>
                        <select
                            value={anos}
                            onChange={(e) => setAnos(Number(e.target.value))}
                            className="w-full mt-1 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        >
                            <option value="10">10 Anos</option>
                            <option value="15">15 Anos</option>
                            <option value="20">20 Anos</option>
                            <option value="25">25 Anos</option>
                            <option value="30">30 Anos</option>
                            <option value="35">35 Anos</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase transition-colors">Juros (% a.a)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={jurosAnuais}
                            onChange={(e) => setJurosAnuais(Number(e.target.value))}
                            className="w-full mt-1 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                    </div>
                </div>

                {/* Seletor de Sistema */}
                <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase transition-colors">Sistema de Amortização</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                            onClick={() => setSistema("PRICE")}
                            className={`p-2 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2
                                ${sistema === "PRICE"
                                    ? "bg-green-50 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-300"
                                    : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                                }`}
                        >
                            <Minus size={16} /> PRICE (Fixas)
                        </button>
                        <button
                            onClick={() => setSistema("SAC")}
                            className={`p-2 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2
                                ${sistema === "SAC"
                                    ? "bg-green-50 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-300"
                                    : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                                }`}
                        >
                            <TrendingDown size={16} /> SAC (Decres.)
                        </button>
                    </div>
                </div>

                {/* Resultado */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 mt-2 text-center border border-green-100 dark:border-green-800/30 transition-colors">
                    <p className="text-green-800 dark:text-green-300 text-sm font-medium mb-1 transition-colors">
                        {sistema === "PRICE" ? "Parcela Mensal Estimada" : "Primeira Parcela Estimada"}
                    </p>

                    <p className="text-3xl font-extrabold text-green-700 dark:text-green-400 transition-colors">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            sistema === "PRICE" ? resultado.mensalidadeFixa : resultado.primeira
                        )}
                    </p>

                    {/* Exibe a última parcela apenas se for SAC */}
                    {sistema === "SAC" && (
                        <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800/50">
                            <p className="text-xs text-green-600 dark:text-green-400/80">
                                Última parcela: <span className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.ultima)}</span>
                            </p>
                        </div>
                    )}

                    <p className="text-[10px] text-green-600 dark:text-green-500/80 mt-2 transition-colors">
                        *Simulação aproximada. {sistema === "SAC" ? "No SAC as parcelas diminuem mensalmente." : "Na Tabela Price as parcelas são fixas."}
                    </p>
                </div>
            </div>
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { Calculator, DollarSign } from "lucide-react";

interface CalculatorProps {
    propertyPrice: number;
}

export function MortgageCalculator({ propertyPrice }: CalculatorProps) {
    // Estados com valores iniciais
    const [entrada, setEntrada] = useState(propertyPrice * 0.2); // Sugere 20% de entrada
    const [anos, setAnos] = useState(30); // Padrão 30 anos
    const [jurosAnuais, setJurosAnuais] = useState(10.5); // Média de mercado (10.5% a.a)
    const [mensalidade, setMensalidade] = useState(0);

    // Função de Cálculo (Sistema Price)
    useEffect(() => {
        const valorFinanciado = propertyPrice - entrada;
        const meses = anos * 12;
        const taxaMensal = jurosAnuais / 12 / 100;

        if (valorFinanciado <= 0) {
            setMensalidade(0);
            return;
        }

        // Fórmula: PMT = PV * i / (1 - (1+i)^-n)
        const parcela = (valorFinanciado * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -meses));

        setMensalidade(isFinite(parcela) ? parcela : 0);
    }, [propertyPrice, entrada, anos, jurosAnuais]);

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

            <div className="space-y-4">
                {/* Valor do Imóvel (Visual apenas) */}
                <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase transition-colors">Valor do Imóvel</label>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-500 dark:text-gray-300 cursor-not-allowed transition-colors border border-transparent dark:border-gray-600">
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

                {/* Prazo e Juros (Lado a Lado) */}
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

                {/* Resultado */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 mt-4 text-center border border-green-100 dark:border-green-800/30 transition-colors">
                    <p className="text-green-800 dark:text-green-300 text-sm font-medium mb-1 transition-colors">Parcela Estimada Mensal</p>
                    <p className="text-3xl font-extrabold text-green-700 dark:text-green-400 transition-colors">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mensalidade)}
                    </p>
                    <p className="text-[10px] text-green-600 dark:text-green-500/80 mt-2 transition-colors">
                        *Simulação aproximada. Consulte seu banco para taxas exatas.
                    </p>
                </div>
            </div>
        </div>
    );
}
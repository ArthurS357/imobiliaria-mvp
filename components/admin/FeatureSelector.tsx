"use client";

import { CheckSquare } from "lucide-react";
import { PROPERTY_FEATURES_CATEGORIZED } from "@/lib/constants";

interface FeatureSelectorProps {
    selectedFeatures: string[];
    onChange: (features: string[]) => void;
}

export function FeatureSelector({ selectedFeatures, onChange }: FeatureSelectorProps) {

    const toggleFeature = (feature: string) => {
        if (selectedFeatures.includes(feature)) {
            // Remove se já existe
            onChange(selectedFeatures.filter((f) => f !== feature));
        } else {
            // Adiciona se não existe
            onChange([...selectedFeatures, feature]);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <CheckSquare className="text-blue-600 dark:text-blue-400" size={20} />
                    <h2 className="font-bold text-gray-800 dark:text-white">
                        Checklist de Características
                    </h2>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Selecione os diferenciais do imóvel por categoria.
                </p>
            </div>

            <div className="p-6 space-y-8">
                {PROPERTY_FEATURES_CATEGORIZED.map((group) => (
                    <div key={group.category}>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 border-l-4 border-[#eaca42] pl-3">
                            {group.category}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {group.features.map((feature) => {
                                const isSelected = selectedFeatures.includes(feature);
                                return (
                                    <label
                                        key={feature}
                                        className={`
                                            flex items-center space-x-2 cursor-pointer p-2.5 rounded-lg border transition-all duration-200
                                            ${isSelected
                                                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                                                : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                            }
                                        `}
                                    >
                                        <div className="relative flex items-center shrink-0">
                                            <input
                                                type="checkbox"
                                                value={feature}
                                                checked={isSelected}
                                                onChange={() => toggleFeature(feature)}
                                                className="peer sr-only" // Esconde o checkbox nativo
                                            />
                                            {/* Checkbox Customizado */}
                                            <div className={`
                                                w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                ${isSelected
                                                    ? "bg-[#eaca42] border-[#eaca42]"
                                                    : "bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                                                }
                                            `}>
                                                {isSelected && (
                                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`text-sm select-none leading-tight ${isSelected ? "font-medium text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}>
                                            {feature}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
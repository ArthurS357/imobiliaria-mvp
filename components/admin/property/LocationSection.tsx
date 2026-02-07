"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MapPin, FileText, Map as MapIcon, EyeOff, Search, Loader2 } from "lucide-react";
import { PropertyFormData, LocationMode } from "./types"; // Ensure LocationMode is imported
import { useLocation } from "./useLocation";

// Importação dinâmica do mapa (mantendo performance)
const LocationPicker = dynamic(() => import("@/components/admin/LocationPicker"), {
    ssr: false,
    loading: () => (
        <div className="h-[350px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
            Carregando mapa...
        </div>
    ),
});

interface LocationSectionProps {
    formData: PropertyFormData;
    setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function LocationSection({ formData, setFormData, handleChange }: LocationSectionProps) {
    // Consuming the extracted logic
    const { loadingCep, handleBlurCep, updateCoordinate } = useLocation(formData, setFormData);

    // Wrapper for CEP Blur to reset coordinates
    const onCepBlur = () => {
        setFormData((prev) => ({
            ...prev,
            latitude: null,
            longitude: null,
        }));
        handleBlurCep();
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-blue-50/50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
                <h2 className="font-bold text-gray-800 dark:text-white">6. Localização</h2>
            </div>
            <div className="p-6">
                {/* REORDERED: Map (1st), Address (2nd), Hide (3rd) */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <label
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.locationMode === "map"
                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                : "bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <input
                            type="radio"
                            name="locationMode"
                            value="map"
                            checked={formData.locationMode === "map"}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    locationMode: e.target.value as LocationMode,
                                }))
                            }
                            className="hidden"
                        />
                        <MapIcon size={18} /> Mapa & Endereço
                    </label>

                    <label
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.locationMode === "address"
                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                : "bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <input
                            type="radio"
                            name="locationMode"
                            value="address"
                            checked={formData.locationMode === "address"}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    locationMode: e.target.value as LocationMode,
                                }))
                            }
                            className="hidden"
                        />
                        <FileText size={18} /> Somente Endereço
                    </label>

                    <label
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.locationMode === "none"
                                ? "bg-red-50 text-red-600 border-red-200 shadow-sm"
                                : "bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <input
                            type="radio"
                            name="locationMode"
                            value="none"
                            checked={formData.locationMode === "none"}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    locationMode: e.target.value as LocationMode,
                                }))
                            }
                            className="hidden"
                        />
                        <EyeOff size={18} /> Ocultar
                    </label>
                </div>

                {formData.locationMode !== "none" && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-1 dark:text-gray-300">CEP</label>
                            <div className="relative max-w-xs">
                                <input
                                    name="cep"
                                    value={formData.cep}
                                    onChange={handleChange}
                                    onBlur={onCepBlur}
                                    placeholder="00000-000"
                                    className="w-full p-3 pl-3 pr-10 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                                <div className="absolute right-3 top-3 text-gray-400">
                                    {loadingCep ? (
                                        <Loader2 size={20} className="animate-spin text-blue-600" />
                                    ) : (
                                        <Search size={20} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">
                                    Cidade *
                                </label>
                                <input
                                    required
                                    name="cidade"
                                    value={formData.cidade}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">
                                    Bairro *
                                </label>
                                <input
                                    required
                                    name="bairro"
                                    value={formData.bairro}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">
                                    Endereço
                                </label>
                                <input
                                    name="endereco"
                                    value={formData.endereco}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        {formData.locationMode === "map" && (
                            <div className="mb-6 p-4 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10">
                                <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">
                                            Mapa Interativo
                                        </p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                            Arraste o marcador ou clique no mapa para definir a posição exata.
                                        </p>
                                    </div>

                                    {/* Manual Inputs */}
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <div className="w-1/2 md:w-32">
                                            <label className="block text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                                                Latitude
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                min="-90"
                                                max="90"
                                                value={formData.latitude ?? ""}
                                                onChange={(e) => updateCoordinate("latitude", e.target.value)}
                                                className="w-full p-2 text-sm border border-blue-200 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                placeholder="-23.00"
                                            />
                                        </div>
                                        <div className="w-1/2 md:w-32">
                                            <label className="block text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                                                Longitude
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                min="-180"
                                                max="180"
                                                value={formData.longitude ?? ""}
                                                onChange={(e) => updateCoordinate("longitude", e.target.value)}
                                                className="w-full p-2 text-sm border border-blue-200 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                placeholder="-46.00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden">
                                    <LocationPicker
                                        lat={formData.latitude ?? -23.5505}
                                        lng={formData.longitude ?? -46.6333}
                                        onLocationChange={(lat, lng) =>
                                            setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="displayAddress"
                                    checked={formData.displayAddress}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-green-600 rounded"
                                />
                                <span className="dark:text-gray-300">Mostrar endereço público</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="displayDetails"
                                    checked={formData.displayDetails}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-green-600 rounded"
                                />
                                <span className="dark:text-gray-300">Mostrar detalhes</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
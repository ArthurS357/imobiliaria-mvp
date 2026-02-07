import { useState } from "react";
import { toast } from "react-hot-toast";
import { PropertyFormData } from "./types";

export function useLocation(
    formData: PropertyFormData,
    setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
    const [loadingCep, setLoadingCep] = useState(false);

    const NOMINATIM_HEADERS = {
        "User-Agent": "property-platform/1.0 (contato@seusite.com)"
    };

    const handleBlurCep = async () => {
        const cep = formData.cep.replace(/\D/g, "");
        if (cep.length !== 8) return;

        setLoadingCep(true);

        try {
            const resEnd = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const endData = await resEnd.json();

            if (!endData.erro) {
                setFormData((prev) => ({
                    ...prev,
                    endereco: endData.logradouro || "",
                    bairro: endData.bairro || "",
                    cidade: endData.localidade || "",
                }));

                toast.success("Endereço encontrado!");

                try {
                    const fullQuery = `${endData.logradouro}, ${endData.localidade}, ${endData.uf}, Brazil`;

                    const resGeo = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            fullQuery
                        )}&limit=1`,
                        { headers: NOMINATIM_HEADERS }
                    );

                    const geoData = await resGeo.json();

                    if (geoData?.[0]) {
                        setLatLng(
                            Number(geoData[0].lat),
                            Number(geoData[0].lon)
                        );
                        return;
                    }

                    // Fallback
                    const cityQuery = `${endData.bairro}, ${endData.localidade}, ${endData.uf}, Brazil`;

                    const resCity = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            cityQuery
                        )}&limit=1`,
                        { headers: NOMINATIM_HEADERS }
                    );

                    const cityData = await resCity.json();

                    if (cityData?.[0]) {
                        setLatLng(
                            Number(cityData[0].lat),
                            Number(cityData[0].lon)
                        );
                    }

                } catch (e) {
                    console.warn("Erro ao buscar geolocalização automática", e);
                }

            } else {
                toast.error("CEP não encontrado.");
            }

        } catch (error) {
            console.error(error);
            toast.error("Erro ao buscar CEP.");
        } finally {
            setLoadingCep(false);
        }
    };

    const isValidLat = (lat: number) => lat >= -90 && lat <= 90;
    const isValidLng = (lng: number) => lng >= -180 && lng <= 180;

    const setLatLng = (lat: number, lng: number) => {
        if (!isValidLat(lat) || !isValidLng(lng)) {
            toast.error("Coordenadas inválidas");
            return;
        }

        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    const updateCoordinate = (
        field: "latitude" | "longitude",
        value: string
    ) => {
        if (value === "") {
            setFormData(prev => ({ ...prev, [field]: null }));
            return;
        }

        const numValue = parseFloat(value);

        if (isNaN(numValue)) return;

        if (field === "latitude" && !isValidLat(numValue)) {
            toast.error("Latitude deve estar entre -90 e 90");
            return;
        }

        if (field === "longitude" && !isValidLng(numValue)) {
            toast.error("Longitude deve estar entre -180 e 180");
            return;
        }

        setFormData(prev => ({ ...prev, [field]: numValue }));
    };

    return {
        loadingCep,
        handleBlurCep,
        updateCoordinate,
        setLatLng,
    };
}

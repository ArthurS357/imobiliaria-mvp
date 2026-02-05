"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Correção para os ícones padrão do Leaflet que somem no build do Next.js
const icon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface LocationPickerProps {
    lat: number;
    lng: number;
    onLocationChange: (lat: number, lng: number) => void;
}

// Componente interno para atualizar a visão do mapa quando as coordenadas mudam via CEP
function MapController({ lat, lng, onLocationChange }: LocationPickerProps) {
    const map = useMapEvents({
        // Opcional: Permitir clicar no mapa para mover o marcador
        click(e) {
            onLocationChange(e.latlng.lat, e.latlng.lng);
        },
    });

    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);

    return (
        <Marker
            position={[lat, lng]}
            icon={icon}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    onLocationChange(position.lat, position.lng);
                },
            }}
        />
    );
}

export default function LocationPicker({ lat, lng, onLocationChange }: LocationPickerProps) {
    // Coordenada padrão (Centro de São Paulo/Brasil) se não houver dados
    const defaultLat = -23.5505;
    const defaultLng = -46.6333;

    const centerLat = lat || defaultLat;
    const centerLng = lng || defaultLng;

    return (
        <MapContainer
            center={[centerLat, centerLng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: "350px", width: "100%", borderRadius: "0.75rem", zIndex: 1 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController lat={centerLat} lng={centerLng} onLocationChange={onLocationChange} />
        </MapContainer>
    );
}
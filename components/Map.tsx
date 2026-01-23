"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

// Corrige o ícone padrão do Leaflet que buga no Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface Property {
    id: string;
    titulo: string;
    preco: number;
    latitude?: number;
    longitude?: number;
    fotos?: string;
}

interface MapProps {
    properties: Property[];
}

export default function Map({ properties }: MapProps) {
    // Filtra imóveis que têm coordenadas válidas
    const pins = properties.filter(p => p.latitude && p.longitude);

    if (pins.length === 0) {
        return <div className="h-96 bg-gray-100 flex items-center justify-center text-gray-500">Nenhum imóvel com localização cadastrada.</div>;
    }

    // Centraliza no primeiro imóvel encontrado
    const centerPosition: [number, number] = [pins[0].latitude!, pins[0].longitude!];

    return (
        <MapContainer center={centerPosition} zoom={13} style={{ height: "100%", width: "100%", borderRadius: "12px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {pins.map((property) => (
                <Marker
                    key={property.id}
                    position={[property.latitude!, property.longitude!]}
                    icon={icon}
                >
                    <Popup>
                        <div className="text-center">
                            <strong className="block text-sm mb-1">{property.titulo}</strong>
                            <span className="text-blue-900 font-bold block mb-2">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                            </span>
                            <Link
                                href={`/imoveis/${property.id}`}
                                className="text-xs bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-800"
                            >
                                Ver Detalhes
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
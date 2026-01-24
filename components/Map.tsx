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

// Interface atualizada para aceitar 'null' do banco de dados
interface Property {
    id: string;
    titulo: string;
    preco: number;
    // CORREÇÃO AQUI: Adicionado '| null'
    latitude?: number | null;
    longitude?: number | null;
    fotos?: string | null; // Fotos também podem vir null do banco
}

interface MapProps {
    properties: Property[];
}

export default function Map({ properties }: MapProps) {
    // Filtra imóveis que têm coordenadas válidas (exclui null e undefined)
    const pins = properties.filter(p => p.latitude && p.longitude);

    if (pins.length === 0) {
        return (
            <div className="h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 rounded-xl transition-colors">
                Nenhuma localização disponível.
            </div>
        );
    }

    // Centraliza no primeiro imóvel encontrado
    // O '!' força o TypeScript a entender que não é null, pois já filtramos acima
    const centerPosition: [number, number] = [pins[0].latitude!, pins[0].longitude!];

    return (
        <MapContainer
            center={centerPosition}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: "1rem", zIndex: 0 }}
        >
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
                        <div className="text-center min-w-[150px]">
                            <strong className="block text-sm mb-1 text-gray-900">{property.titulo}</strong>
                            <span className="text-blue-900 font-bold block mb-3">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                            </span>
                            <Link
                                href={`/imoveis/${property.id}`}
                                className="inline-block text-xs bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition-colors"
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
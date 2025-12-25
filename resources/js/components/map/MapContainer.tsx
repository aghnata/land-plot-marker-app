import 'leaflet/dist/leaflet.css';
import { type ReactNode } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';

interface MapContainerProps {
    children?: ReactNode;
    center?: [number, number];
    zoom?: number;
    className?: string;
    onClick?: (lat: number, lng: number) => void;
}

export default function MapContainer({
    children,
    center = [-6.2088, 106.8456], // Default to Jakarta, Indonesia
    zoom = 13,
    className = '',
}: MapContainerProps) {
    return (
        <LeafletMapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            className={`h-full w-full ${className}`}
            style={{ minHeight: '400px' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {children}
        </LeafletMapContainer>
    );
}

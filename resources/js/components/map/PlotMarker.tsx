import { type Coordinate } from '@/types/land-plot';
import L, { type LeafletEvent } from 'leaflet';
import { Marker } from 'react-leaflet';

interface PlotMarkerProps {
    position: Coordinate;
    index: number;
    draggable?: boolean;
    onDragEnd?: (index: number, newPosition: Coordinate) => void;
}

// Custom marker icon
const createMarkerIcon = (index: number) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-lg ring-2 ring-white">${index + 1}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

export default function PlotMarker({
    position,
    index,
    draggable = false,
    onDragEnd,
}: PlotMarkerProps) {
    return (
        <Marker
            position={[position.lat, position.lng]}
            icon={createMarkerIcon(index)}
            draggable={draggable}
            eventHandlers={{
                dragend: (e: LeafletEvent) => {
                    if (onDragEnd) {
                        const marker = e.target as L.Marker;
                        const pos = marker.getLatLng();
                        onDragEnd(index, { lat: pos.lat, lng: pos.lng });
                    }
                },
            }}
        />
    );
}

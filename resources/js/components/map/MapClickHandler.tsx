import { type Coordinate } from '@/types/land-plot';
import { type LeafletMouseEvent } from 'leaflet';
import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
    onMapClick: (coord: Coordinate) => void;
    disabled?: boolean;
}

export default function MapClickHandler({ onMapClick, disabled = false }: MapClickHandlerProps) {
    useMapEvents({
        click: (e: LeafletMouseEvent) => {
            if (!disabled) {
                onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
            }
        },
    });

    return null;
}

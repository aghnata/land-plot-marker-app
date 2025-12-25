import { type Coordinate } from '@/types/land-plot';
import { Marker } from '@react-google-maps/api';

interface GPlotMarkerProps {
    position: Coordinate;
    index: number;
    draggable?: boolean;
    onDragEnd?: (index: number, newPosition: Coordinate) => void;
}

export default function GPlotMarker({
    position,
    index,
    draggable = false,
    onDragEnd,
}: GPlotMarkerProps) {
    return (
        <Marker
            position={{ lat: position.lat, lng: position.lng }}
            draggable={draggable}
            label={{
                text: String(index + 1),
                color: 'white',
                fontWeight: 'bold',
            }}
            onDragEnd={(e) => {
                if (onDragEnd && e.latLng) {
                    onDragEnd(index, { lat: e.latLng.lat(), lng: e.latLng.lng() });
                }
            }}
        />
    );
}

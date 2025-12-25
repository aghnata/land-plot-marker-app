import { type Coordinate } from '@/types/land-plot';
import { Circle, CircleMarker, Tooltip } from 'react-leaflet';

interface CurrentLocationMarkerProps {
    position: Coordinate;
    accuracy?: number | null; // Accuracy in meters
}

export default function CurrentLocationMarker({ position, accuracy }: CurrentLocationMarkerProps) {
    // Use actual accuracy or default to 50m
    const radiusMeters = accuracy || 50;

    return (
        <>
            {/* Accuracy circle - shows real GPS accuracy */}
            <Circle
                center={[position.lat, position.lng]}
                radius={radiusMeters}
                pathOptions={{
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.15,
                    weight: 2,
                    dashArray: '5, 5',
                }}
            />
            {/* Center dot - your location */}
            <CircleMarker
                center={[position.lat, position.lng]}
                radius={10}
                pathOptions={{
                    color: '#ffffff',
                    fillColor: '#3b82f6',
                    fillOpacity: 1,
                    weight: 3,
                }}
            >
                <Tooltip permanent={false} direction="top" offset={[0, -10]}>
                    You are here {accuracy ? `(±${Math.round(accuracy)}m)` : ''}
                </Tooltip>
            </CircleMarker>
        </>
    );
}


import { type Coordinate } from '@/types/land-plot';
import { Circle, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

interface GCurrentLocationMarkerProps {
    position: Coordinate;
    accuracy?: number | null; // Accuracy in meters
}

export default function GCurrentLocationMarker({ position, accuracy }: GCurrentLocationMarkerProps) {
    const [showInfo, setShowInfo] = useState(false);
    // Use actual accuracy or default to 50m
    const radiusMeters = accuracy || 50;

    return (
        <>
            {/* Accuracy circle - shows real GPS accuracy */}
            <Circle
                center={{ lat: position.lat, lng: position.lng }}
                radius={radiusMeters}
                options={{
                    fillColor: '#3b82f6',
                    fillOpacity: 0.15,
                    strokeColor: '#3b82f6',
                    strokeWeight: 2,
                    clickable: false,
                }}
            />
            {/* Center dot */}
            <Circle
                center={{ lat: position.lat, lng: position.lng }}
                radius={8}
                options={{
                    fillColor: '#3b82f6',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 3,
                    clickable: false,
                }}
            />
        </>
    );
}

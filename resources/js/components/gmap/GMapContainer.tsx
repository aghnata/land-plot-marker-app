import { type ReactNode } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

interface GMapContainerProps {
    children?: ReactNode;
    center?: { lat: number; lng: number };
    zoom?: number;
    className?: string;
    onClick?: (lat: number, lng: number) => void;
}

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '400px',
};

const defaultCenter = { lat: -6.2088, lng: 106.8456 }; // Jakarta

export default function GMapContainer({
    children,
    center = defaultCenter,
    zoom = 18,
    onClick,
}: GMapContainerProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    });

    if (loadError) {
        return (
            <div className="flex h-full min-h-[400px] items-center justify-center bg-muted/50">
                <p className="text-sm text-destructive">Error loading Google Maps</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex h-full min-h-[400px] items-center justify-center bg-muted/50">
                <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={zoom}
            onClick={(e) => {
                if (onClick && e.latLng) {
                    onClick(e.latLng.lat(), e.latLng.lng());
                }
            }}
            options={{
                mapTypeId: 'roadmap',
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true,
                zoomControl: true,
                clickableIcons: false, // Disable POI clicks so map click works
                gestureHandling: 'greedy', // Allow all gestures without Ctrl key
                disableDoubleClickZoom: true, // Prevent double-click zoom interfering
            }}
        >
            {children}
        </GoogleMap>
    );
}

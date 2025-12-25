import { useEffect, useState } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
    loading: boolean;
}

export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState((prev) => ({
                ...prev,
                error: 'Geolocation is not supported by your browser',
                loading: false,
            }));
            return;
        }

        // Use watchPosition for continuous updates - gets more accurate over time
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setState({
                    latitude,
                    longitude,
                    accuracy,
                    error: null,
                    loading: false,
                });
            },
            (error) => {
                setState((prev) => ({
                    ...prev,
                    error: error.message,
                    loading: false,
                }));
            },
            {
                enableHighAccuracy: true, // Use GPS for accurate position
                timeout: 60000, // Wait up to 60 seconds for GPS fix
                maximumAge: 0, // Always get fresh position
            },
        );

        // Cleanup: stop watching when component unmounts
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return state;
}

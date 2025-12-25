import { type Coordinate } from '@/types/land-plot';
import { Polygon } from '@react-google-maps/api';

interface GPlotPolygonProps {
    points: Coordinate[];
    isSelected?: boolean;
    onClick?: () => void;
}

export default function GPlotPolygon({
    points,
    isSelected = false,
    onClick,
}: GPlotPolygonProps) {
    const paths = points.map((p) => ({ lat: p.lat, lng: p.lng }));

    return (
        <Polygon
            paths={paths}
            options={{
                fillColor: isSelected ? '#f59e0b' : '#3b82f6',
                fillOpacity: isSelected ? 0.5 : 0.3,
                strokeColor: isSelected ? '#f59e0b' : '#3b82f6',
                strokeWeight: isSelected ? 3 : 2,
                clickable: true,
            }}
            onClick={onClick}
        />
    );
}

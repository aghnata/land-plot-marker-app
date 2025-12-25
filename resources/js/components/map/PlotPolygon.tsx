import { type Coordinate } from '@/types/land-plot';
import { Polygon } from 'react-leaflet';

interface PlotPolygonProps {
    points: Coordinate[];
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
    isSelected?: boolean;
    onClick?: () => void;
}

export default function PlotPolygon({
    points,
    color = '#3b82f6',
    fillColor = '#3b82f6',
    fillOpacity = 0.3,
    isSelected = false,
    onClick,
}: PlotPolygonProps) {
    const positions: [number, number][] = points.map((p) => [p.lat, p.lng]);

    return (
        <Polygon
            positions={positions}
            pathOptions={{
                color: isSelected ? '#f59e0b' : color,
                fillColor: isSelected ? '#f59e0b' : fillColor,
                fillOpacity: isSelected ? 0.5 : fillOpacity,
                weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{
                click: onClick,
            }}
        />
    );
}

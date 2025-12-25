import { CurrentLocationMarker, MapClickHandler, MapContainer, PlotMarker, PlotPolygon } from '@/components/map';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGeolocation } from '@/hooks/use-geolocation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Coordinate } from '@/types/land-plot';
import { Head, router } from '@inertiajs/react';
import { Loader2, MapPin, RotateCcw, Save } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Land Plots', href: '/land-plots' },
    { title: 'Create', href: '/land-plots/create' },
];

export default function Create() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [boundaryPoints, setBoundaryPoints] = useState<Coordinate[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { latitude, longitude, accuracy, loading: geoLoading } = useGeolocation();

    // Get map center from current location or default
    const getMapCenter = (): [number, number] => {
        if (latitude && longitude) {
            return [latitude, longitude];
        }
        return [-6.2088, 106.8456]; // Default Jakarta
    };

    const handleMapClick = (coord: Coordinate) => {
        if (boundaryPoints.length < 4) {
            setBoundaryPoints([...boundaryPoints, coord]);
        }
    };

    const handleMarkerDrag = (index: number, newPosition: Coordinate) => {
        const updated = [...boundaryPoints];
        updated[index] = newPosition;
        setBoundaryPoints(updated);
    };

    const handleReset = () => {
        setBoundaryPoints([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        router.post(
            '/land-plots',
            {
                name,
                description,
                boundary_points: boundaryPoints,
            },
            {
                onError: (errors) => {
                    setErrors(errors as Record<string, string>);
                    setIsSubmitting(false);
                },
                onSuccess: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const canSubmit = name.trim() !== '' && boundaryPoints.length === 4;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Land Plot" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:flex-row">
                {/* Form Sidebar */}
                <div className="w-full lg:w-96 lg:shrink-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Plot</CardTitle>
                            <CardDescription>
                                Click on the map to define 4 boundary points for your land plot.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Plot Name *</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., North Field"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Optional description"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Boundary Points</Label>
                                        <span className="text-sm text-muted-foreground">
                                            {boundaryPoints.length}/4
                                        </span>
                                    </div>

                                    <div className="rounded-lg border bg-muted/50 p-3">
                                        {boundaryPoints.length === 0 ? (
                                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                Click on the map to add points
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                {boundaryPoints.map((point, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-2 text-xs"
                                                    >
                                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="font-mono">
                                                            {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {errors.boundary_points && (
                                        <p className="text-sm text-destructive">
                                            {errors.boundary_points}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleReset}
                                        disabled={boundaryPoints.length === 0}
                                        className="flex-1"
                                    >
                                        <RotateCcw className="mr-1 h-4 w-4" />
                                        Reset
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!canSubmit || isSubmitting}
                                        className="flex-1"
                                    >
                                        <Save className="mr-1 h-4 w-4" />
                                        {isSubmitting ? 'Saving...' : 'Save Plot'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Map View */}
                <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {geoLoading ? (
                        <div className="flex h-full min-h-[400px] items-center justify-center bg-muted/50">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Getting your location...</p>
                            </div>
                        </div>
                    ) : (
                        <MapContainer center={getMapCenter()} zoom={19}>
                            <MapClickHandler
                                onMapClick={handleMapClick}
                                disabled={boundaryPoints.length >= 4}
                            />
                            {latitude && longitude && (
                                <CurrentLocationMarker position={{ lat: latitude, lng: longitude }} accuracy={accuracy} />
                            )}
                            {boundaryPoints.map((point, idx) => (
                                <PlotMarker
                                    key={idx}
                                    position={point}
                                    index={idx}
                                    draggable
                                    onDragEnd={handleMarkerDrag}
                                />
                            ))}
                            {boundaryPoints.length >= 3 && (
                                <PlotPolygon points={boundaryPoints} fillOpacity={0.2} />
                            )}
                        </MapContainer>
                    )}

                    {/* Hint overlay */}
                    {!geoLoading && boundaryPoints.length < 4 && (
                        <div className="pointer-events-none absolute left-4 top-4 rounded-lg bg-background/90 px-3 py-2 shadow-lg">
                            <p className="text-sm font-medium">
                                {boundaryPoints.length === 0
                                    ? 'Click on the map to place the first point'
                                    : `Click to place point ${boundaryPoints.length + 1} of 4`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

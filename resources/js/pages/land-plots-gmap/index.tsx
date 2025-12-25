import { GCurrentLocationMarker, GMapContainer, GPlotPolygon } from '@/components/gmap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/use-geolocation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type LandPlot } from '@/types/land-plot';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Loader2, Map, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    plots: LandPlot[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Land Plots Gmap', href: '/land-plots-gmap' },
];

export default function Index({ plots }: Props) {
    const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
    const { latitude, longitude, accuracy, loading: geoLoading } = useGeolocation();

    const selectedPlot = plots.find((p) => p.id === selectedPlotId);

    const getMapCenter = (): { lat: number; lng: number } => {
        const plot = selectedPlot || plots[0];
        if (plot && plot.boundary_points.length > 0) {
            const avgLat = plot.boundary_points.reduce((sum, p) => sum + p.lat, 0) / plot.boundary_points.length;
            const avgLng = plot.boundary_points.reduce((sum, p) => sum + p.lng, 0) / plot.boundary_points.length;
            return { lat: avgLat, lng: avgLng };
        }
        if (latitude && longitude) {
            return { lat: latitude, lng: longitude };
        }
        return { lat: -6.2088, lng: 106.8456 };
    };

    const formatArea = (area: number | string | null) => {
        if (!area) return 'N/A';
        const numArea = typeof area === 'string' ? parseFloat(area) : area;
        if (isNaN(numArea)) return 'N/A';
        if (numArea >= 10000) {
            return `${(numArea / 10000).toFixed(2)} ha`;
        }
        return `${numArea.toFixed(2)} m²`;
    };

    const handleDelete = (plot: LandPlot) => {
        if (confirm(`Are you sure you want to delete "${plot.name}"?`)) {
            router.delete(`/land-plots/${plot.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Land Plots - Google Maps" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:flex-row">
                {/* Sidebar */}
                <div className="w-full space-y-4 lg:w-80 lg:shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Your Plots</h2>
                        <Link href="/land-plots-gmap/create">
                            <Button size="sm">
                                <Plus className="mr-1 h-4 w-4" />
                                New Plot
                            </Button>
                        </Link>
                    </div>

                    {plots.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                                <Map className="mb-2 h-12 w-12 text-muted-foreground" />
                                <p className="text-center text-muted-foreground">
                                    No land plots yet.
                                    <br />
                                    Create your first plot!
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="max-h-[calc(100vh-220px)] space-y-2 overflow-y-auto">
                            {plots.map((plot) => (
                                <Card
                                    key={plot.id}
                                    className={`cursor-pointer transition-colors hover:bg-accent ${selectedPlotId === plot.id ? 'ring-2 ring-primary' : ''
                                        }`}
                                    onClick={() => setSelectedPlotId(plot.id)}
                                >
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-base">{plot.name}</CardTitle>
                                        <CardDescription>Area: {formatArea(plot.area)}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex gap-2 px-4 pb-4">
                                        <Link href={`/land-plots-gmap/${plot.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/land-plots-gmap/${plot.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(plot);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Map */}
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {geoLoading && plots.length === 0 ? (
                        <div className="flex h-full min-h-[400px] items-center justify-center bg-muted/50">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Getting your location...</p>
                            </div>
                        </div>
                    ) : (
                        <GMapContainer center={getMapCenter()} zoom={18}>
                            {latitude && longitude && (
                                <GCurrentLocationMarker position={{ lat: latitude, lng: longitude }} accuracy={accuracy} />
                            )}
                            {plots.map((plot) => (
                                <GPlotPolygon
                                    key={plot.id}
                                    points={plot.boundary_points}
                                    isSelected={plot.id === selectedPlotId}
                                    onClick={() => setSelectedPlotId(plot.id)}
                                />
                            ))}
                        </GMapContainer>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

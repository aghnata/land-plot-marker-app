import { GMapContainer, GPlotMarker, GPlotPolygon } from '@/components/gmap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type LandPlot } from '@/types/land-plot';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface Props {
    plot: LandPlot;
}

export default function Show({ plot }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Land Plots Gmap', href: '/land-plots-gmap' },
        { title: plot.name, href: `/land-plots-gmap/${plot.id}` },
    ];

    const getMapCenter = (): { lat: number; lng: number } => {
        if (plot.boundary_points.length > 0) {
            const avgLat = plot.boundary_points.reduce((sum, p) => sum + p.lat, 0) / plot.boundary_points.length;
            const avgLng = plot.boundary_points.reduce((sum, p) => sum + p.lng, 0) / plot.boundary_points.length;
            return { lat: avgLat, lng: avgLng };
        }
        return { lat: -6.2088, lng: 106.8456 };
    };

    const formatArea = (area: number | string | null) => {
        if (!area) return 'N/A';
        const numArea = typeof area === 'string' ? parseFloat(area) : area;
        if (isNaN(numArea)) return 'N/A';
        if (numArea >= 10000) return `${(numArea / 10000).toFixed(2)} hectares`;
        return `${numArea.toFixed(2)} m²`;
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${plot.name}"?`)) {
            router.delete(`/land-plots/${plot.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={plot.name} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:flex-row">
                <div className="w-full space-y-4 lg:w-96 lg:shrink-0">
                    <Link href="/land-plots-gmap">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to Plots
                        </Button>
                    </Link>

                    <Card>
                        <CardHeader>
                            <CardTitle>{plot.name}</CardTitle>
                            {plot.description && <CardDescription>{plot.description}</CardDescription>}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Area</p>
                                    <p className="text-lg font-semibold">{formatArea(plot.area)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Points</p>
                                    <p className="text-lg font-semibold">{plot.boundary_points.length}</p>
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Coordinates</p>
                                <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
                                    {plot.boundary_points.map((point, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                                                {idx + 1}
                                            </span>
                                            <span className="font-mono">
                                                {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link href={`/land-plots-gmap/${plot.id}/edit`} className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        <Edit className="mr-1 h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button variant="destructive" onClick={handleDelete} className="flex-1">
                                    <Trash2 className="mr-1 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <GMapContainer center={getMapCenter()} zoom={19}>
                        <GPlotPolygon points={plot.boundary_points} isSelected />
                        {plot.boundary_points.map((point, idx) => (
                            <GPlotMarker key={idx} position={point} index={idx} />
                        ))}
                    </GMapContainer>
                </div>
            </div>
        </AppLayout>
    );
}

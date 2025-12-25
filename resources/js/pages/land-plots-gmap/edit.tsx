import { GMapContainer, GPlotMarker, GPlotPolygon } from '@/components/gmap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Coordinate, type LandPlot } from '@/types/land-plot';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';

interface Props {
    plot: LandPlot;
}

export default function Edit({ plot }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Land Plots Gmap', href: '/land-plots-gmap' },
        { title: plot.name, href: `/land-plots-gmap/${plot.id}` },
        { title: 'Edit', href: `/land-plots-gmap/${plot.id}/edit` },
    ];

    const [name, setName] = useState(plot.name);
    const [description, setDescription] = useState(plot.description || '');
    const [boundaryPoints, setBoundaryPoints] = useState<Coordinate[]>(plot.boundary_points);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const getMapCenter = (): { lat: number; lng: number } => {
        if (boundaryPoints.length > 0) {
            const avgLat = boundaryPoints.reduce((sum, p) => sum + p.lat, 0) / boundaryPoints.length;
            const avgLng = boundaryPoints.reduce((sum, p) => sum + p.lng, 0) / boundaryPoints.length;
            return { lat: avgLat, lng: avgLng };
        }
        return { lat: -6.2088, lng: 106.8456 };
    };

    const handleMarkerDrag = (index: number, newPosition: Coordinate) => {
        const updated = [...boundaryPoints];
        updated[index] = newPosition;
        setBoundaryPoints(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        router.put(
            `/land-plots/${plot.id}`,
            { name, description, boundary_points: boundaryPoints },
            {
                onError: (errors) => {
                    setErrors(errors as Record<string, string>);
                    setIsSubmitting(false);
                },
                onSuccess: () => setIsSubmitting(false),
            },
        );
    };

    const canSubmit = name.trim() !== '' && boundaryPoints.length === 4;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${plot.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:flex-row">
                <div className="w-full space-y-4 lg:w-96 lg:shrink-0">
                    <Link href={`/land-plots-gmap/${plot.id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to Plot
                        </Button>
                    </Link>

                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Plot</CardTitle>
                            <CardDescription>Drag markers to adjust boundaries.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Plot Name *</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Boundary Points</Label>
                                    <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
                                        {boundaryPoints.map((point, idx) => (
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
                                    {errors.boundary_points && (
                                        <p className="text-sm text-destructive">{errors.boundary_points}</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full">
                                    <Save className="mr-1 h-4 w-4" />
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <GMapContainer center={getMapCenter()} zoom={19}>
                        <GPlotPolygon points={boundaryPoints} isSelected />
                        {boundaryPoints.map((point, idx) => (
                            <GPlotMarker
                                key={idx}
                                position={point}
                                index={idx}
                                draggable
                                onDragEnd={handleMarkerDrag}
                            />
                        ))}
                    </GMapContainer>

                    <div className="pointer-events-none absolute left-4 top-4 rounded-lg bg-background/90 px-3 py-2 shadow-lg">
                        <p className="text-sm font-medium">Drag markers to adjust boundaries</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

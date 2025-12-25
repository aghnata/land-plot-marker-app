export interface Coordinate {
    lat: number;
    lng: number;
    [key: string]: number; // Index signature for Inertia form compatibility
}

export interface LandPlot {
    id: number;
    name: string;
    description: string | null;
    boundary_points: Coordinate[];
    area: number | null;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface LandPlotFormData {
    name: string;
    description: string;
    boundary_points: Coordinate[];
}

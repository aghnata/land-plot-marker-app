<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LandPlot extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'boundary_points',
        'area',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'boundary_points' => 'array',
        'area' => 'decimal:2',
    ];

    /**
     * Get the user that owns the land plot.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calculate the approximate area of the polygon in square meters.
     * Uses the Shoelace formula for polygon area with coordinate conversion.
     */
    public function calculateArea(): float
    {
        $points = $this->boundary_points;
        
        if (count($points) < 3) {
            return 0;
        }

        // Convert lat/lng to approximate meters (at the centroid latitude)
        $centroidLat = array_sum(array_column($points, 'lat')) / count($points);
        $latToMeters = 111320; // Approximately 111.32 km per degree latitude
        $lngToMeters = 111320 * cos(deg2rad($centroidLat));

        // Convert points to meters
        $metersPoints = array_map(function ($point) use ($latToMeters, $lngToMeters) {
            return [
                'x' => $point['lng'] * $lngToMeters,
                'y' => $point['lat'] * $latToMeters,
            ];
        }, $points);

        // Shoelace formula
        $n = count($metersPoints);
        $area = 0;

        for ($i = 0; $i < $n; $i++) {
            $j = ($i + 1) % $n;
            $area += $metersPoints[$i]['x'] * $metersPoints[$j]['y'];
            $area -= $metersPoints[$j]['x'] * $metersPoints[$i]['y'];
        }

        return abs($area) / 2;
    }
}

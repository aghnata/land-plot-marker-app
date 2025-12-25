<?php

namespace Database\Factories;

use App\Models\LandPlot;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LandPlot>
 */
class LandPlotFactory extends Factory
{
    protected $model = LandPlot::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate 4 random boundary points within a small area
        $baseLat = fake()->latitude(-8, -6);
        $baseLng = fake()->longitude(106, 108);
        
        $boundaryPoints = [
            ['lat' => $baseLat, 'lng' => $baseLng],
            ['lat' => $baseLat, 'lng' => $baseLng + 0.001],
            ['lat' => $baseLat + 0.001, 'lng' => $baseLng + 0.001],
            ['lat' => $baseLat + 0.001, 'lng' => $baseLng],
        ];

        return [
            'name' => fake()->words(3, true),
            'description' => fake()->optional()->sentence(),
            'boundary_points' => $boundaryPoints,
            'area' => fake()->randomFloat(2, 100, 10000),
            'user_id' => User::factory(),
        ];
    }
}

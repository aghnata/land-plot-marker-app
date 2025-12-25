<?php

namespace Tests\Feature;

use App\Models\LandPlot;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandPlotTest extends TestCase
{
    use RefreshDatabase;

    private function validBoundaryPoints(): array
    {
        return [
            ['lat' => -6.2000, 'lng' => 106.8000],
            ['lat' => -6.2000, 'lng' => 106.8100],
            ['lat' => -6.2100, 'lng' => 106.8100],
            ['lat' => -6.2100, 'lng' => 106.8000],
        ];
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('land-plots.index'))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_their_plots(): void
    {
        $user = User::factory()->create();
        $plot = LandPlot::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->get(route('land-plots.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('land-plots/index')
                ->has('plots', 1)
            );
    }

    public function test_user_can_create_plot_with_valid_boundary_points(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('land-plots.store'), [
                'name' => 'Test Plot',
                'description' => 'A test plot',
                'boundary_points' => $this->validBoundaryPoints(),
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('land_plots', [
            'name' => 'Test Plot',
            'user_id' => $user->id,
        ]);
    }

    public function test_validation_fails_for_less_than_4_points(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('land-plots.store'), [
                'name' => 'Test Plot',
                'boundary_points' => [
                    ['lat' => -6.2000, 'lng' => 106.8000],
                    ['lat' => -6.2000, 'lng' => 106.8100],
                ],
            ]);

        $response->assertSessionHasErrors('boundary_points');
    }

    public function test_validation_fails_for_invalid_coordinates(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('land-plots.store'), [
                'name' => 'Test Plot',
                'boundary_points' => [
                    ['lat' => -100, 'lng' => 106.8000], // Invalid latitude
                    ['lat' => -6.2000, 'lng' => 106.8100],
                    ['lat' => -6.2100, 'lng' => 106.8100],
                    ['lat' => -6.2100, 'lng' => 106.8000],
                ],
            ]);

        $response->assertSessionHasErrors('boundary_points.0.lat');
    }

    public function test_user_can_view_their_own_plot(): void
    {
        $user = User::factory()->create();
        $plot = LandPlot::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->get(route('land-plots.show', $plot))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('land-plots/show')
                ->has('plot')
            );
    }

    public function test_user_cannot_view_another_users_plot(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $plot = LandPlot::factory()->create(['user_id' => $user1->id]);

        $this->actingAs($user2)
            ->get(route('land-plots.show', $plot))
            ->assertForbidden();
    }

    public function test_user_can_update_their_own_plot(): void
    {
        $user = User::factory()->create();
        $plot = LandPlot::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->put(route('land-plots.update', $plot), [
                'name' => 'Updated Plot Name',
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('land_plots', [
            'id' => $plot->id,
            'name' => 'Updated Plot Name',
        ]);
    }

    public function test_user_cannot_update_another_users_plot(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $plot = LandPlot::factory()->create(['user_id' => $user1->id]);

        $this->actingAs($user2)
            ->put(route('land-plots.update', $plot), [
                'name' => 'Hacked Plot Name',
            ])
            ->assertForbidden();
    }

    public function test_user_can_delete_their_own_plot(): void
    {
        $user = User::factory()->create();
        $plot = LandPlot::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->delete(route('land-plots.destroy', $plot));

        $response->assertRedirect(route('land-plots.index'));
        
        $this->assertDatabaseMissing('land_plots', [
            'id' => $plot->id,
        ]);
    }

    public function test_user_cannot_delete_another_users_plot(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $plot = LandPlot::factory()->create(['user_id' => $user1->id]);

        $this->actingAs($user2)
            ->delete(route('land-plots.destroy', $plot))
            ->assertForbidden();
    }

    public function test_plot_area_is_calculated_on_creation(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('land-plots.store'), [
                'name' => 'Test Plot',
                'boundary_points' => $this->validBoundaryPoints(),
            ]);

        $plot = LandPlot::where('user_id', $user->id)->first();
        
        $this->assertNotNull($plot->area);
        $this->assertGreaterThan(0, $plot->area);
    }
}

<?php

use App\Http\Controllers\LandPlotController;
use App\Http\Controllers\LandPlotGmapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // OpenStreetMap land plots
    Route::resource('land-plots', LandPlotController::class);

    // Google Maps land plots (same data, different map provider)
    Route::get('land-plots-gmap', [LandPlotGmapController::class, 'index'])->name('land-plots-gmap.index');
    Route::get('land-plots-gmap/create', [LandPlotGmapController::class, 'create'])->name('land-plots-gmap.create');
    Route::get('land-plots-gmap/{land_plot}', [LandPlotGmapController::class, 'show'])->name('land-plots-gmap.show');
    Route::get('land-plots-gmap/{land_plot}/edit', [LandPlotGmapController::class, 'edit'])->name('land-plots-gmap.edit');
});

require __DIR__.'/settings.php';

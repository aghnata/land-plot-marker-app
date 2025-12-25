<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLandPlotRequest;
use App\Http\Requests\UpdateLandPlotRequest;
use App\Models\LandPlot;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandPlotGmapController extends Controller
{
    /**
     * Display a listing of the user's land plots.
     */
    public function index(Request $request): Response
    {
        $plots = $request->user()->landPlots()->latest()->get();

        return Inertia::render('land-plots-gmap/index', [
            'plots' => $plots,
        ]);
    }

    /**
     * Show the form for creating a new land plot.
     */
    public function create(): Response
    {
        return Inertia::render('land-plots-gmap/create');
    }

    /**
     * Display the specified land plot.
     */
    public function show(Request $request, LandPlot $landPlot): Response
    {
        if ($landPlot->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('land-plots-gmap/show', [
            'plot' => $landPlot,
        ]);
    }

    /**
     * Show the form for editing the specified land plot.
     */
    public function edit(Request $request, LandPlot $landPlot): Response
    {
        if ($landPlot->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('land-plots-gmap/edit', [
            'plot' => $landPlot,
        ]);
    }
}

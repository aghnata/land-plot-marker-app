<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLandPlotRequest;
use App\Http\Requests\UpdateLandPlotRequest;
use App\Models\LandPlot;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandPlotController extends Controller
{
    /**
     * Display a listing of the user's land plots.
     */
    public function index(Request $request): Response
    {
        $plots = $request->user()->landPlots()->latest()->get();

        return Inertia::render('land-plots/index', [
            'plots' => $plots,
        ]);
    }

    /**
     * Show the form for creating a new land plot.
     */
    public function create(): Response
    {
        return Inertia::render('land-plots/create');
    }

    /**
     * Store a newly created land plot in storage.
     */
    public function store(StoreLandPlotRequest $request): RedirectResponse
    {
        $plot = new LandPlot($request->validated());
        $plot->user_id = $request->user()->id;
        $plot->area = $plot->calculateArea();
        $plot->save();

        return redirect()->route('land-plots.show', $plot)
            ->with('success', 'Land plot created successfully.');
    }

    /**
     * Display the specified land plot.
     */
    public function show(Request $request, LandPlot $landPlot): Response
    {
        // Ensure user can only view their own plots
        if ($landPlot->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('land-plots/show', [
            'plot' => $landPlot,
        ]);
    }

    /**
     * Show the form for editing the specified land plot.
     */
    public function edit(Request $request, LandPlot $landPlot): Response
    {
        // Ensure user can only edit their own plots
        if ($landPlot->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('land-plots/edit', [
            'plot' => $landPlot,
        ]);
    }

    /**
     * Update the specified land plot in storage.
     */
    public function update(UpdateLandPlotRequest $request, LandPlot $landPlot): RedirectResponse
    {
        $landPlot->fill($request->validated());
        
        // Recalculate area if boundary points changed
        if ($request->has('boundary_points')) {
            $landPlot->area = $landPlot->calculateArea();
        }
        
        $landPlot->save();

        return redirect()->route('land-plots.show', $landPlot)
            ->with('success', 'Land plot updated successfully.');
    }

    /**
     * Remove the specified land plot from storage.
     */
    public function destroy(Request $request, LandPlot $landPlot): RedirectResponse
    {
        // Ensure user can only delete their own plots
        if ($landPlot->user_id !== $request->user()->id) {
            abort(403);
        }

        $landPlot->delete();

        return redirect()->route('land-plots.index')
            ->with('success', 'Land plot deleted successfully.');
    }
}

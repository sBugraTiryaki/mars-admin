<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUnitRequest;
use App\Http\Requests\UpdateUnitRequest;
use App\Models\Project;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function index(): Response
    {
        $units = Unit::query()
            ->with('project:id,name')
            ->latest()
            ->paginate(10);

        return Inertia::render('units/index', [
            'units' => $units,
        ]);
    }

    public function create(): Response
    {
        $projects = Project::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('units/create', [
            'projects' => $projects,
        ]);
    }

    public function store(StoreUnitRequest $request): RedirectResponse
    {
        Unit::create($request->validated());

        return redirect()->route('units.index')
            ->with('success', 'Unit created successfully.');
    }

    public function show(Unit $unit): Response
    {
        $unit->load('project');

        return Inertia::render('units/show', [
            'unit' => $unit,
        ]);
    }

    public function edit(Unit $unit): Response
    {
        $projects = Project::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('units/edit', [
            'unit' => $unit,
            'projects' => $projects,
        ]);
    }

    public function update(UpdateUnitRequest $request, Unit $unit): RedirectResponse
    {
        $unit->update($request->validated());

        return redirect()->route('units.index')
            ->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        $unit->delete();

        return redirect()->route('units.index')
            ->with('success', 'Unit deleted successfully.');
    }

    public function storeForProject(StoreUnitRequest $request, Project $project): RedirectResponse
    {
        $validated = $request->validated();
        $validated['project_id'] = $project->id;

        // Set default currency from project if not provided
        $validated['currency'] = $validated['currency'] ?? $project->currency;

        Unit::create($validated);

        return back()->with('success', 'Unit created successfully.');
    }

    public function updateForProject(UpdateUnitRequest $request, Project $project, Unit $unit): RedirectResponse
    {
        // Ensure the unit belongs to this project
        if ($unit->project_id !== $project->id) {
            abort(403);
        }

        $unit->update($request->validated());

        return back()->with('success', 'Unit updated successfully.');
    }

    public function destroyForProject(Project $project, Unit $unit): RedirectResponse
    {
        // Ensure the unit belongs to this project
        if ($unit->project_id !== $project->id) {
            abort(403);
        }

        $unit->delete();

        return back()->with('success', 'Unit deleted successfully.');
    }

    public function uploadImages(\Illuminate\Http\Request $request, Unit $unit): RedirectResponse
    {
        $request->validate([
            'images' => ['required', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],
        ]);

        foreach ($request->file('images') as $image) {
            $unit->addMedia($image)
                ->toMediaCollection('images');
        }

        return back()->with('success', 'Images uploaded successfully.');
    }

    public function deleteImage(\Illuminate\Http\Request $request, Unit $unit): RedirectResponse
    {
        $request->validate([
            'image_url' => ['required', 'string'],
        ]);

        $imageUrl = $request->input('image_url');

        // Find and delete the media item
        $media = $unit->getMedia('images')->first(function ($item) use ($imageUrl) {
            return $item->getUrl() === $imageUrl;
        });

        if ($media) {
            $media->delete();
        }

        return back()->with('success', 'Image deleted successfully.');
    }
}

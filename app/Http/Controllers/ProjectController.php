<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $projects = Project::query()
            ->withCount('units')
            ->latest()
            ->paginate(10);

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('projects/create');
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        \Log::info('=== Project Store Request Started ===');
        \Log::info('Request Data:', $request->all());
        \Log::info('Files:', $request->allFiles());

        try {
            $validated = $request->validated();
            \Log::info('Validation passed', ['validated' => $validated]);

            // Extract units (already decoded by prepareForValidation)
            $units = $validated['units'] ?? [];

            // Remove fields that shouldn't be saved directly to project
            $projectData = collect($validated)->except([
                'units',
                'hero_images',
                'gallery_images',
            ])->toArray();

            // Set default values if not provided
            $projectData['country'] = $projectData['country'] ?? 'UAE';
            $projectData['currency'] = $projectData['currency'] ?? 'AED';
            $projectData['status'] = $projectData['status'] ?? 'planning';
            $projectData['is_featured'] = $projectData['is_featured'] ?? false;
            $projectData['is_active'] = $projectData['is_active'] ?? true;

            $project = Project::create($projectData);

            // Handle hero images
            if ($request->hasFile('hero_images')) {
                foreach ($request->file('hero_images') as $image) {
                    $project->addMedia($image)
                        ->toMediaCollection('hero');
                }
            }

            // Handle gallery images
            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $image) {
                    $project->addMedia($image)
                        ->toMediaCollection('gallery');
                }
            }

            // Create units
            if (! empty($units)) {
                foreach ($units as $unitData) {
                    // Set default values for units
                    $unitData['currency'] = $unitData['currency'] ?? $project->currency;
                    $unitData['status'] = $unitData['status'] ?? 'available';
                    $unitData['is_active'] = $unitData['is_active'] ?? true;

                    $project->units()->create($unitData);
                }
            }

            \Log::info('Project created successfully', [
                'project_id' => $project->id,
                'units_count' => count($units),
            ]);

            return redirect()->route('projects.index')
                ->with('success', 'Project created successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', [
                'errors' => $e->errors(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Project creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    public function show(Project $project): Response
    {
        $project->load(['units' => fn ($query) => $query->latest()->limit(10)]);
        $project->loadCount('units');

        return Inertia::render('projects/show', [
            'project' => $project,
        ]);
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('projects/edit', [
            'project' => $project,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $project->update($request->validated());

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}

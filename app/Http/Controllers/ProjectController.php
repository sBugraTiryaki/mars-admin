<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Project::query()->withCount('units');

        // Search
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('developer', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $projects = $query->latest()->paginate(12)->withQueryString();

        // Append hero_images for grid view
        $projects->through(function ($project) {
            $project->append(['hero_images']);

            return $project;
        });

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

            // Extract units and amenities (already decoded by prepareForValidation)
            $units = $validated['units'] ?? [];
            $projectAmenities = $validated['project_amenities'] ?? [];

            // Remove fields that shouldn't be saved directly to project
            $projectData = collect($validated)->except([
                'units',
                'project_amenities',
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

            // Create project amenities
            if (! empty($projectAmenities)) {
                foreach ($projectAmenities as $amenityData) {
                    $project->projectAmenities()->create($amenityData);
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

        // Load media
        $project->append(['hero_images', 'gallery_images']);

        // Load unit images
        $project->units->each(function ($unit) {
            $unit->append(['unit_images']);
        });

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
        \Log::info('=== Project Update Request Started ===');
        \Log::info('Request Data:', $request->all());
        \Log::info('Project ID:', ['id' => $project->id]);

        try {
            $validated = $request->validated();
            \Log::info('Validation passed', ['validated' => $validated]);

            $project->update($validated);
            $project->refresh();

            \Log::info('Project updated successfully', [
                'project_id' => $project->id,
            ]);

            // Redirect back to show page with updated data
            return redirect()->route('projects.show', $project)
                ->with('success', 'Project updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Update validation failed', [
                'errors' => $e->errors(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Project update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    public function uploadImages(Request $request, Project $project): RedirectResponse
    {
        $request->validate([
            'images' => ['required', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],
            'collection' => ['required', 'in:hero,gallery'],
        ]);

        $collection = $request->input('collection');

        foreach ($request->file('images') as $image) {
            $project->addMedia($image)
                ->toMediaCollection($collection);
        }

        return back()->with('success', 'Images uploaded successfully.');
    }

    public function deleteImage(Request $request, Project $project): RedirectResponse
    {
        $request->validate([
            'image_url' => ['required', 'string'],
            'collection' => ['required', 'in:hero,gallery'],
        ]);

        $imageUrl = $request->input('image_url');
        $collection = $request->input('collection');

        // Find and delete the media item
        $media = $project->getMedia($collection)->first(function ($item) use ($imageUrl) {
            return $item->getUrl() === $imageUrl;
        });

        if ($media) {
            $media->delete();
        }

        return back()->with('success', 'Image deleted successfully.');
    }
}

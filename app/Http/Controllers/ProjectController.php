<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveDraftRequest;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $drafts = Project::myDrafts($request->user()->id)
            ->withCount('units')
            ->latest()
            ->take(10)
            ->get()
            ->each(function (Project $draft) {
                $draft->append(['draft_hero_images', 'draft_gallery_images']);
            });

        $query = Project::published()->withCount('units');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('developer', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $projects = $query->latest()->paginate(12)->withQueryString();

        $projects->through(function (Project $project) {
            $project->append(['hero_images']);

            return $project;
        });

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'drafts' => $drafts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('projects/create', [
            'draft' => null,
        ]);
    }

    public function loadDraft(Project $project): Response
    {
        $this->ensureDraftOwnership($project);

        $project->load(['units', 'projectAmenities', 'translations', 'media']);
        $project->append(['draft_hero_images', 'draft_gallery_images']);

        return Inertia::render('projects/create', [
            'draft' => [
                ...$project->toArray(),
                'project_amenities' => $project->projectAmenities,
                'translations' => $project->translations,
                'draft_hero_images' => $project->draft_hero_images,
                'draft_gallery_images' => $project->draft_gallery_images,
            ],
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $request) {
            $project = $this->persistProjectData(new Project(), $validated, false);
            $this->syncMedia($project, $request, false);
        });

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function saveDraft(SaveDraftRequest $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validated();

        $project = DB::transaction(function () use ($validated, $request) {
            $project = $this->persistProjectData(new Project(), $validated, true);
            $this->syncMedia($project, $request, true);

            return $project->fresh();
        });

        $payload = $this->serializeDraft($project);

        if ($request->expectsJson() || $request->boolean('stay_on_page')) {
            return response()->json([
                'draft' => $payload,
                'message' => 'Taslak başarıyla kaydedildi.',
            ]);
        }

        return redirect()->route('projects.index')
            ->with('success', 'Taslak başarıyla kaydedildi.');
    }

    public function updateDraft(SaveDraftRequest $request, Project $project): JsonResponse|RedirectResponse
    {
        $this->ensureDraftOwnership($project);

        $validated = $request->validated();

        $project = DB::transaction(function () use ($project, $validated, $request) {
            $this->persistProjectData($project, $validated, true);
            $this->syncMedia($project, $request, true);

            return $project->fresh();
        });

        $payload = $this->serializeDraft($project);

        if ($request->expectsJson() || $request->boolean('stay_on_page', true)) {
            return response()->json([
                'draft' => $payload,
                'message' => 'Taslak kaydedildi.',
            ]);
        }

        return redirect()->route('projects.index')
            ->with('success', 'Taslak kaydedildi.');
    }

    public function publishDraft(StoreProjectRequest $request, Project $project): RedirectResponse
    {
        $this->ensureDraftOwnership($project);

        $validated = $request->validated();

        DB::transaction(function () use ($project, $validated, $request) {
            // Update project with strict validation first; keep as draft until publish finishes
            $this->persistProjectData($project, $validated, true);
            $this->syncMedia($project, $request, true);

            $this->moveDraftMediaToProduction($project);

            $project->forceFill([
                'slug' => Str::slug($validated['name'] ?? $project->name ?? 'project').'-'.uniqid(),
                'is_draft' => false,
                'current_step' => null,
            ])->save();
        });

        return redirect()->route('projects.show', $project)
            ->with('success', 'Taslak yayınlandı.');
    }

    public function show(Project $project): Response
    {
        if ($project->is_draft) {
            abort(404);
        }

        $project->load(['units' => fn ($query) => $query->latest()->limit(10)]);
        $project->loadCount('units');

        $project->append(['hero_images', 'gallery_images']);

        $project->units->each(function ($unit) {
            $unit->append(['unit_images']);
        });

        return Inertia::render('projects/show', [
            'project' => $project,
        ]);
    }

    public function edit(Project $project): Response
    {
        if ($project->is_draft) {
            abort(404);
        }

        return Inertia::render('projects/edit', [
            'project' => $project,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        if ($project->is_draft) {
            abort(404);
        }

        $validated = $request->validated();

        $project->update($validated);
        $project->refresh();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        if ($project->is_draft && $project->created_by !== auth()->id()) {
            abort(403);
        }

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
            'collection' => ['required', 'in:hero,gallery,draft_hero,draft_gallery'],
        ]);

        $imageUrl = $request->input('image_url');
        $collection = $request->input('collection');

        $media = $project->getMedia($collection)->first(function ($item) use ($imageUrl) {
            return $item->getUrl() === $imageUrl;
        });

        if ($media) {
            $media->delete();
        }

        return back()->with('success', 'Image deleted successfully.');
    }

    private function persistProjectData(Project $project, array $validated, bool $isDraft): Project
    {
        $units = $validated['units'] ?? [];
        $projectAmenities = $validated['project_amenities'] ?? [];

        $projectData = collect($validated)->except([
            'units',
            'project_amenities',
            'hero_images',
            'gallery_images',
            'existing_draft_hero_images',
            'existing_draft_gallery_images',
            'existing_hero_images',
            'existing_gallery_images',
            'overview_tr',
            'overview_en',
            'overview_ar',
            'hero_title_tr',
            'hero_title_en',
            'hero_title_ar',
            'hero_subtitle_tr',
            'hero_subtitle_en',
            'hero_subtitle_ar',
        ])->toArray();

        $projectData['country'] = $projectData['country'] ?? 'UAE';
        $projectData['currency'] = $projectData['currency'] ?? 'AED';
        $projectData['status'] = $projectData['status'] ?? 'planning';
        $projectData['is_featured'] = $projectData['is_featured'] ?? false;
        $projectData['is_active'] = $projectData['is_active'] ?? true;
        $projectData['current_step'] = $isDraft ? ($validated['current_step'] ?? $project->current_step) : null;
        $projectData['is_draft'] = $isDraft;
        $projectData['total_units'] = $projectData['total_units'] ?? count($units);
        $projectData['slug'] = $projectData['slug'] ?? Str::slug($projectData['name'] ?? 'taslak').'-draft-'.uniqid();

        if (! $project->exists) {
            $projectData['created_by'] = $projectData['created_by'] ?? auth()->id();
        }

        $project->fill($projectData);
        $project->save();

        $this->syncProjectAmenities($project, $projectAmenities);
        $this->syncUnits($project, $units, $projectData['currency']);
        $this->syncTranslations($project, $validated);

        return $project;
    }

    private function syncProjectAmenities(Project $project, array $projectAmenities): void
    {
        $project->projectAmenities()->delete();

        if (! empty($projectAmenities)) {
            foreach ($projectAmenities as $amenityData) {
                $project->projectAmenities()->create($amenityData);
            }
        }
    }

    private function syncUnits(Project $project, array $units, string $defaultCurrency): void
    {
        $project->units()->delete();

        foreach ($units as $unitData) {
            $unitData['currency'] = $unitData['currency'] ?? $defaultCurrency;
            $unitData['status'] = $unitData['status'] ?? 'available';
            $unitData['is_active'] = $unitData['is_active'] ?? true;

            $project->units()->create($unitData);
        }
    }

    private function syncTranslations(Project $project, array $validated): void
    {
        $translations = [
            'tr' => [
                'overview' => $validated['overview_tr'] ?? null,
                'hero_title' => $validated['hero_title_tr'] ?? null,
                'hero_subtitle' => $validated['hero_subtitle_tr'] ?? null,
            ],
            'en' => [
                'overview' => $validated['overview_en'] ?? null,
                'hero_title' => $validated['hero_title_en'] ?? null,
                'hero_subtitle' => $validated['hero_subtitle_en'] ?? null,
            ],
            'ar' => [
                'overview' => $validated['overview_ar'] ?? null,
                'hero_title' => $validated['hero_title_ar'] ?? null,
                'hero_subtitle' => $validated['hero_subtitle_ar'] ?? null,
            ],
        ];

        foreach ($translations as $locale => $translationData) {
            if (! empty(array_filter($translationData))) {
                $project->translations()->updateOrCreate(
                    ['locale' => $locale],
                    $translationData
                );
            }
        }
    }

    private function syncMedia(Project $project, Request $request, bool $isDraft): void
    {
        $heroCollection = $isDraft ? 'draft_hero' : 'hero';
        $galleryCollection = $isDraft ? 'draft_gallery' : 'gallery';

        $existingHero = $request->input($isDraft ? 'existing_draft_hero_images' : 'existing_hero_images');
        $existingGallery = $request->input($isDraft ? 'existing_draft_gallery_images' : 'existing_gallery_images');

        if (is_array($existingHero)) {
            $project->getMedia($heroCollection)->each(function ($media) use ($existingHero) {
                if (! in_array($media->getUrl(), $existingHero, true)) {
                    $media->delete();
                }
            });
        }

        if (is_array($existingGallery)) {
            $project->getMedia($galleryCollection)->each(function ($media) use ($existingGallery) {
                if (! in_array($media->getUrl(), $existingGallery, true)) {
                    $media->delete();
                }
            });
        }

        if ($request->hasFile('hero_images')) {
            foreach ($request->file('hero_images') as $image) {
                $project->addMedia($image)
                    ->toMediaCollection($heroCollection);
            }
        }

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $project->addMedia($image)
                    ->toMediaCollection($galleryCollection);
            }
        }
    }

    private function moveDraftMediaToProduction(Project $project): void
    {
        // Clear existing production media to avoid duplicates
        $project->getMedia('hero')->each->delete();
        $project->getMedia('gallery')->each->delete();

        $project->getMedia('draft_hero')->each(function ($media) {
            $media->move($media->model, 'hero');
        });

        $project->getMedia('draft_gallery')->each(function ($media) {
            $media->move($media->model, 'gallery');
        });
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeDraft(Project $project): array
    {
        $project->loadMissing(['projectAmenities', 'units', 'translations', 'media']);
        $project->append(['draft_hero_images', 'draft_gallery_images']);

        return $project->toArray();
    }

    private function ensureDraftOwnership(Project $project): void
    {
        if (! $project->is_draft || $project->created_by !== auth()->id()) {
            abort(404);
        }
    }
}

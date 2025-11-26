<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class PublicProjectController extends Controller
{
    public function show(string $locale, Project $project): Response
    {
        // Validate locale
        if (! in_array($locale, ['tr', 'en', 'ar'])) {
            abort(404);
        }

        // Only show active, published projects
        if (! $project->is_active || $project->is_draft) {
            abort(404);
        }

        // Load active units with their media and translations
        $project->load([
            'units' => fn ($query) => $query->where('is_active', true)->orderBy('price'),
            'media',
            'translations',
        ]);

        // Add hero and gallery images from media library
        $projectData = $project->toArray();
        $projectData['hero_images'] = $project->hero_images;
        $projectData['gallery_images'] = $project->gallery_images;

        // Get translation for the requested locale
        $translation = $project->translation($locale);

        // Override translatable fields with translation if available
        if ($translation) {
            $projectData['overview'] = $translation->overview ?? $projectData['overview'];
            $projectData['hero_title'] = $translation->hero_title ?? $projectData['hero_title'];
            $projectData['hero_subtitle'] = $translation->hero_subtitle ?? $projectData['hero_subtitle'];
        }

        // Add current locale to project data
        $projectData['current_locale'] = $locale;

        // Add unit images from media library
        if (isset($projectData['units'])) {
            foreach ($projectData['units'] as $index => $unit) {
                $unitModel = $project->units[$index];
                $projectData['units'][$index]['images'] = $unitModel->unit_images;
                $projectData['units'][$index]['floor_plan'] = $unitModel->floor_plan_url;
            }
        }

        return Inertia::render('public/project/show', [
            'project' => $projectData,
        ]);
    }
}

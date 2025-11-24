<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class PublicProjectController extends Controller
{
    public function show(Project $project): Response
    {
        // Only show active projects
        if (! $project->is_active) {
            abort(404);
        }

        // Load active units with their media
        $project->load([
            'units' => fn ($query) => $query->where('is_active', true)->orderBy('price'),
            'media',
        ]);

        // Add hero and gallery images from media library
        $projectData = $project->toArray();
        $projectData['hero_images'] = $project->hero_images;
        $projectData['gallery_images'] = $project->gallery_images;

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

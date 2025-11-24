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

        // Load active units
        $project->load(['units' => fn ($query) => $query->where('is_active', true)->orderBy('price')]);

        return Inertia::render('public/project/show', [
            'project' => $project,
        ]);
    }
}

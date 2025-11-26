<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PublicProjectController;
use App\Http\Controllers\UserController;
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

    Route::post('projects/drafts', [ProjectController::class, 'saveDraft'])->name('projects.drafts.store');
    Route::put('projects/drafts/{project}', [ProjectController::class, 'updateDraft'])->name('projects.drafts.update');
    Route::post('projects/drafts/{project}/publish', [ProjectController::class, 'publishDraft'])->name('projects.drafts.publish');
    Route::get('projects/drafts/{project}/load', [ProjectController::class, 'loadDraft'])->name('projects.drafts.load');

    Route::resource('projects', ProjectController::class);
    Route::post('projects/{project}/images', [ProjectController::class, 'uploadImages'])->name('projects.images.upload');
    Route::delete('projects/{project}/images', [ProjectController::class, 'deleteImage'])->name('projects.images.delete');

    Route::resource('users', UserController::class);

    // Unit management within projects
    Route::post('projects/{project}/units', [\App\Http\Controllers\UnitController::class, 'storeForProject'])->name('projects.units.store');
    Route::put('projects/{project}/units/{unit}', [\App\Http\Controllers\UnitController::class, 'updateForProject'])->name('projects.units.update');
    Route::delete('projects/{project}/units/{unit}', [\App\Http\Controllers\UnitController::class, 'destroyForProject'])->name('projects.units.destroy');

    // Unit image management
    Route::post('units/{unit}/images', [\App\Http\Controllers\UnitController::class, 'uploadImages'])->name('units.images.upload');
    Route::delete('units/{unit}/images', [\App\Http\Controllers\UnitController::class, 'deleteImage'])->name('units.images.delete');
});

// Public project view (no auth required)
// Default route redirects to Turkish version
Route::get('/p/{project:slug}', function (App\Models\Project $project) {
    return redirect()->route('public.project.show', ['locale' => 'tr', 'project' => $project->slug]);
});

// Language-specific routes: /p/tr/slug, /p/en/slug, or /p/ar/slug
Route::get('/p/{locale}/{project:slug}', [PublicProjectController::class, 'show'])
    ->where('locale', 'tr|en|ar')
    ->name('public.project.show');

require __DIR__.'/settings.php';

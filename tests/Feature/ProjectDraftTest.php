<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\withoutMiddleware;

beforeEach(function () {
    $this->user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    actingAs($this->user);
    Storage::fake('public');
    withoutMiddleware(ValidateCsrfToken::class);
});

test('can save a new draft', function () {
    $response = $this->post('/projects/drafts', [
        'current_step' => 1,
        'name' => 'Draft Project',
        'city' => 'Dubai',
        'location' => 'Marina',
        'hero_images' => [
            UploadedFile::fake()->image('hero.jpg'),
        ],
        'stay_on_page' => true,
    ], ['HTTP_ACCEPT' => 'application/json']);

    $response->assertOk();

    $project = Project::first();
    expect($project)->not->toBeNull();
    expect($project->is_draft)->toBeTrue();
    expect($project->created_by)->toBe($this->user->id);
    expect($project->current_step)->toBe(1);
    expect($project->getMedia('draft_hero'))->toHaveCount(1);
});

test('can update existing draft', function () {
    $draft = Project::factory()->create([
        'is_draft' => true,
        'created_by' => $this->user->id,
        'current_step' => 1,
    ]);

    $response = $this->post("/projects/drafts/{$draft->id}", [
        '_method' => 'PUT',
        'current_step' => 3,
        'name' => 'Updated Draft',
        'city' => 'Abu Dhabi',
        'location' => 'Saadiyat',
        'stay_on_page' => true,
    ], ['HTTP_ACCEPT' => 'application/json']);

    $response->assertOk();
    $draft->refresh();

    expect($draft->current_step)->toBe(3);
    expect($draft->name)->toBe('Updated Draft');
    expect($draft->city)->toBe('Abu Dhabi');
});

test('enforces draft limit of 10 per user', function () {
    Project::factory()->count(10)->create([
        'is_draft' => true,
        'created_by' => $this->user->id,
    ]);

    $response = $this->post('/projects/drafts', [
        'current_step' => 1,
        'name' => 'Limit Draft',
        'stay_on_page' => true,
    ], ['HTTP_ACCEPT' => 'application/json']);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['draft_limit']);
});

test('can publish complete draft', function () {
    $draft = Project::factory()->create([
        'is_draft' => true,
        'created_by' => $this->user->id,
        'current_step' => 7,
        'name' => 'Publishable Draft',
        'location' => 'Dubai Marina',
        'city' => 'Dubai',
        'slug' => 'publishable-draft',
    ]);

    $draft->addMedia(UploadedFile::fake()->image('draft-hero.jpg'))->toMediaCollection('draft_hero');
    $draft->addMedia(UploadedFile::fake()->image('draft-gallery.jpg'))->toMediaCollection('draft_gallery');

    $response = $this->post("/projects/drafts/{$draft->id}/publish", [
        'name' => 'Publishable Draft',
        'location' => 'Dubai Marina',
        'city' => 'Dubai',
    ]);

    $response->assertRedirect(route('projects.show', $draft));

    $draft->refresh();
    expect($draft->is_draft)->toBeFalse();
    expect($draft->current_step)->toBeNull();
    expect($draft->getMedia('draft_gallery'))->toHaveCount(0);
    expect($draft->getMedia('hero'))->toHaveCount(1);
    expect($draft->getMedia('gallery'))->toHaveCount(1);
});

test('cannot publish incomplete draft', function () {
    $draft = Project::factory()->create([
        'is_draft' => true,
        'created_by' => $this->user->id,
        'current_step' => 2,
    ]);

    $response = $this->post("/projects/drafts/{$draft->id}/publish", [], ['HTTP_ACCEPT' => 'application/json']);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['name', 'location', 'city']);
});

test('deletes draft and associated media', function () {
    $draft = Project::factory()->create([
        'is_draft' => true,
        'created_by' => $this->user->id,
    ]);

    $draft->addMedia(UploadedFile::fake()->image('draft-hero.jpg'))->toMediaCollection('draft_hero');
    $draft->addMedia(UploadedFile::fake()->image('draft-gallery.jpg'))->toMediaCollection('draft_gallery');

    $this->delete("/projects/{$draft->id}")
        ->assertRedirect(route('projects.index'));

    assertDatabaseMissing('projects', ['id' => $draft->id]);
    expect(Project::find($draft->id))->toBeNull();
});

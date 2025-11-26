<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('drafts scope returns only drafts', function () {
    $user = User::factory()->create();
    Project::factory()->count(2)->create(['is_draft' => true, 'created_by' => $user->id]);
    Project::factory()->count(3)->create(['is_draft' => false]);

    $drafts = Project::drafts()->get();

    expect($drafts)->toHaveCount(2);
    expect($drafts->every(fn ($project) => $project->is_draft))->toBeTrue();
});

test('published scope returns only published projects', function () {
    Project::factory()->count(2)->create(['is_draft' => true]);
    Project::factory()->count(4)->create(['is_draft' => false]);

    $published = Project::published()->get();

    expect($published)->toHaveCount(4);
    expect($published->every(fn ($project) => $project->is_draft === false))->toBeTrue();
});

test('myDrafts scope returns drafts for the given user', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    Project::factory()->count(3)->create(['is_draft' => true, 'created_by' => $userA->id]);
    Project::factory()->count(2)->create(['is_draft' => true, 'created_by' => $userB->id]);

    $userDrafts = Project::myDrafts($userA->id)->get();

    expect($userDrafts)->toHaveCount(3);
    expect($userDrafts->every(fn ($project) => $project->created_by === $userA->id))->toBeTrue();
});

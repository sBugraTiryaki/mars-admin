<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\withoutMiddleware;

beforeEach(function () {
    $this->user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    Storage::fake('public');
    withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

test('can create basic project with minimal required fields', function () {
    actingAs($this->user)
        ->post(route('projects.store'), [
            'name' => 'Test Project',
            'location' => 'Dubai Marina',
            'city' => 'Dubai',
        ])
        ->assertRedirect(route('projects.index'))
        ->assertSessionHas('success', 'Project created successfully.');

    assertDatabaseHas('projects', [
        'name' => 'Test Project',
        'location' => 'Dubai Marina',
        'city' => 'Dubai',
    ]);
});

test('can create project with all new fields', function () {
    actingAs($this->user)
        ->post(route('projects.store'), [
            // Basic info
            'name' => 'Complete Project',
            'public_name' => 'Complete Project Public',
            'developer' => 'Test Developer',
            'construction_company' => 'Build Co',
            'marketing_company' => 'Market Co',
            'description' => 'Test description',
            'overview' => 'Test overview',

            // Location
            'location' => 'Dubai Marina',
            'city' => 'Dubai',
            'country' => 'UAE',
            'district' => 'Marina District',
            'neighborhood' => 'Marina Walk',
            'street' => 'Marina Street',
            'building_no' => '123',
            'address_details' => 'Near the beach',

            // Details
            'citizenship_eligibility' => 'eligible',
            'is_government_housing' => 1,
            'has_title_deed' => 1,
            'unit_type' => '1br,2br,3br',
            'project_type' => 'residential',
            'view_type' => 'sea,city',

            // Guarantees
            'has_rental_guarantee' => 1,
            'rental_guarantee_years' => 5,
            'rental_guarantee_rate' => 7.5,
            'has_buyback_guarantee' => 1,
            'buyback_guarantee_rate' => 100, // Changed from 110 to 100

            // Payment
            'payment_plan' => 'installment',
            'down_payment_amount' => 100000,
            'installment_months' => 36,
            'vat_included' => 1,
            'vat_rate' => 5,
            'commission_included' => 1,
            'commission_rate' => 2,

            // Pricing
            'min_price' => 500000,
            'max_price' => 2000000,
            'currency' => 'AED',
            'status' => 'under_construction',
            'completion_date' => '2026-12-31',
            'delivery_status' => 'Q4 2026',

            // Hero
            'hero_title' => 'Luxury Living',
            'hero_subtitle' => 'Experience the best',

            // Status
            'is_featured' => 1,
            'is_active' => 1,
        ])
        ->assertRedirect(route('projects.index'))
        ->assertSessionHas('success');

    assertDatabaseHas('projects', [
        'name' => 'Complete Project',
        'citizenship_eligibility' => 'eligible',
        'has_rental_guarantee' => true,
        'rental_guarantee_years' => 5,
        'has_buyback_guarantee' => true,
        'buyback_guarantee_rate' => 100, // Changed from 110 to 100
        'payment_plan' => 'installment',
        'down_payment_amount' => 100000,
        'installment_months' => 36,
    ]);
});

test('can create project with dynamic amenities', function () {
    $amenities = [
        ['key' => 'Swimming Pool', 'value' => 'Olympic size pool', 'order' => 1],
        ['key' => 'Gym', 'value' => 'Fully equipped gym', 'order' => 2],
        ['key' => 'Parking', 'value' => 'Underground parking', 'order' => 3],
    ];

    actingAs($this->user)
        ->post(route('projects.store'), [
            'name' => 'Project with Amenities',
            'location' => 'Dubai Marina',
            'city' => 'Dubai',
            'project_amenities' => json_encode($amenities),
        ])
        ->assertRedirect(route('projects.index'));

    $project = Project::where('name', 'Project with Amenities')->first();
    expect($project)->not->toBeNull();
    expect($project->projectAmenities)->toHaveCount(3);

    assertDatabaseHas('project_amenities', [
        'project_id' => $project->id,
        'key' => 'Swimming Pool',
        'value' => 'Olympic size pool',
        'order' => 1,
    ]);
});

test('can create project with units', function () {
    $units = [
        [
            'unit_number' => 'A-101',
            'type' => '1br',
            'floor' => 1,
            'size_sqft' => 850,
            'min_size_sqm' => 75,
            'max_size_sqm' => 85,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'price' => 750000,
            'min_price' => 700000,
            'max_price' => 800000,
            'status' => 'available',
            'view' => 'sea',
            'has_balcony' => 1,
            'has_parking' => 1,
        ],
        [
            'unit_number' => 'A-201',
            'type' => '2br',
            'floor' => 2,
            'size_sqft' => 1200,
            'min_size_sqm' => 100,
            'max_size_sqm' => 120,
            'bedrooms' => 2,
            'bathrooms' => 2,
            'price' => 1200000,
            'min_price' => 1100000,
            'max_price' => 1300000,
            'status' => 'available',
            'view' => 'city',
            'has_balcony' => 1,
            'has_parking' => 1,
        ],
    ];

    actingAs($this->user)
        ->post(route('projects.store'), [
            'name' => 'Project with Units',
            'location' => 'Dubai Marina',
            'city' => 'Dubai',
            'units' => json_encode($units),
        ])
        ->assertRedirect(route('projects.index'));

    $project = Project::where('name', 'Project with Units')->first();
    expect($project)->not->toBeNull();
    expect($project->units)->toHaveCount(2);

    assertDatabaseHas('units', [
        'project_id' => $project->id,
        'unit_number' => 'A-101',
        'type' => '1br',
        'min_price' => 700000,
        'max_price' => 800000,
        'min_size_sqm' => 75,
        'max_size_sqm' => 85,
    ]);
});

test('validates required fields', function () {
    actingAs($this->user)
        ->post(route('projects.store'), [])
        ->assertSessionHasErrors(['name', 'location', 'city']);
});

test('handles empty strings for numeric fields in units', function () {
    $units = [
        [
            'unit_number' => 'A-101',
            'type' => '1br',
            'floor' => '',
            'size_sqft' => '',
            'min_size_sqm' => '',
            'max_size_sqm' => '',
            'bedrooms' => 1,
            'bathrooms' => 1,
            'price' => '',
            'min_price' => '',
            'max_price' => '',
            'status' => 'available',
            'view' => '',
            'has_balcony' => 0,
            'has_parking' => 0,
        ],
    ];

    actingAs($this->user)
        ->post(route('projects.store'), [
            'name' => 'Project with Empty Fields',
            'location' => 'Dubai Marina',
            'city' => 'Dubai',
            'units' => json_encode($units),
        ])
        ->assertRedirect(route('projects.index'))
        ->assertSessionHas('success');

    $project = Project::where('name', 'Project with Empty Fields')->first();
    expect($project)->not->toBeNull();
    expect($project->units)->toHaveCount(1);

    $unit = $project->units->first();
    expect($unit->floor)->toBeNull();
    expect($unit->size_sqft)->toBeNull();
    expect($unit->min_size_sqm)->toBeNull();
    expect($unit->max_size_sqm)->toBeNull();
    expect($unit->price)->toBeNull();
    expect($unit->min_price)->toBeNull();
    expect($unit->max_price)->toBeNull();
});

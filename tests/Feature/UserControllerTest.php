<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    // Create roles
    Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'portfolio_manager', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'salesperson', 'guard_name' => 'web']);

    // Create admin user
    $this->adminUser = User::factory()->create();
    $this->adminUser->assignRole('admin');
});

test('admin can view users index page', function () {
    actingAs($this->adminUser)
        ->get('/users')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('users/index'));
});

test('admin can view create user page', function () {
    actingAs($this->adminUser)
        ->get('/users/create')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('users/create'));
});

test('admin can create a new user', function () {
    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'roles' => ['salesperson'],
    ];

    actingAs($this->adminUser)
        ->post('/users', $userData)
        ->assertRedirect('/users')
        ->assertSessionHas('success');

    assertDatabaseHas('users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $user = User::where('email', 'test@example.com')->first();
    expect($user->hasRole('salesperson'))->toBeTrue();
});

test('admin can view edit user page', function () {
    $user = User::factory()->create();

    actingAs($this->adminUser)
        ->get("/users/{$user->id}/edit")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('users/edit'));
});

test('admin can update a user', function () {
    $user = User::factory()->create();
    $user->assignRole('salesperson');

    $updateData = [
        'name' => 'Updated Name',
        'email' => $user->email,
        'roles' => ['portfolio_manager'],
    ];

    actingAs($this->adminUser)
        ->put("/users/{$user->id}", $updateData)
        ->assertRedirect('/users')
        ->assertSessionHas('success');

    assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
    ]);

    $user->refresh();
    expect($user->hasRole('portfolio_manager'))->toBeTrue();
    expect($user->hasRole('salesperson'))->toBeFalse();
});

test('admin can update user password', function () {
    $user = User::factory()->create();
    $oldPassword = $user->password;

    $updateData = [
        'name' => $user->name,
        'email' => $user->email,
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ];

    actingAs($this->adminUser)
        ->put("/users/{$user->id}", $updateData)
        ->assertRedirect('/users');

    $user->refresh();
    expect($user->password)->not->toBe($oldPassword);
});

test('admin can delete a user', function () {
    $user = User::factory()->create();

    actingAs($this->adminUser)
        ->delete("/users/{$user->id}")
        ->assertRedirect('/users')
        ->assertSessionHas('success');

    assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});

test('user cannot delete their own account', function () {
    actingAs($this->adminUser)
        ->delete("/users/{$this->adminUser->id}")
        ->assertRedirect('/users')
        ->assertSessionHas('error');

    assertDatabaseHas('users', [
        'id' => $this->adminUser->id,
    ]);
});

test('user index can be searched', function () {
    $user1 = User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
    $user2 = User::factory()->create(['name' => 'Jane Smith', 'email' => 'jane@example.com']);

    actingAs($this->adminUser)
        ->get('/users?search=John')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('users/index')
            ->has('users.data', fn ($users) => $users->where('name', 'John Doe'))
        );
});

test('user index can be filtered by role', function () {
    $user1 = User::factory()->create();
    $user1->assignRole('admin');

    $user2 = User::factory()->create();
    $user2->assignRole('salesperson');

    actingAs($this->adminUser)
        ->get('/users?role=salesperson')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('users/index'));
});

test('create user requires valid email', function () {
    $userData = [
        'name' => 'Test User',
        'email' => 'invalid-email',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    actingAs($this->adminUser)
        ->post('/users', $userData)
        ->assertSessionHasErrors('email');
});

test('create user requires unique email', function () {
    $existingUser = User::factory()->create(['email' => 'existing@example.com']);

    $userData = [
        'name' => 'Test User',
        'email' => 'existing@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    actingAs($this->adminUser)
        ->post('/users', $userData)
        ->assertSessionHasErrors('email');
});

test('create user requires password confirmation', function () {
    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'different-password',
    ];

    actingAs($this->adminUser)
        ->post('/users', $userData)
        ->assertSessionHasErrors('password');
});

test('update user requires valid role', function () {
    $user = User::factory()->create();

    $updateData = [
        'name' => $user->name,
        'email' => $user->email,
        'roles' => ['invalid_role'],
    ];

    actingAs($this->adminUser)
        ->put("/users/{$user->id}", $updateData)
        ->assertSessionHasErrors('roles.0');
});

test('guests cannot access user pages', function () {
    $this->get('/users')->assertRedirect('/');
    $this->get('/users/create')->assertRedirect('/');
    $this->post('/users', [])->assertRedirect('/');
});

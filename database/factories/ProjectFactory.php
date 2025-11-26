<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company().' '.fake()->randomElement(['Tower', 'Residences', 'Heights', 'Gardens', 'Bay', 'Marina', 'Palm']);
        $cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'];
        $locations = ['Downtown', 'Business Bay', 'Dubai Marina', 'Palm Jumeirah', 'JBR', 'Creek Harbour', 'Dubai Hills', 'Al Reem Island'];
        $developers = ['Emaar', 'DAMAC', 'Nakheel', 'Meraas', 'Aldar', 'Sobha', 'Azizi', 'Danube'];
        $amenities = ['Swimming Pool', 'Gym', 'Sauna', 'Kids Play Area', 'BBQ Area', 'Concierge', '24/7 Security', 'Parking', 'Rooftop Terrace', 'Business Center'];

        $minPrice = fake()->numberBetween(500000, 2000000);
        $maxPrice = $minPrice + fake()->numberBetween(500000, 3000000);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 9999),
            'description' => fake()->paragraphs(3, true),
            'location' => fake()->randomElement($locations),
            'city' => fake()->randomElement($cities),
            'country' => 'UAE',
            'total_units' => fake()->numberBetween(50, 500),
            'min_price' => $minPrice,
            'max_price' => $maxPrice,
            'currency' => 'AED',
            'status' => fake()->randomElement(['planning', 'under_construction', 'completed', 'sold_out']),
            'completion_date' => fake()->dateTimeBetween('now', '+3 years'),
            'developer' => fake()->randomElement($developers),
            'amenities' => fake()->randomElements($amenities, fake()->numberBetween(4, 8)),
            'images' => null,
            'cover_image' => null,
            'is_featured' => fake()->boolean(20),
            'is_active' => fake()->boolean(90),
            'is_draft' => false,
            'current_step' => null,
            'created_by' => null,
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }
}

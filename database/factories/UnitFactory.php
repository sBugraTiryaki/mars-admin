<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Unit>
 */
class UnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['studio', '1br', '2br', '3br', '4br', '5br', 'penthouse', 'duplex', 'townhouse', 'villa'];
        $type = fake()->randomElement($types);

        $bedroomMap = [
            'studio' => 0,
            '1br' => 1,
            '2br' => 2,
            '3br' => 3,
            '4br' => 4,
            '5br' => 5,
            'penthouse' => fake()->numberBetween(3, 5),
            'duplex' => fake()->numberBetween(3, 4),
            'townhouse' => fake()->numberBetween(3, 5),
            'villa' => fake()->numberBetween(4, 7),
        ];

        $sizeMap = [
            'studio' => [400, 600],
            '1br' => [600, 900],
            '2br' => [900, 1400],
            '3br' => [1400, 2000],
            '4br' => [2000, 3000],
            '5br' => [3000, 4500],
            'penthouse' => [3500, 8000],
            'duplex' => [2500, 4000],
            'townhouse' => [2000, 4000],
            'villa' => [4000, 10000],
        ];

        $sizeSqft = fake()->numberBetween($sizeMap[$type][0], $sizeMap[$type][1]);
        $sizeSqm = round($sizeSqft * 0.092903, 2);
        $pricePerSqft = fake()->numberBetween(1000, 3500);
        $price = $sizeSqft * $pricePerSqft;

        $features = ['Built-in Wardrobes', 'Kitchen Appliances', 'Central A/C', 'Double Glazed Windows', 'Smart Home', 'Maid Room', 'Study Room', 'Storage Room'];
        $views = ['sea', 'city', 'garden', 'pool', 'park', 'marina', 'golf', 'other'];

        return [
            'project_id' => Project::factory(),
            'unit_number' => strtoupper(fake()->bothify('?-###')),
            'name' => fake()->optional(0.3)->words(3, true),
            'type' => $type,
            'floor' => fake()->numberBetween(1, 50),
            'size_sqft' => $sizeSqft,
            'size_sqm' => $sizeSqm,
            'bedrooms' => $bedroomMap[$type],
            'bathrooms' => max(1, $bedroomMap[$type] + fake()->numberBetween(0, 1)),
            'price' => $price,
            'currency' => 'AED',
            'status' => fake()->randomElement(['available', 'reserved', 'sold', 'rented']),
            'view' => fake()->randomElement($views),
            'has_balcony' => fake()->boolean(70),
            'has_parking' => fake()->boolean(80),
            'parking_spots' => fake()->numberBetween(1, 3),
            'features' => fake()->randomElements($features, fake()->numberBetween(3, 6)),
            'images' => null,
            'floor_plan' => null,
            'notes' => fake()->optional(0.3)->sentence(),
            'is_active' => fake()->boolean(95),
        ];
    }

    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
        ]);
    }

    public function sold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sold',
        ]);
    }
}

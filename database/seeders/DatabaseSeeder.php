<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectAmenity;
use App\Models\ProjectTranslation;
use App\Models\Unit;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
        ]);

        // Create 3 projects with translations, units, and amenities
        $this->seedProjects();
    }

    private function seedProjects(): void
    {
        $projects = [
            [
                'name' => 'Marina Heights Tower',
                'slug' => 'marina-heights-tower-'.uniqid(),
                'public_name' => 'Marina Heights',
                'developer' => 'Emaar Properties',
                'location' => 'Dubai Marina',
                'city' => 'Dubai',
                'country' => 'UAE',
                'overview' => 'Luxury waterfront living with stunning marina views and world-class amenities.',
                'hero_title' => 'Marina Heights Tower',
                'hero_subtitle' => 'Experience Luxury Living by the Water',
                'min_price' => 1200000,
                'max_price' => 3500000,
                'currency' => 'AED',
                'status' => 'under_construction',
                'completion_date' => '2026-12-31',
                'is_featured' => true,
                'is_active' => true,
                'translations' => [
                    'tr' => [
                        'overview' => 'Muhteşem marina manzarası ve dünya standartlarında olanaklarla lüks sahil yaşamı.',
                        'hero_title' => 'Marina Heights Kulesi',
                        'hero_subtitle' => 'Suyun Kenarında Lüks Yaşamı Deneyimleyin',
                    ],
                    'en' => [
                        'overview' => 'Luxury waterfront living with stunning marina views and world-class amenities.',
                        'hero_title' => 'Marina Heights Tower',
                        'hero_subtitle' => 'Experience Luxury Living by the Water',
                    ],
                ],
                'amenities' => [
                    ['key' => 'Swimming Pool', 'value' => 'Infinity pool with marina views', 'order' => 1],
                    ['key' => 'Fitness Center', 'value' => 'State-of-the-art gym equipment', 'order' => 2],
                    ['key' => 'Parking', 'value' => 'Underground parking for residents', 'order' => 3],
                    ['key' => 'Security', 'value' => '24/7 security and CCTV', 'order' => 4],
                    ['key' => 'Concierge', 'value' => 'Dedicated concierge service', 'order' => 5],
                ],
                'units' => [
                    ['unit_number' => 'A-101', 'type' => '1br', 'floor' => 1, 'size_sqft' => 850, 'bedrooms' => 1, 'bathrooms' => 1, 'price' => 1200000],
                    ['unit_number' => 'B-201', 'type' => '2br', 'floor' => 2, 'size_sqft' => 1200, 'bedrooms' => 2, 'bathrooms' => 2, 'price' => 2000000],
                    ['unit_number' => 'C-301', 'type' => '3br', 'floor' => 3, 'size_sqft' => 1800, 'bedrooms' => 3, 'bathrooms' => 3, 'price' => 3500000],
                ],
            ],
            [
                'name' => 'Palm Residences',
                'slug' => 'palm-residences-'.uniqid(),
                'public_name' => 'Palm Residences',
                'developer' => 'Nakheel',
                'location' => 'Palm Jumeirah',
                'city' => 'Dubai',
                'country' => 'UAE',
                'overview' => 'Exclusive beachfront apartments on the iconic Palm Jumeirah with private beach access.',
                'hero_title' => 'Palm Residences',
                'hero_subtitle' => 'Your Private Paradise Awaits',
                'min_price' => 2500000,
                'max_price' => 8000000,
                'currency' => 'AED',
                'status' => 'completed',
                'completion_date' => '2024-06-30',
                'is_featured' => true,
                'is_active' => true,
                'translations' => [
                    'tr' => [
                        'overview' => 'Efsanevi Palm Jumeirah üzerinde özel plaj erişimli, münhasır sahil daireleri.',
                        'hero_title' => 'Palm Residences',
                        'hero_subtitle' => 'Özel Cennetiniz Sizi Bekliyor',
                    ],
                    'en' => [
                        'overview' => 'Exclusive beachfront apartments on the iconic Palm Jumeirah with private beach access.',
                        'hero_title' => 'Palm Residences',
                        'hero_subtitle' => 'Your Private Paradise Awaits',
                    ],
                ],
                'amenities' => [
                    ['key' => 'Private Beach', 'value' => 'Exclusive beach access for residents', 'order' => 1],
                    ['key' => 'Spa & Wellness', 'value' => 'Full-service spa and wellness center', 'order' => 2],
                    ['key' => 'Kids Play Area', 'value' => 'Safe outdoor play area for children', 'order' => 3],
                    ['key' => 'Restaurant', 'value' => 'On-site fine dining restaurant', 'order' => 4],
                    ['key' => 'Valet Parking', 'value' => 'Premium valet parking service', 'order' => 5],
                ],
                'units' => [
                    ['unit_number' => 'P-101', 'type' => '2br', 'floor' => 1, 'size_sqft' => 1500, 'bedrooms' => 2, 'bathrooms' => 2, 'price' => 2500000],
                    ['unit_number' => 'P-205', 'type' => '3br', 'floor' => 2, 'size_sqft' => 2200, 'bedrooms' => 3, 'bathrooms' => 3, 'price' => 4500000],
                    ['unit_number' => 'P-PH1', 'type' => 'penthouse', 'floor' => 10, 'size_sqft' => 4000, 'bedrooms' => 4, 'bathrooms' => 5, 'price' => 8000000],
                ],
            ],
            [
                'name' => 'Downtown Vista',
                'slug' => 'downtown-vista-'.uniqid(),
                'public_name' => 'Downtown Vista',
                'developer' => 'Dubai Properties',
                'location' => 'Downtown Dubai',
                'city' => 'Dubai',
                'country' => 'UAE',
                'overview' => 'Modern urban living in the heart of Downtown Dubai with Burj Khalifa views.',
                'hero_title' => 'Downtown Vista',
                'hero_subtitle' => 'Live in the Center of Everything',
                'min_price' => 1800000,
                'max_price' => 5000000,
                'currency' => 'AED',
                'status' => 'planning',
                'completion_date' => '2027-03-31',
                'is_featured' => false,
                'is_active' => true,
                'translations' => [
                    'tr' => [
                        'overview' => 'Burj Khalifa manzaralı, Downtown Dubai\'nin kalbinde modern şehir yaşamı.',
                        'hero_title' => 'Downtown Vista',
                        'hero_subtitle' => 'Her Şeyin Merkezinde Yaşayın',
                    ],
                    'en' => [
                        'overview' => 'Modern urban living in the heart of Downtown Dubai with Burj Khalifa views.',
                        'hero_title' => 'Downtown Vista',
                        'hero_subtitle' => 'Live in the Center of Everything',
                    ],
                ],
                'amenities' => [
                    ['key' => 'Rooftop Pool', 'value' => 'Stunning rooftop infinity pool', 'order' => 1],
                    ['key' => 'Business Center', 'value' => 'Modern co-working spaces', 'order' => 2],
                    ['key' => 'Yoga Studio', 'value' => 'Dedicated yoga and meditation studio', 'order' => 3],
                    ['key' => 'Cinema Room', 'value' => 'Private cinema for residents', 'order' => 4],
                    ['key' => 'Shopping Mall', 'value' => 'Connected to Dubai Mall', 'order' => 5],
                ],
                'units' => [
                    ['unit_number' => 'D-102', 'type' => '1br', 'floor' => 1, 'size_sqft' => 900, 'bedrooms' => 1, 'bathrooms' => 1, 'price' => 1800000],
                    ['unit_number' => 'D-210', 'type' => '2br', 'floor' => 2, 'size_sqft' => 1400, 'bedrooms' => 2, 'bathrooms' => 2, 'price' => 3000000],
                    ['unit_number' => 'D-505', 'type' => '3br', 'floor' => 5, 'size_sqft' => 2000, 'bedrooms' => 3, 'bathrooms' => 3, 'price' => 5000000],
                ],
            ],
        ];

        foreach ($projects as $projectData) {
            $translations = $projectData['translations'];
            $amenities = $projectData['amenities'];
            $units = $projectData['units'];

            unset($projectData['translations'], $projectData['amenities'], $projectData['units']);

            $project = Project::create($projectData);

            // Create translations
            foreach ($translations as $locale => $translationData) {
                ProjectTranslation::create([
                    'project_id' => $project->id,
                    'locale' => $locale,
                    ...$translationData,
                ]);
            }

            // Create amenities
            foreach ($amenities as $amenityData) {
                ProjectAmenity::create([
                    'project_id' => $project->id,
                    ...$amenityData,
                ]);
            }

            // Create units
            foreach ($units as $unitData) {
                Unit::create([
                    'project_id' => $project->id,
                    'currency' => $project->currency,
                    'status' => 'available',
                    'is_active' => true,
                    ...$unitData,
                ]);
            }
        }
    }
}

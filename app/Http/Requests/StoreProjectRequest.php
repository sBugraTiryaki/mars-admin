<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Auto-generate slug if not provided or empty
        if ($this->has('name') && (! $this->has('slug') || empty($this->slug))) {
            $this->merge([
                'slug' => Str::slug($this->name).'-'.uniqid(),
            ]);
        }

        // Decode units JSON string if provided
        if ($this->has('units') && is_string($this->units)) {
            $units = json_decode($this->units, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($units)) {
                $this->merge(['units' => $units]);
            }
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:projects,slug'],
            'description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'total_units' => ['nullable', 'integer', 'min:0'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'currency' => ['nullable', 'string', 'size:3'],
            'status' => ['nullable', 'string', 'in:planning,under_construction,completed,sold_out'],
            'completion_date' => ['nullable', 'date'],
            'developer' => ['nullable', 'string', 'max:255'],
            'amenities' => ['nullable', 'array'],
            'images' => ['nullable', 'array'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],

            // Image uploads
            'hero_images' => ['nullable', 'array'],
            'hero_images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],

            // Units validation
            'units' => ['nullable', 'array'],
            'units.*.unit_number' => ['required_with:units', 'string', 'max:50'],
            'units.*.type' => ['required_with:units', 'string', 'in:studio,1br,2br,3br,4br,5br,penthouse,duplex,townhouse,villa'],
            'units.*.floor' => ['nullable', 'integer'],
            'units.*.size_sqft' => ['required_with:units', 'numeric', 'min:0'],
            'units.*.size_sqm' => ['nullable', 'numeric', 'min:0'],
            'units.*.bedrooms' => ['nullable', 'integer', 'min:0'],
            'units.*.bathrooms' => ['nullable', 'integer', 'min:1'],
            'units.*.price' => ['required_with:units', 'numeric', 'min:0'],
            'units.*.currency' => ['nullable', 'string', 'size:3'],
            'units.*.status' => ['nullable', 'string', 'in:available,reserved,sold,rented'],
            'units.*.view' => ['nullable', 'string', 'in:sea,city,garden,pool,park,marina,golf,other'],
            'units.*.has_balcony' => ['nullable', 'boolean'],
            'units.*.has_parking' => ['nullable', 'boolean'],
            'units.*.parking_spots' => ['nullable', 'integer', 'min:0'],
            'units.*.notes' => ['nullable', 'string'],
            'units.*.is_active' => ['nullable', 'boolean'],
        ];
    }
}

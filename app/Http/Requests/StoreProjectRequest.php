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
        if ($this->has('name') && ! $this->has('slug')) {
            $this->merge([
                'slug' => Str::slug($this->name).'-'.uniqid(),
            ]);
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
            'country' => ['sometimes', 'string', 'max:255'],
            'total_units' => ['sometimes', 'integer', 'min:0'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'status' => ['sometimes', 'string', 'in:planning,under_construction,completed,sold_out'],
            'completion_date' => ['nullable', 'date'],
            'developer' => ['nullable', 'string', 'max:255'],
            'amenities' => ['nullable', 'array'],
            'images' => ['nullable', 'array'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],

            // Units validation
            'units' => ['nullable', 'array'],
            'units.*.unit_number' => ['required', 'string', 'max:50'],
            'units.*.type' => ['required', 'string', 'in:studio,1br,2br,3br,4br,5br,penthouse,duplex,townhouse,villa'],
            'units.*.floor' => ['nullable', 'integer'],
            'units.*.size_sqft' => ['required', 'numeric', 'min:0'],
            'units.*.size_sqm' => ['nullable', 'numeric', 'min:0'],
            'units.*.bedrooms' => ['sometimes', 'integer', 'min:0'],
            'units.*.bathrooms' => ['sometimes', 'integer', 'min:1'],
            'units.*.price' => ['required', 'numeric', 'min:0'],
            'units.*.currency' => ['sometimes', 'string', 'size:3'],
            'units.*.status' => ['sometimes', 'string', 'in:available,reserved,sold,rented'],
            'units.*.view' => ['nullable', 'string', 'in:sea,city,garden,pool,park,marina,golf,other'],
            'units.*.has_balcony' => ['sometimes', 'boolean'],
            'units.*.has_parking' => ['sometimes', 'boolean'],
            'units.*.parking_spots' => ['sometimes', 'integer', 'min:0'],
            'units.*.notes' => ['nullable', 'string'],
            'units.*.is_active' => ['sometimes', 'boolean'],
        ];
    }
}

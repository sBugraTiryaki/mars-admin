<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'floor' => $this->floor === '' ? null : $this->floor,
            'view' => $this->view === '' ? null : $this->view,
            'parking_spots' => $this->parking_spots === '' ? null : $this->parking_spots,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'project_id' => ['nullable', 'exists:projects,id'],
            'unit_number' => ['required', 'string', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:studio,1br,2br,3br,4br,5br,penthouse,duplex,townhouse,villa'],
            'floor' => ['nullable', 'integer', 'min:0'],
            'size_sqft' => ['nullable', 'numeric', 'min:0'],
            'size_sqm' => ['nullable', 'numeric', 'min:0'],
            'min_size_sqm' => ['nullable', 'numeric', 'min:0'],
            'max_size_sqm' => ['nullable', 'numeric', 'min:0', 'gte:min_size_sqm'],
            'bedrooms' => ['sometimes', 'integer', 'min:0'],
            'bathrooms' => ['sometimes', 'integer', 'min:1'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'status' => ['sometimes', 'string', 'in:available,reserved,sold,rented'],
            'view' => ['nullable', 'string', 'in:sea,city,garden,pool,park,marina,golf,other'],
            'has_balcony' => ['sometimes', 'boolean'],
            'has_parking' => ['sometimes', 'boolean'],
            'parking_spots' => ['sometimes', 'integer', 'min:0'],
            'features' => ['nullable', 'array'],
            'images' => ['nullable', 'array'],
            'floor_plan' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],

            // Unit images upload
            'unit_images' => ['nullable', 'array'],
            'unit_images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],
            'floor_plan_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp,pdf', 'max:10240'],
        ];
    }
}

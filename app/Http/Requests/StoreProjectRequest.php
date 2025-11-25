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

        // Decode project_amenities JSON string if provided
        if ($this->has('project_amenities') && is_string($this->project_amenities)) {
            $amenities = json_decode($this->project_amenities, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($amenities)) {
                $this->merge(['project_amenities' => $amenities]);
            }
        }

        // Convert empty strings to null for nullable fields in units
        if ($this->has('units') && is_array($this->units)) {
            $units = $this->units;
            foreach ($units as $key => $unit) {
                $nullableFields = ['floor', 'size_sqft', 'size_sqm', 'min_size_sqm', 'max_size_sqm', 'price', 'min_price', 'max_price', 'parking_spots', 'view', 'notes', 'name'];
                foreach ($nullableFields as $field) {
                    if (isset($unit[$field]) && $unit[$field] === '') {
                        $units[$key][$field] = null;
                    }
                }
            }
            $this->merge(['units' => $units]);
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
            'public_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'overview' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'citizenship_eligibility' => ['nullable', 'string', 'in:eligible,not_eligible'],
            'district' => ['nullable', 'string', 'max:255'],
            'neighborhood' => ['nullable', 'string', 'max:255'],
            'street' => ['nullable', 'string', 'max:255'],
            'building_no' => ['nullable', 'string', 'max:255'],
            'address_details' => ['nullable', 'string'],
            'total_units' => ['nullable', 'integer', 'min:0'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'currency' => ['nullable', 'string', 'size:3'],
            'status' => ['nullable', 'string', 'in:planning,under_construction,completed,sold_out'],
            'completion_date' => ['nullable', 'date'],
            'delivery_status' => ['nullable', 'string', 'max:255'],
            'developer' => ['nullable', 'string', 'max:255'],
            'construction_company' => ['nullable', 'string', 'max:255'],
            'marketing_company' => ['nullable', 'string', 'max:255'],
            'has_rental_guarantee' => ['nullable', 'boolean'],
            'rental_guarantee_years' => ['nullable', 'integer', 'min:1', 'required_if:has_rental_guarantee,true'],
            'has_buyback_guarantee' => ['nullable', 'boolean'],
            'buyback_value_loss_percentage' => ['nullable', 'numeric', 'min:0', 'max:100', 'required_if:has_buyback_guarantee,true'],
            'is_government_housing' => ['nullable', 'boolean'],
            'has_title_deed' => ['nullable', 'boolean'],
            'unit_type' => ['nullable', 'string', 'max:255'],
            'project_type' => ['nullable', 'string', 'max:255'],
            'view_type' => ['nullable', 'string', 'max:255'],
            'payment_plan' => ['nullable', 'string', 'in:installment,cash'],
            'down_payment_amount' => ['nullable', 'numeric', 'min:0', 'required_if:payment_plan,installment'],
            'installment_months' => ['nullable', 'integer', 'min:1', 'required_if:payment_plan,installment'],
            'vat_included' => ['nullable', 'boolean'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'commission_included' => ['nullable', 'boolean'],
            'commission_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string'],
            'amenities' => ['nullable', 'array'],
            'images' => ['nullable', 'array'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],

            // Dynamic amenities
            'project_amenities' => ['nullable', 'array'],
            'project_amenities.*.key' => ['required_with:project_amenities', 'string', 'max:255'],
            'project_amenities.*.value' => ['required_with:project_amenities', 'string'],
            'project_amenities.*.order' => ['nullable', 'integer', 'min:0'],

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
            'units.*.size_sqft' => ['nullable', 'numeric', 'min:0'],
            'units.*.size_sqm' => ['nullable', 'numeric', 'min:0'],
            'units.*.min_size_sqm' => ['nullable', 'numeric', 'min:0'],
            'units.*.max_size_sqm' => ['nullable', 'numeric', 'min:0', 'gte:units.*.min_size_sqm'],
            'units.*.bedrooms' => ['nullable', 'integer', 'min:0'],
            'units.*.bathrooms' => ['nullable', 'integer', 'min:1'],
            'units.*.price' => ['nullable', 'numeric', 'min:0'],
            'units.*.min_price' => ['nullable', 'numeric', 'min:0'],
            'units.*.max_price' => ['nullable', 'numeric', 'min:0', 'gte:units.*.min_price'],
            'units.*.currency' => ['nullable', 'string', 'size:3'],
            'units.*.status' => ['nullable', 'string', 'in:available,reserved,sold,rented'],
            'units.*.view' => ['nullable', 'string', 'in:sea,city,garden,pool,park,marina,golf,other'],
            'units.*.has_balcony' => ['nullable', 'boolean'],
            'units.*.has_parking' => ['nullable', 'boolean'],
            'units.*.parking_spots' => ['nullable', 'integer', 'min:0'],
            'units.*.notes' => ['nullable', 'string'],
            'units.*.is_active' => ['nullable', 'boolean'],

            // Translations
            'overview_tr' => ['nullable', 'string'],
            'overview_en' => ['nullable', 'string'],
            'overview_ar' => ['nullable', 'string'],
            'hero_title_tr' => ['nullable', 'string', 'max:255'],
            'hero_title_en' => ['nullable', 'string', 'max:255'],
            'hero_title_ar' => ['nullable', 'string', 'max:255'],
            'hero_subtitle_tr' => ['nullable', 'string'],
            'hero_subtitle_en' => ['nullable', 'string'],
            'hero_subtitle_ar' => ['nullable', 'string'],
        ];
    }
}

<?php

namespace App\Http\Requests;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SaveDraftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('name') && (! $this->has('slug') || empty($this->slug))) {
            $this->merge([
                'slug' => Str::slug($this->name).'-draft-'.uniqid(),
            ]);
        }

        if (! $this->has('slug')) {
            $this->merge([
                'slug' => 'draft-'.uniqid(),
            ]);
        }

        if ($this->has('units') && is_string($this->units)) {
            $units = json_decode($this->units, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($units)) {
                $this->merge(['units' => $units]);
            }
        }

        if ($this->has('project_amenities') && is_string($this->project_amenities)) {
            $amenities = json_decode($this->project_amenities, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($amenities)) {
                $this->merge(['project_amenities' => $amenities]);
            }
        }

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
            'current_step' => ['required', 'integer', 'between:1,8'],
            'name' => ['nullable', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('projects', 'slug')->ignore($this->route('project')),
            ],
            'public_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'overview' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'citizenship_eligibility' => ['nullable', 'string', 'in:eligible,not_eligible'],
            'district' => ['nullable', 'string', 'max:255'],
            'neighborhood' => ['nullable', 'string', 'max:255'],
            'street' => ['nullable', 'string', 'max:255'],
            'building_no' => ['nullable', 'string', 'max:255'],
            'address_details' => ['nullable', 'string'],
            'total_units' => ['nullable', 'integer', 'min:0'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'status' => ['nullable', 'string', 'in:planning,under_construction,completed,sold_out'],
            'completion_date' => ['nullable', 'date'],
            'delivery_status' => ['nullable', 'string', 'max:255'],
            'developer' => ['nullable', 'string', 'max:255'],
            'construction_company' => ['nullable', 'string', 'max:255'],
            'marketing_company' => ['nullable', 'string', 'max:255'],
            'has_rental_guarantee' => ['nullable', 'boolean'],
            'rental_guarantee_years' => ['nullable', 'integer', 'min:1'],
            'has_buyback_guarantee' => ['nullable', 'boolean'],
            'buyback_value_loss_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'is_government_housing' => ['nullable', 'boolean'],
            'has_title_deed' => ['nullable', 'boolean'],
            'unit_type' => ['nullable', 'string', 'max:255'],
            'project_type' => ['nullable', 'string', 'max:255'],
            'view_type' => ['nullable', 'string', 'max:255'],
            'payment_plan' => ['nullable', 'string', 'in:installment,cash'],
            'down_payment_amount' => ['nullable', 'numeric', 'min:0'],
            'installment_months' => ['nullable', 'integer', 'min:1'],
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

            'project_amenities' => ['nullable', 'array'],
            'project_amenities.*.key' => ['nullable', 'string', 'max:255'],
            'project_amenities.*.value' => ['nullable', 'string'],
            'project_amenities.*.order' => ['nullable', 'integer', 'min:0'],

            'hero_images' => ['nullable', 'array'],
            'hero_images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],
            'existing_draft_hero_images' => ['nullable', 'array'],
            'existing_draft_hero_images.*' => ['string'],
            'existing_draft_gallery_images' => ['nullable', 'array'],
            'existing_draft_gallery_images.*' => ['string'],

            'units' => ['nullable', 'array'],
            'units.*.unit_number' => ['nullable', 'string', 'max:50'],
            'units.*.type' => ['nullable', 'string', 'in:studio,1br,2br,3br,4br,5br,penthouse,duplex,townhouse,villa'],
            'units.*.floor' => ['nullable', 'integer'],
            'units.*.size_sqft' => ['nullable', 'numeric', 'min:0'],
            'units.*.size_sqm' => ['nullable', 'numeric', 'min:0'],
            'units.*.min_size_sqm' => ['nullable', 'numeric', 'min:0'],
            'units.*.max_size_sqm' => ['nullable', 'numeric', 'min:0'],
            'units.*.bedrooms' => ['nullable', 'integer', 'min:0'],
            'units.*.bathrooms' => ['nullable', 'integer', 'min:0'],
            'units.*.price' => ['nullable', 'numeric', 'min:0'],
            'units.*.min_price' => ['nullable', 'numeric', 'min:0'],
            'units.*.max_price' => ['nullable', 'numeric', 'min:0'],
            'units.*.currency' => ['nullable', 'string', 'size:3'],
            'units.*.status' => ['nullable', 'string', 'in:available,reserved,sold,rented'],
            'units.*.view' => ['nullable', 'string', 'in:sea,city,garden,pool,park,marina,golf,other'],
            'units.*.has_balcony' => ['nullable', 'boolean'],
            'units.*.has_parking' => ['nullable', 'boolean'],
            'units.*.parking_spots' => ['nullable', 'integer', 'min:0'],
            'units.*.notes' => ['nullable', 'string'],
            'units.*.is_active' => ['nullable', 'boolean'],

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

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $project = $this->route('project');
            $isCreating = ! $project instanceof Project;

            if ($isCreating) {
                $draftCount = Project::drafts()
                    ->where('created_by', $this->user()?->id)
                    ->count();

                if ($draftCount >= 10) {
                    $validator->errors()->add('draft_limit', 'En fazla 10 taslak oluşturabilirsiniz.');
                }
            }
        });
    }
}

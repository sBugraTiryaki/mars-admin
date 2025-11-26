<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
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
            'project_amenities.*.id' => ['nullable', 'integer', 'exists:project_amenities,id'],
            'project_amenities.*.key' => ['required_with:project_amenities', 'string', 'max:255'],
            'project_amenities.*.value' => ['required_with:project_amenities', 'string'],
            'project_amenities.*.order' => ['nullable', 'integer', 'min:0'],

            // Image uploads
            'hero_images' => ['nullable', 'array'],
            'hero_images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],
        ];
    }
}

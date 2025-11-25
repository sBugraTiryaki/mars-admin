<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Project extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;

    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'slug',
        'public_name',
        'description',
        'overview',
        'location',
        'city',
        'country',
        'citizenship_eligibility',
        'district',
        'neighborhood',
        'street',
        'building_no',
        'address_details',
        'total_units',
        'min_price',
        'max_price',
        'currency',
        'status',
        'completion_date',
        'delivery_status',
        'developer',
        'construction_company',
        'marketing_company',
        'has_rental_guarantee',
        'rental_guarantee_years',
        'rental_guarantee_rate',
        'has_buyback_guarantee',
        'buyback_guarantee_rate',
        'is_government_housing',
        'has_title_deed',
        'unit_type',
        'project_type',
        'view_type',
        'payment_plan',
        'down_payment_amount',
        'installment_months',
        'vat_included',
        'vat_rate',
        'commission_included',
        'commission_rate',
        'hero_title',
        'hero_subtitle',
        'amenities',
        'images',
        'cover_image',
        'is_featured',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amenities' => 'array',
            'images' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'has_rental_guarantee' => 'boolean',
            'has_buyback_guarantee' => 'boolean',
            'is_government_housing' => 'boolean',
            'has_title_deed' => 'boolean',
            'vat_included' => 'boolean',
            'commission_included' => 'boolean',
            'completion_date' => 'date',
            'min_price' => 'decimal:2',
            'max_price' => 'decimal:2',
            'rental_guarantee_rate' => 'decimal:2',
            'buyback_guarantee_rate' => 'decimal:2',
            'down_payment_amount' => 'decimal:2',
            'vat_rate' => 'decimal:2',
            'commission_rate' => 'decimal:2',
        ];
    }

    /**
     * @return HasMany<Unit, $this>
     */
    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
    }

    /**
     * @return HasMany<ProjectAmenity, $this>
     */
    public function projectAmenities(): HasMany
    {
        return $this->hasMany(ProjectAmenity::class)->orderBy('order');
    }

    /**
     * @return HasMany<ProjectTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(ProjectTranslation::class);
    }

    public function translation(string $locale): ?ProjectTranslation
    {
        return $this->translations()->where('locale', $locale)->first();
    }

    public function getTranslatedAttribute(string $attribute, string $locale): mixed
    {
        $translation = $this->translation($locale);

        return $translation?->{$attribute} ?? $this->{$attribute};
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('hero')
            ->useDisk('public');

        $this->addMediaCollection('gallery')
            ->useDisk('public');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(300)
            ->sharpen(10)
            ->nonQueued();

        $this->addMediaConversion('preview')
            ->width(800)
            ->height(600)
            ->sharpen(10)
            ->nonQueued();

        $this->addMediaConversion('large')
            ->width(1920)
            ->height(1080)
            ->sharpen(10)
            ->nonQueued();
    }

    /**
     * @return array<string>
     */
    public function getHeroImagesAttribute(): array
    {
        return $this->getMedia('hero')
            ->sortBy('order_column')
            ->map(fn (Media $media) => $media->getUrl())
            ->values()
            ->toArray();
    }

    /**
     * @return array<string>
     */
    public function getGalleryImagesAttribute(): array
    {
        return $this->getMedia('gallery')
            ->sortBy('order_column')
            ->map(fn (Media $media) => $media->getUrl())
            ->values()
            ->toArray();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Unit extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\UnitFactory> */
    use HasFactory;

    use InteractsWithMedia;

    protected $fillable = [
        'project_id',
        'unit_number',
        'name',
        'type',
        'floor',
        'size_sqft',
        'size_sqm',
        'min_size_sqm',
        'max_size_sqm',
        'bedrooms',
        'bathrooms',
        'price',
        'min_price',
        'max_price',
        'currency',
        'status',
        'view',
        'has_balcony',
        'has_parking',
        'parking_spots',
        'features',
        'images',
        'floor_plan',
        'notes',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'features' => 'array',
            'images' => 'array',
            'has_balcony' => 'boolean',
            'has_parking' => 'boolean',
            'is_active' => 'boolean',
            'price' => 'decimal:2',
            'min_price' => 'decimal:2',
            'max_price' => 'decimal:2',
            'size_sqft' => 'decimal:2',
            'size_sqm' => 'decimal:2',
            'min_size_sqm' => 'decimal:2',
            'max_size_sqm' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->useDisk('public');

        $this->addMediaCollection('floor_plan')
            ->singleFile()
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
    }

    /**
     * @return array<string>
     */
    public function getUnitImagesAttribute(): array
    {
        return $this->getMedia('images')
            ->sortBy('order_column')
            ->map(fn (Media $media) => $media->getUrl())
            ->values()
            ->toArray();
    }

    public function getFloorPlanUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('floor_plan') ?: null;
    }
}

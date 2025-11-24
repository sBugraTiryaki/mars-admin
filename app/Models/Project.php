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
        'description',
        'location',
        'city',
        'country',
        'total_units',
        'min_price',
        'max_price',
        'currency',
        'status',
        'completion_date',
        'developer',
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
            'completion_date' => 'date',
            'min_price' => 'decimal:2',
            'max_price' => 'decimal:2',
        ];
    }

    /**
     * @return HasMany<Unit, $this>
     */
    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
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

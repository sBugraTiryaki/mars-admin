<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Unit extends Model
{
    /** @use HasFactory<\Database\Factories\UnitFactory> */
    use HasFactory;

    protected $fillable = [
        'project_id',
        'unit_number',
        'name',
        'type',
        'floor',
        'size_sqft',
        'size_sqm',
        'bedrooms',
        'bathrooms',
        'price',
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
            'size_sqft' => 'decimal:2',
            'size_sqm' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}

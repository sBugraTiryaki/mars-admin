<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('unit_number');
            $table->string('name')->nullable();
            $table->enum('type', ['studio', '1br', '2br', '3br', '4br', '5br', 'penthouse', 'duplex', 'townhouse', 'villa']);
            $table->integer('floor')->nullable();
            $table->decimal('size_sqft', 10, 2);
            $table->decimal('size_sqm', 10, 2)->nullable();
            $table->integer('bedrooms')->default(0);
            $table->integer('bathrooms')->default(1);
            $table->decimal('price', 15, 2);
            $table->string('currency', 3)->default('AED');
            $table->enum('status', ['available', 'reserved', 'sold', 'rented'])->default('available');
            $table->enum('view', ['sea', 'city', 'garden', 'pool', 'park', 'marina', 'golf', 'other'])->nullable();
            $table->boolean('has_balcony')->default(false);
            $table->boolean('has_parking')->default(false);
            $table->integer('parking_spots')->default(0);
            $table->json('features')->nullable();
            $table->json('images')->nullable();
            $table->string('floor_plan')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['project_id', 'unit_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};

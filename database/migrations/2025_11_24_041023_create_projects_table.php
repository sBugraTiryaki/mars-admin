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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('location');
            $table->string('city');
            $table->string('country')->default('UAE');
            $table->integer('total_units')->default(0);
            $table->decimal('min_price', 15, 2)->nullable();
            $table->decimal('max_price', 15, 2)->nullable();
            $table->string('currency', 3)->default('AED');
            $table->enum('status', ['planning', 'under_construction', 'completed', 'sold_out'])->default('planning');
            $table->date('completion_date')->nullable();
            $table->string('developer')->nullable();
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->string('cover_image')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

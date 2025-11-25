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
        Schema::table('units', function (Blueprint $table) {
            // Min and max price range instead of single price
            $table->decimal('min_price', 15, 2)->nullable()->after('price');
            $table->decimal('max_price', 15, 2)->nullable()->after('min_price');

            // Min and max size in sqm
            $table->decimal('min_size_sqm', 10, 2)->nullable()->after('size_sqm');
            $table->decimal('max_size_sqm', 10, 2)->nullable()->after('min_size_sqm');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn([
                'min_price',
                'max_price',
                'min_size_sqm',
                'max_size_sqm',
            ]);
        });
    }
};

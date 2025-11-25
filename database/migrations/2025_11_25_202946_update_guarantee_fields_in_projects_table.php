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
        Schema::table('projects', function (Blueprint $table) {
            // Remove rental_guarantee_rate
            $table->dropColumn('rental_guarantee_rate');

            // Rename buyback_guarantee_rate to buyback_value_loss_percentage
            $table->renameColumn('buyback_guarantee_rate', 'buyback_value_loss_percentage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Add rental_guarantee_rate back
            $table->decimal('rental_guarantee_rate', 5, 2)->nullable()->after('rental_guarantee_years');

            // Rename back to buyback_guarantee_rate
            $table->renameColumn('buyback_value_loss_percentage', 'buyback_guarantee_rate');
        });
    }
};

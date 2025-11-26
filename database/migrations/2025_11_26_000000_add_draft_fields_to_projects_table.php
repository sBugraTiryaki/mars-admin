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
            $table->boolean('is_draft')->default(false)->after('is_active');
            $table->tinyInteger('current_step')->nullable()->after('is_draft');
            $table->foreignId('created_by')->nullable()->after('current_step')->constrained('users')->nullOnDelete();

            $table->index(['is_draft', 'created_by']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex(['is_draft', 'created_by']);
            $table->dropColumn(['is_draft', 'current_step', 'created_by']);
        });
    }
};

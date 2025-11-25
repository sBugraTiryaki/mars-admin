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
            // Public facing name
            $table->string('public_name')->nullable()->after('name');

            // Citizenship status
            $table->enum('citizenship_eligibility', ['eligible', 'not_eligible'])->default('eligible')->after('country');

            // Address fields
            $table->string('district')->nullable()->after('location');
            $table->string('neighborhood')->nullable()->after('district');
            $table->string('street')->nullable()->after('neighborhood');
            $table->string('building_no')->nullable()->after('street');
            $table->text('address_details')->nullable()->after('building_no');

            // Companies
            $table->string('construction_company')->nullable()->after('developer');
            $table->string('marketing_company')->nullable()->after('construction_company');

            // Rental guarantee
            $table->boolean('has_rental_guarantee')->default(false)->after('marketing_company');
            $table->integer('rental_guarantee_years')->nullable()->after('has_rental_guarantee');
            $table->decimal('rental_guarantee_rate', 5, 2)->nullable()->after('rental_guarantee_years');

            // Buyback guarantee
            $table->boolean('has_buyback_guarantee')->default(false)->after('rental_guarantee_rate');
            $table->decimal('buyback_guarantee_rate', 5, 2)->nullable()->after('has_buyback_guarantee');

            // Government housing
            $table->boolean('is_government_housing')->default(false)->after('buyback_guarantee_rate');

            // Title deed
            $table->boolean('has_title_deed')->default(true)->after('is_government_housing');

            // Unit type - now stored at project level
            $table->string('unit_type')->nullable()->after('has_title_deed');

            // Project type
            $table->string('project_type')->nullable()->after('unit_type');

            // View type
            $table->string('view_type')->nullable()->after('project_type');

            // Payment plan
            $table->enum('payment_plan', ['installment', 'cash'])->default('cash')->after('view_type');
            $table->decimal('down_payment_amount', 15, 2)->nullable()->after('payment_plan');
            $table->integer('installment_months')->nullable()->after('down_payment_amount');

            // VAT
            $table->boolean('vat_included')->default(true)->after('installment_months');
            $table->decimal('vat_rate', 5, 2)->nullable()->after('vat_included');

            // Commission
            $table->boolean('commission_included')->default(false)->after('vat_rate');
            $table->decimal('commission_rate', 5, 2)->nullable()->after('commission_included');

            // Delivery status
            $table->string('delivery_status')->nullable()->after('completion_date');

            // Overview/About
            $table->text('overview')->nullable()->after('description');

            // Hero section text
            $table->string('hero_title')->nullable()->after('overview');
            $table->text('hero_subtitle')->nullable()->after('hero_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'public_name',
                'citizenship_eligibility',
                'district',
                'neighborhood',
                'street',
                'building_no',
                'address_details',
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
                'delivery_status',
                'overview',
                'hero_title',
                'hero_subtitle',
            ]);
        });
    }
};

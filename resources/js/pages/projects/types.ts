export interface ProjectFormData {
    name: string;
    public_name: string;
    description: string;
    overview: string;
    developer: string;
    construction_company: string;
    marketing_company: string;

    // Location
    location: string;
    city: string;
    country: string;
    district: string;
    neighborhood: string;
    street: string;
    building_no: string;
    address_details: string;

    // Citizenship & Guarantees
    citizenship_eligibility: 'eligible' | 'not_eligible';
    has_rental_guarantee: boolean;
    rental_guarantee_years: string;
    rental_guarantee_rate: string;
    has_buyback_guarantee: boolean;
    is_government_housing: boolean;
    has_title_deed: boolean;

    // Types
    unit_type: string;
    project_type: string;
    view_type: string;

    // Payment
    payment_plan: 'installment' | 'cash';
    down_payment_amount: string;
    installment_months: string;
    vat_included: boolean;
    vat_rate: string;
    commission_included: boolean;
    commission_rate: string;

    // Pricing
    min_price: string;
    max_price: string;
    currency: string;
    status: string;
    completion_date: string;
    delivery_status: string;
    total_units: number;

    // Hero
    hero_title: string;
    hero_subtitle: string;

    // Translations
    overview_tr: string;
    overview_en: string;
    hero_title_tr: string;
    hero_title_en: string;
    hero_subtitle_tr: string;
    hero_subtitle_en: string;

    // Flags
    is_featured: boolean;
    is_active: boolean;
}

export interface UnitData {
    id: string;
    unit_number: string;
    type: string;
    floor: string;
    size_sqft: string;
    min_size_sqm: string;
    max_size_sqm: string;
    bedrooms: number;
    bathrooms: number;
    price: string;
    min_price: string;
    max_price: string;
    status: string;
    view: string;
    has_balcony: boolean;
    has_parking: boolean;
}

export interface AmenityData {
    id: string;
    key: string;
    value: string;
    order: number;
}

export interface StepProps {
    projectData: ProjectFormData;
    updateProjectData: (field: string, value: string | number | boolean) => void;
    errors: Record<string, string>;
}

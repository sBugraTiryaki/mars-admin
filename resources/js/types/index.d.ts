import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    [key: string]: unknown;
}

export interface Project {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    location: string;
    city: string;
    country: string;
    total_units: number;
    min_price: string | null;
    max_price: string | null;
    currency: string;
    status: 'planning' | 'under_construction' | 'completed' | 'sold_out';
    completion_date: string | null;
    developer: string | null;
    amenities: string[] | null;
    images: string[] | null;
    cover_image: string | null;
    is_featured: boolean;
    is_active: boolean;
    is_draft?: boolean;
    current_step?: number | null;
    created_by?: number | null;
    created_at: string;
    updated_at: string;
    units_count?: number;
    units?: Unit[];
    draft_hero_images?: string[];
    draft_gallery_images?: string[];
}

export interface Unit {
    id: number;
    project_id: number;
    unit_number: string;
    name: string | null;
    type: 'studio' | '1br' | '2br' | '3br' | '4br' | '5br' | 'penthouse' | 'duplex' | 'townhouse' | 'villa';
    floor: number | null;
    size_sqft: string;
    size_sqm: string | null;
    bedrooms: number;
    bathrooms: number;
    price: string;
    min_price?: string | null;
    max_price?: string | null;
    currency: string;
    status: 'available' | 'reserved' | 'sold' | 'rented';
    view: 'sea' | 'city' | 'garden' | 'pool' | 'park' | 'marina' | 'golf' | 'other' | null;
    has_balcony: boolean;
    has_parking: boolean;
    parking_spots: number;
    features: string[] | null;
    images: string[] | null;
    floor_plan: string | null;
    notes: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    project?: Project;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

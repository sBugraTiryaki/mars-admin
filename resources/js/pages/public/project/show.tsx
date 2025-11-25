import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { type Project, type Unit } from '@/types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Overview } from './components/Overview';
import { Gallery } from './components/Gallery';
import { Amenities } from './components/Amenities';
import { Units } from './components/Units';
import { Location } from './components/Location';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { InquiryModal } from './components/InquiryModal';
import { UnitModal } from './components/UnitModal';

interface Props {
    project: Project & {
        units: Unit[];
        hero_images?: string[];
        gallery_images?: string[];
        current_locale?: string;
    };
}

// Translation helper
const translations = {
    tr: {
        overview: 'Genel Bakış',
        gallery: 'Galeri',
        amenities: 'Özellikler',
        availableUnits: 'Müsait Üniteler',
        location: 'Konum',
        contact: 'İletişim',
        inquire: 'Bilgi Al',
        explore: 'Keşfet',
        developer: 'Geliştirici',
        status: 'Durum',
        completion: 'Teslim Tarihi',
        priceRange: 'Fiyat Aralığı',
        totalUnits: 'Toplam Ünite',
        bedroom: 'Yatak Odası',
        bedrooms: 'Yatak Odası',
        bathroom: 'Banyo',
        bathrooms: 'Banyo',
        floor: 'Kat',
        sqft: 'sqft',
        viewDetails: 'Detayları Gör',
        statusLabels: {
            planning: 'Planlama',
            under_construction: 'İnşaat Halinde',
            completed: 'Tamamlandı',
            sold_out: 'Tükendi',
        },
        unitTypes: {
            studio: 'Studio',
            '1br': '1 Yatak Odalı',
            '2br': '2 Yatak Odalı',
            '3br': '3 Yatak Odalı',
            '4br': '4 Yatak Odalı',
            '5br': '5 Yatak Odalı',
            penthouse: 'Çatı Katı',
            duplex: 'Dublex',
            townhouse: 'Müstakil Ev',
            villa: 'Villa',
        },
        viewTypes: {
            sea: 'Deniz Manzarası',
            city: 'Şehir Manzarası',
            garden: 'Bahçe Manzarası',
            pool: 'Havuz Manzarası',
            park: 'Park Manzarası',
            marina: 'Marina Manzarası',
            golf: 'Golf Manzarası',
            other: 'Diğer',
        },
        unitStatus: {
            available: 'Müsait',
            reserved: 'Rezerve',
            sold: 'Satıldı',
            rented: 'Kiralandı',
        },
    },
    en: {
        overview: 'Overview',
        gallery: 'Gallery',
        amenities: 'Amenities',
        availableUnits: 'Available Units',
        location: 'Location',
        contact: 'Contact',
        inquire: 'Inquire',
        explore: 'Explore',
        developer: 'Developer',
        status: 'Status',
        completion: 'Completion Date',
        priceRange: 'Price Range',
        totalUnits: 'Total Units',
        bedroom: 'Bedroom',
        bedrooms: 'Bedrooms',
        bathroom: 'Bathroom',
        bathrooms: 'Bathrooms',
        floor: 'Floor',
        sqft: 'sqft',
        viewDetails: 'View Details',
        statusLabels: {
            planning: 'Planning',
            under_construction: 'Under Construction',
            completed: 'Completed',
            sold_out: 'Sold Out',
        },
        unitTypes: {
            studio: 'Studio',
            '1br': '1 Bedroom',
            '2br': '2 Bedrooms',
            '3br': '3 Bedrooms',
            '4br': '4 Bedrooms',
            '5br': '5 Bedrooms',
            penthouse: 'Penthouse',
            duplex: 'Duplex',
            townhouse: 'Townhouse',
            villa: 'Villa',
        },
        viewTypes: {
            sea: 'Sea View',
            city: 'City View',
            garden: 'Garden View',
            pool: 'Pool View',
            park: 'Park View',
            marina: 'Marina View',
            golf: 'Golf View',
            other: 'Other',
        },
        unitStatus: {
            available: 'Available',
            reserved: 'Reserved',
            sold: 'Sold',
            rented: 'Rented',
        },
    },
};

export default function PublicProjectShow({ project }: Props) {
    const locale = (project.current_locale || 'tr') as 'tr' | 'en';
    const t = translations[locale];
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const [unitModalOpen, setUnitModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    const handleOpenInquiry = () => setInquiryModalOpen(true);
    const handleCloseInquiry = () => setInquiryModalOpen(false);

    const handleSelectUnit = (unit: Unit) => {
        setSelectedUnit(unit);
        setUnitModalOpen(true);
    };

    const handleCloseUnit = () => {
        setUnitModalOpen(false);
        setTimeout(() => setSelectedUnit(null), 300);
    };

    // Helper functions
    const formatPrice = (price: string | null, currency: string): string => {
        if (!price) return '-';
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    const getUnitTypeLabel = (type: Unit['type']): string => {
        return t.unitTypes[type] || type;
    };

    const getViewLabel = (view: Unit['view']): string => {
        if (!view) return '';
        return t.viewTypes[view] || view;
    };

    const getStatusLabel = (status: Project['status']): string => {
        return t.statusLabels[status] || status;
    };

    // Get hero images from media library (with fallback to legacy images)
    const heroImages = project.hero_images?.length
        ? project.hero_images
        : project.images?.slice(0, 3) || (project.cover_image ? [project.cover_image] : []);

    // Get gallery images from media library (with fallback to legacy images)
    const galleryImages = project.gallery_images?.length
        ? project.gallery_images
        : project.images || [];

    return (
        <>
            <Head title={project.name} />

            <div className="min-h-screen bg-white">
                <Header projectName={project.name} onInquire={handleOpenInquiry} t={t} />

                <main>
                    <Hero
                        images={heroImages}
                        onInquire={handleOpenInquiry}
                        t={t}
                    />
                    <Overview
                        project={project}
                        formatPrice={formatPrice}
                        getStatusLabel={getStatusLabel}
                        t={t}
                    />
                    {galleryImages.length > 0 && (
                        <Gallery images={galleryImages} projectName={project.name} t={t} />
                    )}
                    {project.amenities && project.amenities.length > 0 && (
                        <Amenities amenities={project.amenities} t={t} />
                    )}
                    {project.units && project.units.length > 0 && (
                        <Units
                            units={project.units}
                            onSelectUnit={handleSelectUnit}
                            formatPrice={formatPrice}
                            getUnitTypeLabel={getUnitTypeLabel}
                            t={t}
                        />
                    )}
                    <Location
                        location={project.location}
                        city={project.city}
                        t={t}
                    />
                    <Contact onInquire={handleOpenInquiry} t={t} />
                </main>

                <Footer projectName={project.name} />

                <InquiryModal
                    isOpen={inquiryModalOpen}
                    onClose={handleCloseInquiry}
                    projectName={project.name}
                />

                <UnitModal
                    unit={selectedUnit}
                    isOpen={unitModalOpen}
                    onClose={handleCloseUnit}
                    onInquire={handleOpenInquiry}
                    formatPrice={formatPrice}
                    getUnitTypeLabel={getUnitTypeLabel}
                    getViewLabel={getViewLabel}
                />
            </div>
        </>
    );
}

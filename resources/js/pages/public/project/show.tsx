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
    };
}

export default function PublicProjectShow({ project }: Props) {
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
        const labels: Record<Unit['type'], string> = {
            studio: 'Studio',
            '1br': '1 Bedroom',
            '2br': '2 Bedroom',
            '3br': '3 Bedroom',
            '4br': '4 Bedroom',
            '5br': '5 Bedroom',
            penthouse: 'Penthouse',
            duplex: 'Duplex',
            townhouse: 'Townhouse',
            villa: 'Villa',
        };
        return labels[type] || type;
    };

    const getViewLabel = (view: Unit['view']): string => {
        if (!view) return '';
        const labels: Record<NonNullable<Unit['view']>, string> = {
            sea: 'Sea View',
            city: 'City View',
            garden: 'Garden View',
            pool: 'Pool View',
            park: 'Park View',
            marina: 'Marina View',
            golf: 'Golf View',
            other: 'Other',
        };
        return labels[view] || view;
    };

    const getStatusLabel = (status: Project['status']): string => {
        const labels: Record<Project['status'], string> = {
            planning: 'Planning',
            under_construction: 'Under Construction',
            completed: 'Completed',
            sold_out: 'Sold Out',
        };
        return labels[status] || status;
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
                <Header projectName={project.name} onInquire={handleOpenInquiry} />

                <main>
                    <Hero
                        images={heroImages}
                        onInquire={handleOpenInquiry}
                    />
                    <Overview
                        project={project}
                        formatPrice={formatPrice}
                        getStatusLabel={getStatusLabel}
                    />
                    {galleryImages.length > 0 && (
                        <Gallery images={galleryImages} projectName={project.name} />
                    )}
                    {project.amenities && project.amenities.length > 0 && (
                        <Amenities amenities={project.amenities} />
                    )}
                    {project.units && project.units.length > 0 && (
                        <Units
                            units={project.units}
                            onSelectUnit={handleSelectUnit}
                            formatPrice={formatPrice}
                            getUnitTypeLabel={getUnitTypeLabel}
                        />
                    )}
                    <Location
                        location={project.location}
                        city={project.city}
                    />
                    <Contact onInquire={handleOpenInquiry} />
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

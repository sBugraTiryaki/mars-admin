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
    ar: {
        overview: 'نظرة عامة',
        gallery: 'معرض الصور',
        amenities: 'المرافق',
        availableUnits: 'الوحدات المتاحة',
        location: 'الموقع',
        contact: 'اتصل بنا',
        inquire: 'استفسر',
        explore: 'استكشف',
        developer: 'المطور',
        status: 'الحالة',
        completion: 'تاريخ الإنجاز',
        priceRange: 'نطاق السعر',
        totalUnits: 'إجمالي الوحدات',
        bedroom: 'غرفة نوم',
        bedrooms: 'غرف نوم',
        bathroom: 'حمام',
        bathrooms: 'حمامات',
        floor: 'الطابق',
        sqft: 'قدم مربع',
        size: 'المساحة',
        viewDetails: 'عرض التفاصيل',
        with: 'مع',
        and: 'و',
        bed: 'غرفة نوم',
        bath: 'حمام',
        from: 'من',
        view: 'الإطلالة',
        floorPlan: 'مخطط الطابق',
        prospectus: 'النشرة التعريفية',
        features: 'المميزات',
        balcony: 'شرفة',
        parking: 'موقف سيارات',
        spots: 'مواقف',
        sqm: 'متر مربع',
        noImagesAvailable: 'لا توجد صور متاحة',
        byInvitationOnly: 'بالدعوة فقط',
        forThoseWhoSeek: 'لأولئك الذين يبحثون عن أكثر من مجرد سكن.',
        allRightsReserved: 'جميع الحقوق محفوظة',
        developedWithPrecision: 'تم التطوير بدقة',
        statusLabels: {
            planning: 'قيد التخطيط',
            under_construction: 'قيد الإنشاء',
            completed: 'مكتمل',
            sold_out: 'نفذت الكمية',
        },
        unitTypes: {
            studio: 'استوديو',
            '1br': 'غرفة نوم واحدة',
            '2br': 'غرفتا نوم',
            '3br': '3 غرف نوم',
            '4br': '4 غرف نوم',
            '5br': '5 غرف نوم',
            penthouse: 'بنتهاوس',
            duplex: 'دوبلكس',
            townhouse: 'تاون هاوس',
            villa: 'فيلا',
        },
        viewTypes: {
            sea: 'إطلالة على البحر',
            city: 'إطلالة على المدينة',
            garden: 'إطلالة على الحديقة',
            pool: 'إطلالة على المسبح',
            park: 'إطلالة على الحديقة العامة',
            marina: 'إطلالة على المرسى',
            golf: 'إطلالة على ملعب الجولف',
            other: 'أخرى',
        },
        unitStatus: {
            available: 'متاح',
            reserved: 'محجوز',
            sold: 'مباع',
            rented: 'مؤجر',
        },
    },
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
        size: 'Alan',
        viewDetails: 'Detayları Gör',
        with: 'ile',
        and: 've',
        bed: 'Yatak Oda',
        bath: 'Banyo',
        from: 'den itibaren',
        view: 'Manzara',
        floorPlan: 'Kat Planı',
        prospectus: 'Broşür',
        features: 'Özellikler',
        balcony: 'Balkon',
        parking: 'Otopark',
        spots: 'araç',
        sqm: 'sqm',
        noImagesAvailable: 'Görsel Mevcut Değil',
        byInvitationOnly: 'Sadece Davetle',
        forThoseWhoSeek: 'Sadece bir konut değil, daha fazlasını arayanlar için.',
        allRightsReserved: 'Tüm Hakları Saklıdır',
        developedWithPrecision: 'Hassasiyetle Geliştirildi',
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
        size: 'Size',
        viewDetails: 'View Details',
        with: 'with',
        and: 'and',
        bed: 'Bed',
        bath: 'Bath',
        from: 'From',
        view: 'View',
        floorPlan: 'Floor Plan',
        prospectus: 'Prospectus',
        features: 'Features',
        balcony: 'Balcony',
        parking: 'Parking',
        spots: 'spots',
        sqm: 'sqm',
        noImagesAvailable: 'No images available',
        byInvitationOnly: 'By Invitation Only',
        forThoseWhoSeek: 'For those who seek more than a residence.',
        allRightsReserved: 'All Rights Reserved',
        developedWithPrecision: 'Developed with Precision',
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
    const locale = (project.current_locale || 'tr') as 'tr' | 'en' | 'ar';
    const t = translations[locale];
    const isRTL = locale === 'ar';
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

            <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
                <Header projectName={project.name} onInquire={handleOpenInquiry} t={t} isRTL={isRTL} />

                <main>
                    <Hero
                        images={heroImages}
                        onInquire={handleOpenInquiry}
                        t={t}
                        isRTL={isRTL}
                    />
                    <Overview
                        project={project}
                        formatPrice={formatPrice}
                        getStatusLabel={getStatusLabel}
                        t={t}
                        isRTL={isRTL}
                    />
                    {galleryImages.length > 0 && (
                        <Gallery images={galleryImages} projectName={project.name} t={t} isRTL={isRTL} />
                    )}
                    {project.amenities && project.amenities.length > 0 && (
                        <Amenities amenities={project.amenities} t={t} isRTL={isRTL} />
                    )}
                    {project.units && project.units.length > 0 && (
                        <Units
                            units={project.units}
                            onSelectUnit={handleSelectUnit}
                            formatPrice={formatPrice}
                            getUnitTypeLabel={getUnitTypeLabel}
                            t={t}
                            isRTL={isRTL}
                        />
                    )}
                    <Location
                        location={project.location}
                        city={project.city}
                        t={t}
                        isRTL={isRTL}
                    />
                    <Contact onInquire={handleOpenInquiry} t={t} isRTL={isRTL} />
                </main>

                <Footer projectName={project.name} t={t} isRTL={isRTL} />

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
                    t={t}
                    isRTL={isRTL}
                />
            </div>
        </>
    );
}

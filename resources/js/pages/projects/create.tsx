import { index, store } from '@/actions/App/Http/Controllers/ProjectController';
import { type ImageFile } from '@/components/ui/image-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CheckIcon, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { AmenitiesStep } from './components/steps/AmenitiesStep';
import { BasicInfoStep } from './components/steps/BasicInfoStep';
import { DetailsStep } from './components/steps/DetailsStep';
import { ImagesStep } from './components/steps/ImagesStep';
import { LocationStep } from './components/steps/LocationStep';
import { PricingStep } from './components/steps/PricingStep';
import { ReviewStep } from './components/steps/ReviewStep';
import { UnitsStep } from './components/steps/UnitsStep';
import { type AmenityData, type ProjectFormData, type UnitData } from './types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: index().url,
    },
    {
        title: 'Create',
        href: '#',
    },
];

const steps = [
    { id: 1, name: 'Temel Bilgiler', description: 'Proje detayları' },
    { id: 2, name: 'Konum', description: 'Adres ve lokasyon' },
    { id: 3, name: 'Detaylar', description: 'Tip, garantiler & ödeme' },
    { id: 4, name: 'Fiyatlandırma', description: 'Fiyat aralığı ve durum' },
    { id: 5, name: 'Özellikler', description: 'Proje özellikleri' },
    { id: 6, name: 'Görseller', description: 'Hero ve galeri görselleri' },
    { id: 7, name: 'Üniteler', description: 'Projeye ünite ekle' },
    { id: 8, name: 'İnceleme', description: 'İncele ve gönder' },
];

export default function ProjectCreate() {
    const [currentStep, setCurrentStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [projectData, setProjectData] = useState<ProjectFormData>({
        name: '',
        public_name: '',
        description: '',
        overview: '',
        developer: '',
        construction_company: '',
        marketing_company: '',
        location: '',
        city: '',
        country: 'UAE',
        district: '',
        neighborhood: '',
        street: '',
        building_no: '',
        address_details: '',
        citizenship_eligibility: 'eligible',
        has_rental_guarantee: false,
        rental_guarantee_years: '',
        has_buyback_guarantee: false,
        buyback_value_loss_percentage: '',
        is_government_housing: false,
        has_title_deed: true,
        unit_type: '',
        project_type: '',
        view_type: '',
        payment_plan: 'cash',
        down_payment_amount: '',
        installment_months: '',
        vat_included: true,
        vat_rate: '',
        commission_included: false,
        commission_rate: '',
        min_price: '',
        max_price: '',
        currency: 'AED',
        status: 'planning',
        completion_date: '',
        delivery_status: '',
        total_units: 0,
        hero_title: '',
        hero_subtitle: '',
        overview_tr: '',
        overview_en: '',
        hero_title_tr: '',
        hero_title_en: '',
        hero_subtitle_tr: '',
        hero_subtitle_en: '',
        is_featured: false,
        is_active: true,
    });

    const [units, setUnits] = useState<UnitData[]>([]);
    const [amenities, setAmenities] = useState<AmenityData[]>([]);
    const [heroImages, setHeroImages] = useState<ImageFile[]>([]);
    const [galleryImages, setGalleryImages] = useState<ImageFile[]>([]);

    const updateProjectData = (field: string, value: string | number | boolean) => {
        setProjectData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        setProcessing(true);
        setErrors({});

        const formData = new FormData();

        // Add project data
        Object.entries(projectData).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (typeof value === 'boolean') {
                    formData.append(key, value ? '1' : '0');
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        formData.append('total_units', units.length.toString());

        // Add amenities as JSON
        if (amenities.length > 0) {
            const amenitiesData = amenities.map(({ id, ...amenity }) => amenity);
            formData.append('project_amenities', JSON.stringify(amenitiesData));
        }

        // Add units as JSON
        if (units.length > 0) {
            const unitsData = units.map(({ id, ...unit }) => unit);
            formData.append('units', JSON.stringify(unitsData));
        }

        // Add hero images
        heroImages.forEach((image, index) => {
            if (image.file) {
                formData.append(`hero_images[${index}]`, image.file);
            }
        });

        // Add gallery images
        galleryImages.forEach((image, index) => {
            if (image.file) {
                formData.append(`gallery_images[${index}]`, image.file);
            }
        });

        console.log('Submitting project with data:', {
            projectData,
            units: units.length,
            amenities: amenities.length,
            heroImages: heroImages.length,
            galleryImages: galleryImages.length,
        });

        router.post(store().url, formData, {
            forceFormData: true,
            onError: (errors) => {
                console.error('Project creation errors:', errors);
                setErrors(errors);
                setProcessing(false);
                // Scroll to top to show errors
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onSuccess: () => {
                console.log('Project created successfully');
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return projectData.name && projectData.developer;
            case 2:
                return projectData.location && projectData.city;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                return true;
            default:
                return false;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Proje Oluştur" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Yeni Proje Oluştur</h1>

                {/* Error Display */}
                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Hata</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc list-inside">
                                {Object.entries(errors).map(([key, value]) => (
                                    <li key={key}>
                                        {key}: {value}
                                    </li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Step Indicator */}
                <nav aria-label="Progress">
                    <ol className="flex items-center">
                        {steps.map((step, stepIdx) => (
                            <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                                        className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                                            step.id < currentStep
                                                ? 'bg-primary text-primary-foreground cursor-pointer'
                                                : step.id === currentStep
                                                  ? 'border-2 border-primary bg-background'
                                                  : 'border-2 border-muted bg-background'
                                        }`}
                                    >
                                        {step.id < currentStep ? (
                                            <CheckIcon className="h-4 w-4" />
                                        ) : (
                                            <span className={step.id === currentStep ? 'text-primary' : 'text-muted-foreground'}>
                                                {step.id}
                                            </span>
                                        )}
                                    </button>
                                    {stepIdx !== steps.length - 1 && (
                                        <div
                                            className={`h-0.5 w-full ${
                                                step.id < currentStep ? 'bg-primary' : 'bg-muted'
                                            }`}
                                        />
                                    )}
                                </div>
                                <div className="mt-2 hidden md:block">
                                    <span className={`text-xs font-medium ${step.id === currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {step.name}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>

                <Card>
                    <CardHeader>
                        <CardTitle>{steps[currentStep - 1].name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {currentStep === 1 && (
                            <BasicInfoStep
                                projectData={projectData}
                                updateProjectData={updateProjectData}
                                errors={errors}
                            />
                        )}

                        {currentStep === 2 && (
                            <LocationStep
                                projectData={projectData}
                                updateProjectData={updateProjectData}
                                errors={errors}
                            />
                        )}

                        {currentStep === 3 && (
                            <DetailsStep
                                projectData={projectData}
                                updateProjectData={updateProjectData}
                                errors={errors}
                            />
                        )}

                        {currentStep === 4 && (
                            <PricingStep
                                projectData={projectData}
                                updateProjectData={updateProjectData}
                                errors={errors}
                            />
                        )}

                        {currentStep === 5 && (
                            <AmenitiesStep
                                amenities={amenities}
                                setAmenities={setAmenities}
                                errors={errors}
                            />
                        )}

                        {currentStep === 6 && (
                            <ImagesStep
                                heroImages={heroImages}
                                setHeroImages={setHeroImages}
                                galleryImages={galleryImages}
                                setGalleryImages={setGalleryImages}
                                errors={errors}
                            />
                        )}

                        {currentStep === 7 && (
                            <UnitsStep
                                units={units}
                                setUnits={setUnits}
                                currency={projectData.currency}
                            />
                        )}

                        {currentStep === 8 && (
                            <ReviewStep
                                projectData={projectData}
                                units={units}
                                amenities={amenities}
                            />
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-8 flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : history.back()}
                            >
                                {currentStep === 1 ? 'İptal' : 'Önceki'}
                            </Button>
                            <div className="flex gap-2">
                                {currentStep < 8 && (
                                    <Button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep + 1)}
                                        disabled={!canProceed()}
                                    >
                                        Sonraki
                                    </Button>
                                )}
                                {currentStep === 8 && (
                                    <Button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={processing}
                                    >
                                        {processing ? 'Oluşturuluyor...' : 'Projeyi Oluştur'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

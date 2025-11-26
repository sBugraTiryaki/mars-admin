import { index } from '@/actions/App/Http/Controllers/ProjectController';
import { type ImageFile } from '@/components/ui/image-upload';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Project } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, CheckIcon, Clock4Icon, SaveIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AmenitiesStep } from './components/steps/AmenitiesStep';
import { BasicInfoStep } from './components/steps/BasicInfoStep';
import { DetailsStep } from './components/steps/DetailsStep';
import { ImagesStep } from './components/steps/ImagesStep';
import { LocationStep } from './components/steps/LocationStep';
import { PricingStep } from './components/steps/PricingStep';
import { ReviewStep } from './components/steps/ReviewStep';
import { UnitsStep } from './components/steps/UnitsStep';
import { type AmenityData, type ProjectFormData, type UnitData } from './types';

type DraftPayload = Project & {
    public_name?: string;
    overview?: string;
    construction_company?: string;
    marketing_company?: string;
    district?: string;
    neighborhood?: string;
    street?: string;
    building_no?: string;
    address_details?: string;
    citizenship_eligibility?: string;
    has_rental_guarantee?: boolean;
    rental_guarantee_years?: number;
    has_buyback_guarantee?: boolean;
    buyback_value_loss_percentage?: number;
    is_government_housing?: boolean;
    has_title_deed?: boolean;
    unit_type?: string;
    project_type?: string;
    view_type?: string;
    payment_plan?: string;
    down_payment_amount?: number;
    installment_months?: number;
    vat_included?: boolean;
    vat_rate?: number;
    commission_included?: boolean;
    commission_rate?: number;
    delivery_status?: string;
    hero_title?: string;
    hero_subtitle?: string;
    project_amenities?: AmenityData[];
    units?: Array<UnitData & { id: number }>;
    translations?: Array<{ locale: string; overview?: string; hero_title?: string; hero_subtitle?: string }>;
    draft_hero_images?: string[];
    draft_gallery_images?: string[];
};

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
    { id: 8, name: 'İnceleme', description: 'İncele ve yayınla' },
];

interface Props {
    draft?: DraftPayload | null;
}

const defaultProjectData: ProjectFormData = {
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
    overview_ar: '',
    hero_title_tr: '',
    hero_title_en: '',
    hero_title_ar: '',
    hero_subtitle_tr: '',
    hero_subtitle_en: '',
    hero_subtitle_ar: '',
    is_featured: false,
    is_active: true,
};

const uid = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function hydrateProjectData(draft?: DraftPayload | null): ProjectFormData {
    if (!draft) return defaultProjectData;

    const getTranslation = (locale: string, field: string) =>
        draft.translations?.find((t) => t.locale === locale)?.[field as keyof typeof draft.translations[number]] ?? '';

    return {
        ...defaultProjectData,
        name: draft.name ?? '',
        public_name: draft.public_name ?? '',
        description: draft.description ?? '',
        overview: draft.overview ?? '',
        developer: draft.developer ?? '',
        construction_company: draft.construction_company ?? '',
        marketing_company: draft.marketing_company ?? '',
        location: draft.location ?? '',
        city: draft.city ?? '',
        country: draft.country ?? 'UAE',
        district: draft.district ?? '',
        neighborhood: draft.neighborhood ?? '',
        street: draft.street ?? '',
        building_no: draft.building_no ?? '',
        address_details: draft.address_details ?? '',
        citizenship_eligibility: (draft.citizenship_eligibility as ProjectFormData['citizenship_eligibility']) ?? 'eligible',
        has_rental_guarantee: Boolean(draft.has_rental_guarantee),
        rental_guarantee_years: draft.rental_guarantee_years?.toString() ?? '',
        has_buyback_guarantee: Boolean(draft.has_buyback_guarantee),
        buyback_value_loss_percentage: draft.buyback_value_loss_percentage?.toString() ?? '',
        is_government_housing: Boolean(draft.is_government_housing),
        has_title_deed: Boolean(draft.has_title_deed ?? true),
        unit_type: draft.unit_type ?? '',
        project_type: draft.project_type ?? '',
        view_type: draft.view_type ?? '',
        payment_plan: (draft.payment_plan as ProjectFormData['payment_plan']) ?? 'cash',
        down_payment_amount: draft.down_payment_amount?.toString() ?? '',
        installment_months: draft.installment_months?.toString() ?? '',
        vat_included: Boolean(draft.vat_included ?? true),
        vat_rate: draft.vat_rate?.toString() ?? '',
        commission_included: Boolean(draft.commission_included),
        commission_rate: draft.commission_rate?.toString() ?? '',
        min_price: draft.min_price?.toString() ?? '',
        max_price: draft.max_price?.toString() ?? '',
        currency: draft.currency ?? 'AED',
        status: draft.status ?? 'planning',
        completion_date: draft.completion_date ?? '',
        delivery_status: draft.delivery_status ?? '',
        total_units: draft.total_units ?? 0,
        hero_title: draft.hero_title ?? '',
        hero_subtitle: draft.hero_subtitle ?? '',
        overview_tr: (getTranslation('tr', 'overview') as string) ?? '',
        overview_en: (getTranslation('en', 'overview') as string) ?? '',
        overview_ar: (getTranslation('ar', 'overview') as string) ?? '',
        hero_title_tr: (getTranslation('tr', 'hero_title') as string) ?? '',
        hero_title_en: (getTranslation('en', 'hero_title') as string) ?? '',
        hero_title_ar: (getTranslation('ar', 'hero_title') as string) ?? '',
        hero_subtitle_tr: (getTranslation('tr', 'hero_subtitle') as string) ?? '',
        hero_subtitle_en: (getTranslation('en', 'hero_subtitle') as string) ?? '',
        hero_subtitle_ar: (getTranslation('ar', 'hero_subtitle') as string) ?? '',
        is_featured: Boolean(draft.is_featured),
        is_active: Boolean(draft.is_active ?? true),
    };
}

function hydrateUnits(draft?: DraftPayload | null): UnitData[] {
    if (!draft?.units) return [];

    return draft.units.map((unit) => {
        const unitWithSize = unit as typeof unit & { min_size_sqm?: number; max_size_sqm?: number };
        return {
            id: unit.id ? unit.id.toString() : uid(),
            unit_number: unit.unit_number ?? '',
            type: unit.type ?? '1br',
            floor: unit.floor?.toString() ?? '',
            size_sqft: unit.size_sqft?.toString() ?? '',
            min_size_sqm: unitWithSize.min_size_sqm?.toString() ?? '',
            max_size_sqm: unitWithSize.max_size_sqm?.toString() ?? '',
            bedrooms: unit.bedrooms ?? 0,
            bathrooms: unit.bathrooms ?? 1,
            price: unit.price?.toString() ?? '',
            min_price: unit.min_price?.toString() ?? '',
            max_price: unit.max_price?.toString() ?? '',
            status: unit.status ?? 'available',
            view: unit.view ?? '',
            has_balcony: Boolean(unit.has_balcony),
            has_parking: Boolean(unit.has_parking),
        };
    });
}

function hydrateAmenities(draft?: DraftPayload | null): AmenityData[] {
    if (!draft?.project_amenities) return [];

    return draft.project_amenities.map((amenity) => ({
        id: amenity.id?.toString?.() ?? uid(),
        key: amenity.key ?? '',
        value: amenity.value ?? '',
        order: amenity.order ?? 0,
    }));
}

function hydrateImages(urls?: string[]): ImageFile[] {
    if (!urls?.length) return [];

    return urls.map((url, index) => ({
        id: `${index}-${uid()}`,
        url,
        name: 'Mevcut Görsel',
    }));
}

function formatRelativeTime(date?: Date | null): string {
    if (!date) return '';
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'az önce';
    if (minutes < 60) return `${minutes} dakika önce`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
}

export default function ProjectCreate({ draft }: Props) {
    const page = usePage();
    const [currentStep, setCurrentStep] = useState(draft?.current_step ?? 1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [draftId, setDraftId] = useState<number | null>(draft?.id ?? null);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [autoSaveState, setAutoSaveState] = useState<'idle' | 'saving' | 'saved' | 'unsaved'>(draftId ? 'saved' : 'unsaved');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(draft ? new Date(draft.updated_at) : null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const previousStepRef = useRef(currentStep);

    const [projectData, setProjectData] = useState<ProjectFormData>(() => hydrateProjectData(draft));
    const [units, setUnits] = useState<UnitData[]>(() => hydrateUnits(draft));
    const [amenities, setAmenities] = useState<AmenityData[]>(() => hydrateAmenities(draft));
    const [heroImages, setHeroImages] = useState<ImageFile[]>(() => hydrateImages(draft?.draft_hero_images));
    const [galleryImages, setGalleryImages] = useState<ImageFile[]>(() => hydrateImages(draft?.draft_gallery_images));

    const markUnsaved = () => {
        setAutoSaveState('unsaved');
        setHasUnsavedChanges(true);
        setSaveError(null);
    };

    const updateProjectData = (field: string, value: string | number | boolean) => {
        setProjectData((prev) => ({ ...prev, [field]: value }));
        markUnsaved();
    };

    const handleUnitsChange = (nextUnits: UnitData[]) => {
        setUnits(nextUnits);
        markUnsaved();
    };

    const handleAmenitiesChange = (nextAmenities: AmenityData[]) => {
        setAmenities(nextAmenities);
        markUnsaved();
    };

    const handleHeroImagesChange = (next: ImageFile[]) => {
        setHeroImages(next);
        markUnsaved();
    };

    const handleGalleryImagesChange = (next: ImageFile[]) => {
        setGalleryImages(next);
        markUnsaved();
    };

    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges && !draftId) {
                e.preventDefault();
                e.returnValue = 'Kaydedilmemiş değişiklikler var.';
            }
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [hasUnsavedChanges, draftId]);

    useEffect(() => {
        if (!draftId) return;
        if (previousStepRef.current !== currentStep) {
            previousStepRef.current = currentStep;
            void handleAutoSave();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep, draftId]);

    const buildFormData = (method: 'POST' | 'PUT' = 'POST', stayOnPage = false) => {
        const formData = new FormData();

        if (method === 'PUT') {
            formData.append('_method', 'PUT');
        }

        formData.append('current_step', currentStep.toString());

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

        if (amenities.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const amenitiesData = amenities.map(({ id, ...amenity }) => amenity);
            formData.append('project_amenities', JSON.stringify(amenitiesData));
        }

        if (units.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const unitsData = units.map(({ id, ...unit }) => unit);
            formData.append('units', JSON.stringify(unitsData));
        }

        const existingHero = heroImages.filter((img) => !img.file).map((img) => img.url);
        const existingGallery = galleryImages.filter((img) => !img.file).map((img) => img.url);

        existingHero.forEach((url) => formData.append('existing_draft_hero_images[]', url));
        existingGallery.forEach((url) => formData.append('existing_draft_gallery_images[]', url));

        heroImages.forEach((image, index) => {
            if (image.file) {
                formData.append(`hero_images[${index}]`, image.file);
            }
        });

        galleryImages.forEach((image, index) => {
            if (image.file) {
                formData.append(`gallery_images[${index}]`, image.file);
            }
        });

        if (stayOnPage) {
            formData.append('stay_on_page', '1');
        }

        return formData;
    };

    const saveDraftRequest = async (stayOnPage: boolean) => {
        if (isSavingDraft) return;
        setIsSavingDraft(true);
        setAutoSaveState('saving');
        setSaveError(null);

        const isUpdate = Boolean(draftId);
        const url = isUpdate ? `/projects/drafts/${draftId}` : '/projects/drafts';
        const formData = buildFormData(isUpdate ? 'PUT' : 'POST', stayOnPage);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                body: formData,
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                const validationErrors: Record<string, string> = {};
                Object.entries(payload?.errors ?? {}).forEach(([key, value]) => {
                    validationErrors[key] = Array.isArray(value) ? value.join(' ') : String(value);
                });
                setErrors(validationErrors);
                setAutoSaveState('unsaved');
                setSaveError(payload?.message ?? 'Taslak kaydedilemedi.');
                return null;
            }

            setErrors({});
            setDraftId(payload?.draft?.id ? Number(payload.draft.id) : draftId);
            setAutoSaveState('saved');
            setHasUnsavedChanges(false);
            setLastSavedAt(payload?.draft?.updated_at ? new Date(payload.draft.updated_at) : new Date());

            return payload?.draft?.id ?? draftId;
        } catch {
            setSaveError('Taslak kaydedilirken bir hata oluştu.');
            setAutoSaveState('unsaved');
            return null;
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handleAutoSave = async () => {
        if (!draftId) return;
        await saveDraftRequest(true);
    };

    const handleManualSave = async () => {
        setErrors({});
        setSaveError(null);
        setIsSavingDraft(true);

        // New draft -> follow spec: redirect to /projects after save
        if (!draftId) {
            const formData = buildFormData('POST', false);
            router.post('/projects/drafts', formData, {
                forceFormData: true,
                onError: (incomingErrors) => {
                    const formatted: Record<string, string> = {};
                    Object.entries(incomingErrors).forEach(([key, value]) => {
                        formatted[key] = Array.isArray(value) ? value.join(' ') : String(value);
                    });
                    setErrors(formatted);
                },
                onFinish: () => setIsSavingDraft(false),
            });
            return;
        }

        // Existing draft -> stay on page
        await saveDraftRequest(true);
    };

    const ensureDraftExists = async (): Promise<number | null> => {
        if (draftId) return draftId;
        return await saveDraftRequest(true);
    };

    const handlePublish = async () => {
        setProcessing(true);
        setErrors({});
        setSaveError(null);

        const ensuredDraftId = await ensureDraftExists();
        if (!ensuredDraftId) {
            setProcessing(false);
            return;
        }

        const formData = buildFormData('POST', false);

        router.post(`/projects/drafts/${ensuredDraftId}/publish`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onError: (incomingErrors) => {
                const formatted: Record<string, string> = {};
                Object.entries(incomingErrors).forEach(([key, value]) => {
                    formatted[key] = Array.isArray(value) ? value.join(' ') : String(value);
                });
                setErrors(formatted);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
                setHasUnsavedChanges(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const canProceed = useMemo(() => {
        switch (currentStep) {
            case 1:
                return projectData.name && projectData.developer;
            case 2:
                return projectData.location && projectData.city;
            default:
                return true;
        }
    }, [currentStep, projectData.city, projectData.developer, projectData.location, projectData.name]);

    const autoSaveLabel = useMemo(() => {
        switch (autoSaveState) {
            case 'saving':
                return 'Kaydediliyor...';
            case 'saved':
                return lastSavedAt ? `Kaydedildi • ${formatRelativeTime(lastSavedAt)}` : 'Kaydedildi';
            case 'unsaved':
                return 'Kaydedilmemiş değişiklikler';
            default:
                return '';
        }
    }, [autoSaveState, lastSavedAt]);

    const flashSuccess = (page.props as { flash?: { success?: string } })?.flash?.success;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={draftId ? 'Taslak Düzenle' : 'Proje Oluştur'} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{draftId ? 'Proje Taslağı' : 'Yeni Proje Oluştur'}</h1>
                        {draftId && (
                            <p className="text-sm text-muted-foreground">
                                Taslak modunda çalışıyorsunuz. Taslağınızı kaydedip daha sonra yayınlayabilirsiniz.
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm">
                            {autoSaveState === 'saving' && <Clock4Icon className="h-4 w-4 text-muted-foreground" />}
                            {autoSaveState === 'saved' && <CheckIcon className="h-4 w-4 text-green-600" />}
                            {autoSaveState === 'unsaved' && <AlertCircle className="h-4 w-4 text-amber-600" />}
                            <span className="text-muted-foreground">{autoSaveLabel}</span>
                        </div>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleManualSave}
                            disabled={isSavingDraft}
                        >
                            <SaveIcon className="mr-2 h-4 w-4" />
                            {draftId ? 'Kaydet' : 'Taslak Olarak Kaydet'}
                        </Button>
                    </div>
                </div>

                {flashSuccess && (
                    <Alert>
                        <CheckIcon className="h-4 w-4" />
                        <AlertTitle>Başarılı</AlertTitle>
                        <AlertDescription>{flashSuccess}</AlertDescription>
                    </Alert>
                )}

                {saveError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Kaydetme Hatası</AlertTitle>
                        <AlertDescription>{saveError}</AlertDescription>
                    </Alert>
                )}

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

                <div className="flex items-center gap-3">
                    <Badge variant="outline">{draftId ? `Taslak #${draftId}` : 'Yeni Taslak'}</Badge>
                    <Badge variant="secondary">{currentStep}/8</Badge>
                </div>

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
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
                        </div>
                        {draftId && (
                            <Badge variant="secondary">Taslak Modu</Badge>
                        )}
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
                                setAmenities={handleAmenitiesChange}
                                errors={errors}
                            />
                        )}

                        {currentStep === 6 && (
                            <ImagesStep
                                heroImages={heroImages}
                                setHeroImages={handleHeroImagesChange}
                                galleryImages={galleryImages}
                                setGalleryImages={handleGalleryImagesChange}
                                errors={errors}
                            />
                        )}

                        {currentStep === 7 && (
                            <UnitsStep
                                units={units}
                                setUnits={handleUnitsChange}
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
                                        disabled={!canProceed}
                                    >
                                        Sonraki
                                    </Button>
                                )}
                                {currentStep === 8 && (
                                    <Button
                                        type="button"
                                        onClick={handlePublish}
                                        disabled={processing}
                                    >
                                        {processing ? 'Yayınlanıyor...' : 'Projeyi Yayınla'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>Otomatik kayıt: Adım değişiminde, mevcut taslaklarda devreye girer.</span>
                    <span>Durum: {autoSaveLabel || 'Hazır'}</span>
                </div>
            </div>
        </AppLayout>
    );
}

import { index, store } from '@/actions/App/Http/Controllers/ProjectController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload, type ImageFile } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CheckIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

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

interface UnitData {
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

interface AmenityData {
    id: string;
    key: string;
    value: string;
    order: number;
}

const steps = [
    { id: 1, name: 'Basic Info', description: 'Project details' },
    { id: 2, name: 'Location', description: 'Address and location' },
    { id: 3, name: 'Details', description: 'Type, guarantees & payment' },
    { id: 4, name: 'Pricing', description: 'Price range and status' },
    { id: 5, name: 'Amenities', description: 'Project amenities' },
    { id: 6, name: 'Images', description: 'Hero and gallery images' },
    { id: 7, name: 'Units', description: 'Add units to project' },
    { id: 8, name: 'Review', description: 'Review and submit' },
];

export default function ProjectCreate() {
    const [currentStep, setCurrentStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        developer: '',
        location: '',
        city: '',
        country: 'UAE',
        min_price: '',
        max_price: '',
        currency: 'AED',
        status: 'planning',
        completion_date: '',
        total_units: 0,
        is_featured: false,
        is_active: true,
    });

    const [units, setUnits] = useState<UnitData[]>([]);

    const [heroImages, setHeroImages] = useState<ImageFile[]>([]);
    const [galleryImages, setGalleryImages] = useState<ImageFile[]>([]);

    const [newUnit, setNewUnit] = useState<UnitData>({
        id: '',
        unit_number: '',
        type: '1br',
        floor: '',
        size_sqft: '',
        bedrooms: 1,
        bathrooms: 1,
        price: '',
        status: 'available',
        view: '',
        has_balcony: false,
        has_parking: false,
    });

    const updateProjectData = (field: string, value: string | number | boolean) => {
        setProjectData((prev) => ({ ...prev, [field]: value }));
    };

    const addUnit = () => {
        if (!newUnit.unit_number || !newUnit.size_sqft || !newUnit.price) {
            return;
        }

        setUnits((prev) => [
            ...prev,
            { ...newUnit, id: Date.now().toString() },
        ]);

        setNewUnit({
            id: '',
            unit_number: '',
            type: '1br',
            floor: '',
            size_sqft: '',
            bedrooms: 1,
            bathrooms: 1,
            price: '',
            status: 'available',
            view: '',
            has_balcony: false,
            has_parking: false,
        });
    };

    const removeUnit = (id: string) => {
        setUnits((prev) => prev.filter((u) => u.id !== id));
    };

    const handleSubmit = () => {
        console.log('=== Form Submission Started ===');
        console.log('Project Data:', projectData);
        console.log('Units:', units);
        console.log('Hero Images:', heroImages);
        console.log('Gallery Images:', galleryImages);

        setProcessing(true);
        setErrors({});

        const formData = new FormData();

        // Add project data
        Object.entries(projectData).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                // Convert boolean values to 1/0 for Laravel
                if (typeof value === 'boolean') {
                    formData.append(key, value ? '1' : '0');
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        formData.append('total_units', units.length.toString());

        // Add units as JSON
        if (units.length > 0) {
            const unitsData = units.map(({ id, ...unit }) => unit);
            console.log('Units being sent:', unitsData);
            formData.append('units', JSON.stringify(unitsData));
        }

        // Add hero images
        heroImages.forEach((image, index) => {
            if (image.file) {
                console.log(`Adding hero image ${index}:`, image.file.name);
                formData.append(`hero_images[${index}]`, image.file);
            }
        });

        // Add gallery images
        galleryImages.forEach((image, index) => {
            if (image.file) {
                console.log(`Adding gallery image ${index}:`, image.file.name);
                formData.append(`gallery_images[${index}]`, image.file);
            }
        });

        console.log('Submitting to:', store().url);
        console.log('FormData entries:');
        for (const [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }

        router.post(store().url, formData, {
            forceFormData: true,
            onError: (errors) => {
                console.error('=== Form Submission Error ===');
                console.error('Errors:', errors);
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                console.log('=== Form Submission Success ===');
                setProcessing(false);
            },
            onFinish: () => {
                console.log('=== Form Submission Finished ===');
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
                return true;
            case 4:
                return true;
            case 5:
                return true;
            case 6:
                return true;
            default:
                return false;
        }
    };

    const formatPrice = (price: string, currency: string) => {
        if (!price) return '-';
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Create Project</h1>

                {/* Step Indicator */}
                <nav aria-label="Progress">
                    <ol className="flex items-center">
                        {steps.map((step, stepIdx) => (
                            <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                                <div className="flex items-center">
                                    <button
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
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Project Name *</Label>
                                        <Input
                                            id="name"
                                            value={projectData.name}
                                            onChange={(e) => updateProjectData('name', e.target.value)}
                                            placeholder="e.g., Marina Heights Tower"
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="developer">Developer *</Label>
                                        <Input
                                            id="developer"
                                            value={projectData.developer}
                                            onChange={(e) => updateProjectData('developer', e.target.value)}
                                            placeholder="e.g., Emaar Properties"
                                            required
                                        />
                                        <InputError message={errors.developer} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        className="min-h-[120px]"
                                        value={projectData.description}
                                        onChange={(e) => updateProjectData('description', e.target.value)}
                                        placeholder="Describe the project features, amenities, and unique selling points..."
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Location */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location/Area *</Label>
                                        <Input
                                            id="location"
                                            value={projectData.location}
                                            onChange={(e) => updateProjectData('location', e.target.value)}
                                            placeholder="e.g., Dubai Marina"
                                            required
                                        />
                                        <InputError message={errors.location} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            value={projectData.city}
                                            onChange={(e) => updateProjectData('city', e.target.value)}
                                            placeholder="e.g., Dubai"
                                            required
                                        />
                                        <InputError message={errors.city} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={projectData.country}
                                        onChange={(e) => updateProjectData('country', e.target.value)}
                                    />
                                    <InputError message={errors.country} />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Pricing & Status */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="min_price">Min Price</Label>
                                        <Input
                                            id="min_price"
                                            type="number"
                                            value={projectData.min_price}
                                            onChange={(e) => updateProjectData('min_price', e.target.value)}
                                            placeholder="500000"
                                        />
                                        <InputError message={errors.min_price} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="max_price">Max Price</Label>
                                        <Input
                                            id="max_price"
                                            type="number"
                                            value={projectData.max_price}
                                            onChange={(e) => updateProjectData('max_price', e.target.value)}
                                            placeholder="5000000"
                                        />
                                        <InputError message={errors.max_price} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select
                                            value={projectData.currency}
                                            onValueChange={(value) => updateProjectData('currency', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AED">AED</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Project Status</Label>
                                        <Select
                                            value={projectData.status}
                                            onValueChange={(value) => updateProjectData('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="planning">Planning</SelectItem>
                                                <SelectItem value="under_construction">Under Construction</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="sold_out">Sold Out</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="completion_date">Expected Completion</Label>
                                        <Input
                                            id="completion_date"
                                            type="date"
                                            value={projectData.completion_date}
                                            onChange={(e) => updateProjectData('completion_date', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_featured"
                                            checked={projectData.is_featured}
                                            onCheckedChange={(checked) => updateProjectData('is_featured', checked as boolean)}
                                        />
                                        <Label htmlFor="is_featured">Featured Project</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={projectData.is_active}
                                            onCheckedChange={(checked) => updateProjectData('is_active', checked as boolean)}
                                        />
                                        <Label htmlFor="is_active">Active</Label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Images */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div>
                                    <ImageUpload
                                        value={heroImages}
                                        onChange={setHeroImages}
                                        maxFiles={5}
                                        label="Hero Images"
                                        description="These images will be displayed in the hero slider on the public project page. Drag to reorder."
                                        error={errors.hero_images}
                                    />
                                </div>
                                <Separator />
                                <div>
                                    <ImageUpload
                                        value={galleryImages}
                                        onChange={setGalleryImages}
                                        maxFiles={20}
                                        label="Gallery Images"
                                        description="These images will be displayed in the gallery section. Drag to reorder."
                                        error={errors.gallery_images}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 5: Units */}
                        {currentStep === 5 && (
                            <div className="space-y-6">
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-4 font-medium">Add Unit</h3>
                                    <div className="grid gap-4 md:grid-cols-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="unit_number">Unit Number *</Label>
                                            <Input
                                                id="unit_number"
                                                value={newUnit.unit_number}
                                                onChange={(e) => setNewUnit({ ...newUnit, unit_number: e.target.value })}
                                                placeholder="A-101"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Type</Label>
                                            <Select
                                                value={newUnit.type}
                                                onValueChange={(value) => setNewUnit({ ...newUnit, type: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="studio">Studio</SelectItem>
                                                    <SelectItem value="1br">1 BR</SelectItem>
                                                    <SelectItem value="2br">2 BR</SelectItem>
                                                    <SelectItem value="3br">3 BR</SelectItem>
                                                    <SelectItem value="4br">4 BR</SelectItem>
                                                    <SelectItem value="5br">5 BR</SelectItem>
                                                    <SelectItem value="penthouse">Penthouse</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="floor">Floor</Label>
                                            <Input
                                                id="floor"
                                                type="number"
                                                value={newUnit.floor}
                                                onChange={(e) => setNewUnit({ ...newUnit, floor: e.target.value })}
                                                placeholder="10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="size_sqft">Size (sqft) *</Label>
                                            <Input
                                                id="size_sqft"
                                                type="number"
                                                value={newUnit.size_sqft}
                                                onChange={(e) => setNewUnit({ ...newUnit, size_sqft: e.target.value })}
                                                placeholder="1200"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 grid gap-4 md:grid-cols-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bedrooms">Bedrooms</Label>
                                            <Input
                                                id="bedrooms"
                                                type="number"
                                                value={newUnit.bedrooms}
                                                onChange={(e) => setNewUnit({ ...newUnit, bedrooms: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bathrooms">Bathrooms</Label>
                                            <Input
                                                id="bathrooms"
                                                type="number"
                                                value={newUnit.bathrooms}
                                                onChange={(e) => setNewUnit({ ...newUnit, bathrooms: parseInt(e.target.value) || 1 })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price *</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={newUnit.price}
                                                onChange={(e) => setNewUnit({ ...newUnit, price: e.target.value })}
                                                placeholder="1500000"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <Button type="button" onClick={addUnit} className="w-full">
                                                <PlusIcon className="mr-2 h-4 w-4" />
                                                Add Unit
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {units.length > 0 && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="mb-4 font-medium">Added Units ({units.length})</h3>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Unit</TableHead>
                                                        <TableHead>Type</TableHead>
                                                        <TableHead>Floor</TableHead>
                                                        <TableHead>Size</TableHead>
                                                        <TableHead>Price</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {units.map((unit) => (
                                                        <TableRow key={unit.id}>
                                                            <TableCell className="font-medium">{unit.unit_number}</TableCell>
                                                            <TableCell className="uppercase">{unit.type}</TableCell>
                                                            <TableCell>{unit.floor || '-'}</TableCell>
                                                            <TableCell>{unit.size_sqft} sqft</TableCell>
                                                            <TableCell>{formatPrice(unit.price, projectData.currency)}</TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => removeUnit(unit.id)}
                                                                >
                                                                    <TrashIcon className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Step 6: Review */}
                        {currentStep === 6 && (
                            <div className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Project Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Name:</span>
                                                <span className="font-medium">{projectData.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Developer:</span>
                                                <span>{projectData.developer}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Location:</span>
                                                <span>{projectData.location}, {projectData.city}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Status:</span>
                                                <Badge variant="outline" className="capitalize">
                                                    {projectData.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Pricing & Units</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Price Range:</span>
                                                <span>
                                                    {formatPrice(projectData.min_price, projectData.currency)} -{' '}
                                                    {formatPrice(projectData.max_price, projectData.currency)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Total Units:</span>
                                                <span className="font-medium">{units.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Featured:</span>
                                                <span>{projectData.is_featured ? 'Yes' : 'No'}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {units.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Units Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {units.map((unit) => (
                                                    <Badge key={unit.id} variant="secondary">
                                                        {unit.unit_number} - {unit.type.toUpperCase()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-8 flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : history.back()}
                            >
                                {currentStep === 1 ? 'Cancel' : 'Previous'}
                            </Button>
                            <div className="flex gap-2">
                                {currentStep < 6 && (
                                    <Button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep + 1)}
                                        disabled={!canProceed()}
                                    >
                                        Next
                                    </Button>
                                )}
                                {currentStep === 6 && (
                                    <Button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Project'}
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

import { index, update } from '@/actions/App/Http/Controllers/ProjectController';
import ImageLightbox from '@/components/image-lightbox';
import InputError from '@/components/input-error';
import UnitFormDialog from '@/components/unit-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { type BreadcrumbItem, type Project } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon, ExternalLinkIcon, XIcon, CheckIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
    project: Project & {
        hero_images?: string[];
        gallery_images?: string[];
    };
}

const statusColors = {
    planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    under_construction: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    sold_out: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const statusLabels = {
    planning: 'Planning',
    under_construction: 'Under Construction',
    completed: 'Completed',
    sold_out: 'Sold Out',
};

interface UnitFormData {
    id?: number;
    unit_number: string;
    type: string;
    floor: string;
    size_sqft: string;
    bedrooms: number;
    bathrooms: number;
    price: string;
    status: string;
    view: string;
    has_balcony: boolean;
    has_parking: boolean;
}

export default function ProjectShow({ project }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [editingUnitId, setEditingUnitId] = useState<number | null>(null);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [isDraggingHero, setIsDraggingHero] = useState(false);
    const [isDraggingGallery, setIsDraggingGallery] = useState(false);
    const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const [formData, setFormData] = useState({
        name: project.name,
        description: project.description || '',
        developer: project.developer || '',
        location: project.location,
        city: project.city,
        country: project.country,
        min_price: project.min_price || '',
        max_price: project.max_price || '',
        currency: project.currency,
        status: project.status,
        completion_date: project.completion_date || '',
        is_featured: project.is_featured,
        is_active: project.is_active,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projects',
            href: index().url,
        },
        {
            title: project.name,
            href: '#',
        },
    ];

    const updateField = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log('=== Update Project Started ===');
        console.log('Form Data:', formData);

        setProcessing(true);
        setErrors({});

        // Convert boolean values to 1/0 for Laravel
        const submissionData = {
            ...formData,
            is_featured: formData.is_featured ? 1 : 0,
            is_active: formData.is_active ? 1 : 0,
        };

        console.log('Submitting:', submissionData);

        router.put(update(project.id).url, submissionData, {
            onError: (errors) => {
                console.error('=== Update Error ===');
                console.error('Errors:', errors);
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                console.log('=== Update Success ===');
                setProcessing(false);
                setIsEditing(false);
            },
        });
    };

    const handleCancel = () => {
        setFormData({
            name: project.name,
            description: project.description || '',
            developer: project.developer || '',
            location: project.location,
            city: project.city,
            country: project.country,
            min_price: project.min_price || '',
            max_price: project.max_price || '',
            currency: project.currency,
            status: project.status,
            completion_date: project.completion_date || '',
            is_featured: project.is_featured,
            is_active: project.is_active,
        });
        setIsEditing(false);
        setErrors({});
    };

    const formatPrice = (price: string | null, currency: string) => {
        if (!price) return '-';
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    const uploadFiles = (files: FileList | File[], collection: 'hero' | 'gallery') => {
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        const formData = new FormData();

        Array.from(files).forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });
        formData.append('collection', collection);

        router.post(`/projects/${project.id}/images`, formData, {
            forceFormData: true,
            onSuccess: () => {
                setUploadingImages(false);
            },
            onError: (errors) => {
                console.error('Upload failed:', errors);
                setUploadingImages(false);
            },
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, collection: 'hero' | 'gallery') => {
        const files = e.target.files;
        if (files) {
            uploadFiles(files, collection);
        }
    };

    const handleDragEnter = (e: React.DragEvent, collection: 'hero' | 'gallery') => {
        e.preventDefault();
        e.stopPropagation();
        if (collection === 'hero') {
            setIsDraggingHero(true);
        } else {
            setIsDraggingGallery(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent, collection: 'hero' | 'gallery') => {
        e.preventDefault();
        e.stopPropagation();

        // Only set dragging to false if leaving the container itself, not child elements
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
            if (collection === 'hero') {
                setIsDraggingHero(false);
            } else {
                setIsDraggingGallery(false);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent, collection: 'hero' | 'gallery') => {
        e.preventDefault();
        e.stopPropagation();

        if (collection === 'hero') {
            setIsDraggingHero(false);
        } else {
            setIsDraggingGallery(false);
        }

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            // Filter for image files only
            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            if (imageFiles.length > 0) {
                uploadFiles(imageFiles, collection);
            }
        }
    };

    const handleImageDelete = (imageUrl: string, collection: 'hero' | 'gallery') => {
        const confirmed = window.confirm('Are you sure you want to delete this image?');

        if (!confirmed) {
            return;
        }

        router.delete(`/projects/${project.id}/images`, {
            data: { image_url: imageUrl, collection },
            preserveScroll: true,
        });
    };

    const handleDeleteUnit = (unitId: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this unit?');

        if (!confirmed) {
            return;
        }

        router.delete(`/projects/${project.id}/units/${unitId}`, {
            preserveScroll: true,
        });
    };

    const openLightbox = (images: string[], index: number) => {
        setLightboxImages(images);
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxImages(null);
        setLightboxIndex(0);
    };

    // Get hero images with fallback
    const heroImages = project.hero_images?.length
        ? project.hero_images
        : project.images?.slice(0, 3) || (project.cover_image ? [project.cover_image] : []);

    // Get gallery images with fallback
    const galleryImages = project.gallery_images?.length
        ? project.gallery_images
        : project.images || [];

    return (
        <>
            {lightboxImages && (
                <ImageLightbox
                    images={lightboxImages}
                    initialIndex={lightboxIndex}
                    onClose={closeLightbox}
                />
            )}
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={project.name} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={index().url}>
                                <ArrowLeftIcon className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">{isEditing ? formData.name : project.name}</h1>
                        {(isEditing ? formData.is_featured : project.is_featured) && <Badge variant="secondary">Featured</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing ? (
                            <>
                                <Button variant="outline" asChild>
                                    <a href={`/p/tr/${project.slug}`} target="_blank" rel="noopener noreferrer">
                                        <ExternalLinkIcon className="mr-2 h-4 w-4" />
                                        View Public (TR)
                                    </a>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a href={`/p/en/${project.slug}`} target="_blank" rel="noopener noreferrer">
                                        <ExternalLinkIcon className="mr-2 h-4 w-4" />
                                        View Public (EN)
                                    </a>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a href={`/p/ar/${project.slug}`} target="_blank" rel="noopener noreferrer">
                                        <ExternalLinkIcon className="mr-2 h-4 w-4" />
                                        View Public (AR)
                                    </a>
                                </Button>
                                <Button onClick={() => setIsEditing(true)}>
                                    <PencilIcon className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={handleCancel} disabled={processing}>
                                    <XIcon className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={processing}>
                                    <CheckIcon className="mr-2 h-4 w-4" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Hero Images Section */}
                <Card className="overflow-hidden">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Hero Images ({heroImages.length})</CardTitle>
                            {isEditing && (
                                <div>
                                    <input
                                        type="file"
                                        id="hero-upload"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleImageUpload(e, 'hero')}
                                        disabled={uploadingImages}
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => document.getElementById('hero-upload')?.click()}
                                        disabled={uploadingImages}
                                    >
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        {uploadingImages ? 'Uploading...' : 'Upload Hero Images'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    {heroImages.length > 0 ? (
                        <CardContent
                            onDragEnter={isEditing ? (e) => handleDragEnter(e, 'hero') : undefined}
                            onDragOver={isEditing ? handleDragOver : undefined}
                            onDragLeave={isEditing ? (e) => handleDragLeave(e, 'hero') : undefined}
                            onDrop={isEditing ? (e) => handleDrop(e, 'hero') : undefined}
                        >
                            <div className="relative">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {heroImages.map((image, i) => (
                                        <div key={i} className="group relative aspect-[21/9] overflow-hidden rounded-lg bg-muted">
                                            <img
                                                src={image}
                                                alt={`${project.name} - Hero ${i + 1}`}
                                                className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                                                onClick={() => !isEditing && openLightbox(heroImages, i)}
                                            />
                                            {isEditing && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute right-2 top-2"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleImageDelete(image, 'hero');
                                                    }}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {isEditing && isDraggingHero && (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm">
                                        <div className="rounded-lg bg-background p-6 text-center shadow-lg">
                                            <PlusIcon className="mx-auto h-12 w-12 text-primary" />
                                            <p className="mt-2 font-medium">Drop images here</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    ) : (
                        <CardContent>
                            <div
                                className={`flex aspect-[21/9] w-full items-center justify-center bg-muted ${isEditing ? 'cursor-pointer border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary/50' : ''}`}
                                onDragEnter={isEditing ? (e) => handleDragEnter(e, 'hero') : undefined}
                                onDragOver={isEditing ? handleDragOver : undefined}
                                onDragLeave={isEditing ? (e) => handleDragLeave(e, 'hero') : undefined}
                                onDrop={isEditing ? (e) => handleDrop(e, 'hero') : undefined}
                                onClick={isEditing ? () => document.getElementById('hero-upload')?.click() : undefined}
                            >
                                {isEditing && isDraggingHero ? (
                                    <div className="text-center">
                                        <PlusIcon className="mx-auto h-12 w-12 text-primary" />
                                        <p className="mt-2 font-medium">Drop images here</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">
                                            {isEditing ? 'Click to upload or drag and drop images here' : 'No hero images'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Edit: Name and Developer inline */}
                {isEditing && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="text-lg font-semibold"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="developer">Developer</Label>
                            <Input
                                id="developer"
                                value={formData.developer}
                                onChange={(e) => updateField('developer', e.target.value)}
                            />
                            <InputError message={errors.developer} />
                        </div>
                    </div>
                )}

                {/* Project Information & Pricing */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isEditing ? (
                            <>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value) => updateField('status', value)}
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
                                        <InputError message={errors.status} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="completion_date">Completion Date</Label>
                                        <Input
                                            id="completion_date"
                                            type="date"
                                            value={formData.completion_date}
                                            onChange={(e) => updateField('completion_date', e.target.value)}
                                        />
                                        <InputError message={errors.completion_date} />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => updateField('location', e.target.value)}
                                        />
                                        <InputError message={errors.location} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => updateField('city', e.target.value)}
                                        />
                                        <InputError message={errors.city} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={formData.country}
                                        onChange={(e) => updateField('country', e.target.value)}
                                    />
                                    <InputError message={errors.country} />
                                </div>
                                <Separator />
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="min_price">Min Price</Label>
                                        <Input
                                            id="min_price"
                                            type="number"
                                            value={formData.min_price}
                                            onChange={(e) => updateField('min_price', e.target.value)}
                                        />
                                        <InputError message={errors.min_price} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="max_price">Max Price</Label>
                                        <Input
                                            id="max_price"
                                            type="number"
                                            value={formData.max_price}
                                            onChange={(e) => updateField('max_price', e.target.value)}
                                        />
                                        <InputError message={errors.max_price} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select
                                            value={formData.currency}
                                            onValueChange={(value) => updateField('currency', value)}
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
                                <Separator />
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_featured"
                                            checked={formData.is_featured}
                                            onCheckedChange={(checked) => updateField('is_featured', checked as boolean)}
                                        />
                                        <Label htmlFor="is_featured">Featured Project</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={formData.is_active}
                                            onCheckedChange={(checked) => updateField('is_active', checked as boolean)}
                                        />
                                        <Label htmlFor="is_active">Active</Label>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Status</span>
                                        <div className="mt-1">
                                            <Badge className={statusColors[project.status]}>
                                                {statusLabels[project.status]}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Location</span>
                                        <p className="mt-1 font-medium">
                                            {project.location}, {project.city}, {project.country}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Developer</span>
                                        <p className="mt-1 font-medium">{project.developer || '-'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Price Range</span>
                                        <p className="mt-1 font-medium">
                                            {formatPrice(project.min_price, project.currency)} -{' '}
                                            {formatPrice(project.max_price, project.currency)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Completion Date</span>
                                        <p className="mt-1 font-medium">
                                            {project.completion_date
                                                ? new Date(project.completion_date).toLocaleDateString()
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Description Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            <div className="space-y-2">
                                <Textarea
                                    id="description"
                                    className="min-h-[120px]"
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    placeholder="Describe the project features, amenities, and unique selling points..."
                                />
                                <InputError message={errors.description} />
                            </div>
                        ) : project.description ? (
                            <p className="whitespace-pre-wrap text-muted-foreground">{project.description}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No description provided</p>
                        )}
                    </CardContent>
                </Card>

                {project.amenities && project.amenities.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {project.amenities.map((amenity, i) => (
                                    <Badge key={i} variant="outline">
                                        {amenity}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Gallery Images Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Gallery ({galleryImages.length} images)</CardTitle>
                            {isEditing && (
                                <div>
                                    <input
                                        type="file"
                                        id="gallery-upload"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleImageUpload(e, 'gallery')}
                                        disabled={uploadingImages}
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => document.getElementById('gallery-upload')?.click()}
                                        disabled={uploadingImages}
                                    >
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        {uploadingImages ? 'Uploading...' : 'Upload Gallery Images'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent
                        onDragEnter={isEditing ? (e) => handleDragEnter(e, 'gallery') : undefined}
                        onDragOver={isEditing ? handleDragOver : undefined}
                        onDragLeave={isEditing ? (e) => handleDragLeave(e, 'gallery') : undefined}
                        onDrop={isEditing ? (e) => handleDrop(e, 'gallery') : undefined}
                    >
                        {galleryImages.length > 0 ? (
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                    {galleryImages.map((image, i) => (
                                        <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                                            <img
                                                src={image}
                                                alt={`${project.name} - Image ${i + 1}`}
                                                className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                                                onClick={() => !isEditing && openLightbox(galleryImages, i)}
                                            />
                                            {isEditing && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute right-2 top-2"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleImageDelete(image, 'gallery');
                                                    }}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {isEditing && isDraggingGallery && (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm">
                                        <div className="rounded-lg bg-background p-6 text-center shadow-lg">
                                            <PlusIcon className="mx-auto h-12 w-12 text-primary" />
                                            <p className="mt-2 font-medium">Drop images here</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className={`flex min-h-[200px] items-center justify-center rounded-lg bg-muted ${isEditing ? 'cursor-pointer border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary/50' : ''}`}
                                onClick={isEditing ? () => document.getElementById('gallery-upload')?.click() : undefined}
                            >
                                {isEditing && isDraggingGallery ? (
                                    <div className="text-center">
                                        <PlusIcon className="mx-auto h-12 w-12 text-primary" />
                                        <p className="mt-2 font-medium">Drop images here</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {isEditing ? 'Click to upload or drag and drop images here' : 'No gallery images'}
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Units Management */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Units Management</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {project.units_count ?? 0} units • Price range: {formatPrice(project.min_price, project.currency)} - {formatPrice(project.max_price, project.currency)}
                                </p>
                            </div>
                            {isEditing && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingUnitId(-1)}
                                >
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Add Unit
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {project.units && project.units.length > 0 ? (
                            <div className="space-y-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Unit</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            {isEditing && <TableHead className="text-right">Actions</TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {project.units.map((unit) => (
                                            <TableRow key={unit.id}>
                                                <TableCell className="font-medium">{unit.unit_number}</TableCell>
                                                <TableCell className="uppercase">{unit.type}</TableCell>
                                                <TableCell>{unit.size_sqft} sqft</TableCell>
                                                <TableCell>
                                                    {formatPrice(unit.price, unit.currency)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={unit.status === 'available' ? 'default' : 'secondary'} className="capitalize">
                                                        {unit.status}
                                                    </Badge>
                                                </TableCell>
                                                {isEditing && (
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setEditingUnitId(unit.id)}
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteUnit(unit.id)}
                                                            >
                                                                <TrashIcon className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <p className="text-xs text-muted-foreground">
                                    Showing {project.units.length} of {project.units_count ?? 0} units
                                </p>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-sm text-muted-foreground">No units added yet</p>
                                {isEditing && (
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => setEditingUnitId(-1)}
                                    >
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add First Unit
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Unit Form Dialog */}
                        {isEditing && editingUnitId !== null && (
                            <UnitFormDialog
                                projectId={project.id}
                                unit={editingUnitId === -1 ? null : project.units?.find(u => u.id === editingUnitId)}
                                currency={project.currency}
                                onClose={() => setEditingUnitId(null)}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
        </>
    );
}

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Unit } from '@/types';
import { router } from '@inertiajs/react';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import InputError from './input-error';

interface Props {
    projectId: number;
    unit: Unit | null | undefined;
    currency: string;
    onClose: () => void;
}

export default function UnitFormDialog({ projectId, unit, currency, onClose }: Props) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploadingImages, setUploadingImages] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [formData, setFormData] = useState({
        unit_number: unit?.unit_number || '',
        type: unit?.type || 'studio',
        floor: unit?.floor?.toString() || '',
        size_sqft: unit?.size_sqft?.toString() || '',
        bedrooms: unit?.bedrooms || 0,
        bathrooms: unit?.bathrooms || 1,
        price: unit?.price || '',
        currency: unit?.currency || currency,
        status: unit?.status || 'available',
        view: unit?.view || '',
        has_balcony: unit?.has_balcony || false,
        has_parking: unit?.has_parking || false,
    });

    const updateField = (field: string, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        setProcessing(true);
        setErrors({});

        const url = unit
            ? `/projects/${projectId}/units/${unit.id}`
            : `/projects/${projectId}/units`;

        const method = unit ? 'put' : 'post';

        router[method](url, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                onClose();
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    const uploadFiles = (files: FileList | File[]) => {
        if (!files || files.length === 0 || !unit) return;

        setUploadingImages(true);
        const formData = new FormData();

        Array.from(files).forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        router.post(`/units/${unit.id}/images`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setUploadingImages(false);
            },
            onError: (errors) => {
                console.error('Upload failed:', errors);
                setUploadingImages(false);
            },
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            uploadFiles(files);
        }
    };

    const handleImageDelete = (imageUrl: string) => {
        if (!unit) return;

        const confirmed = window.confirm('Are you sure you want to delete this image?');
        if (!confirmed) return;

        router.delete(`/units/${unit.id}/images`, {
            data: { image_url: imageUrl },
            preserveScroll: true,
        });
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            if (imageFiles.length > 0) {
                uploadFiles(imageFiles);
            }
        }
    };

    const unitImages = unit?.unit_images || [];

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{unit ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
                    <DialogDescription>
                        {unit ? 'Update unit details' : 'Add a new unit to this project'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="unit_number">Unit Number *</Label>
                            <Input
                                id="unit_number"
                                value={formData.unit_number}
                                onChange={(e) => updateField('unit_number', e.target.value)}
                                placeholder="e.g., 101, A-1, etc."
                            />
                            <InputError message={errors.unit_number} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type *</Label>
                            <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="studio">Studio</SelectItem>
                                    <SelectItem value="1br">1 Bedroom</SelectItem>
                                    <SelectItem value="2br">2 Bedrooms</SelectItem>
                                    <SelectItem value="3br">3 Bedrooms</SelectItem>
                                    <SelectItem value="4br">4 Bedrooms</SelectItem>
                                    <SelectItem value="5br">5 Bedrooms</SelectItem>
                                    <SelectItem value="penthouse">Penthouse</SelectItem>
                                    <SelectItem value="duplex">Duplex</SelectItem>
                                    <SelectItem value="townhouse">Townhouse</SelectItem>
                                    <SelectItem value="villa">Villa</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="bedrooms">Bedrooms</Label>
                            <Input
                                id="bedrooms"
                                type="number"
                                min="0"
                                value={formData.bedrooms}
                                onChange={(e) => updateField('bedrooms', parseInt(e.target.value) || 0)}
                            />
                            <InputError message={errors.bedrooms} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bathrooms">Bathrooms</Label>
                            <Input
                                id="bathrooms"
                                type="number"
                                min="1"
                                value={formData.bathrooms}
                                onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || 1)}
                            />
                            <InputError message={errors.bathrooms} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="size_sqft">Size (sqft) *</Label>
                            <Input
                                id="size_sqft"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.size_sqft}
                                onChange={(e) => updateField('size_sqft', e.target.value)}
                            />
                            <InputError message={errors.size_sqft} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="floor">Floor</Label>
                            <Input
                                id="floor"
                                type="number"
                                min="0"
                                value={formData.floor}
                                onChange={(e) => updateField('floor', e.target.value)}
                            />
                            <InputError message={errors.floor} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price *</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => updateField('price', e.target.value)}
                            />
                            <InputError message={errors.price} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="reserved">Reserved</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                    <SelectItem value="rented">Rented</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="view">View</Label>
                        <Select value={formData.view || 'none'} onValueChange={(value) => updateField('view', value === 'none' ? '' : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select view" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="sea">Sea View</SelectItem>
                                <SelectItem value="city">City View</SelectItem>
                                <SelectItem value="garden">Garden View</SelectItem>
                                <SelectItem value="pool">Pool View</SelectItem>
                                <SelectItem value="park">Park View</SelectItem>
                                <SelectItem value="marina">Marina View</SelectItem>
                                <SelectItem value="golf">Golf View</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.view} />
                    </div>

                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="has_balcony"
                                checked={formData.has_balcony}
                                onCheckedChange={(checked) => updateField('has_balcony', checked as boolean)}
                            />
                            <Label htmlFor="has_balcony">Has Balcony</Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="has_parking"
                                checked={formData.has_parking}
                                onCheckedChange={(checked) => updateField('has_parking', checked as boolean)}
                            />
                            <Label htmlFor="has_parking">Has Parking</Label>
                        </div>
                    </div>

                    {/* Unit Images Section - Only for editing existing units */}
                    {unit && (
                        <div className="space-y-2 border-t pt-4">
                            <div className="flex items-center justify-between">
                                <Label>Unit Images ({unitImages.length})</Label>
                                <div>
                                    <input
                                        type="file"
                                        id="unit-images-upload"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        disabled={uploadingImages}
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => document.getElementById('unit-images-upload')?.click()}
                                        disabled={uploadingImages}
                                    >
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        {uploadingImages ? 'Uploading...' : 'Upload Images'}
                                    </Button>
                                </div>
                            </div>

                            {unitImages.length > 0 ? (
                                <div
                                    className="relative"
                                    onDragEnter={handleDragEnter}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="grid grid-cols-3 gap-2">
                                        {unitImages.map((image, i) => (
                                            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                                                <img
                                                    src={image}
                                                    alt={`Unit image ${i + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute right-1 top-1 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleImageDelete(image);
                                                    }}
                                                >
                                                    <TrashIcon className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    {isDragging && (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm">
                                            <div className="rounded-lg bg-background p-4 text-center shadow-lg">
                                                <PlusIcon className="mx-auto h-8 w-8 text-primary" />
                                                <p className="mt-1 text-sm font-medium">Drop images here</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div
                                    className="flex min-h-[120px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted transition-colors hover:border-primary/50"
                                    onDragEnter={handleDragEnter}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('unit-images-upload')?.click()}
                                >
                                    {isDragging ? (
                                        <div className="text-center">
                                            <PlusIcon className="mx-auto h-8 w-8 text-primary" />
                                            <p className="mt-1 text-sm font-medium">Drop images here</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Click to upload or drag and drop images here
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={processing}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={processing}>
                        {processing ? 'Saving...' : unit ? 'Update Unit' : 'Add Unit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

import { useCallback, useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ImageCropper } from '../image-cropper';

export interface ImageFile {
    id: string;
    file?: File;
    url: string;
    name: string;
}

interface SortableImageProps {
    image: ImageFile;
    onRemove: (id: string) => void;
}

function SortableImage({ image, onRemove }: SortableImageProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group relative aspect-square rounded-lg border bg-muted overflow-hidden',
                isDragging && 'opacity-50 z-50'
            )}
        >
            <img
                src={image.url}
                alt={image.name}
                className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="absolute top-2 left-2 p-1 bg-white/80 rounded cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4 text-gray-600" />
                </button>
                <button
                    type="button"
                    onClick={() => onRemove(image.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded hover:bg-red-600 transition-colors"
                >
                    <X className="h-4 w-4 text-white" />
                </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                <p className="text-xs text-white truncate">{image.name}</p>
            </div>
        </div>
    );
}

interface ImageUploadProps {
    value: ImageFile[];
    onChange: (images: ImageFile[]) => void;
    maxFiles?: number;
    accept?: string;
    label?: string;
    description?: string;
    error?: string;
    multiple?: boolean;
    className?: string;
    enableCrop?: boolean;
    cropAspectRatio?: number; // e.g., 16/9 for hero images
    allowAspectRatioChange?: boolean; // Allow user to change aspect ratio
}

export function ImageUpload({
    value = [],
    onChange,
    maxFiles = 10,
    accept = 'image/*',
    label,
    description,
    error,
    multiple = true,
    className,
    enableCrop = false,
    cropAspectRatio = 16 / 9,
    allowAspectRatioChange = false,
}: ImageUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = value.findIndex((item) => item.id === active.id);
            const newIndex = value.findIndex((item) => item.id === over.id);
            onChange(arrayMove(value, oldIndex, newIndex));
        }
    };

    const handleFileChange = useCallback(
        (files: FileList | null) => {
            if (!files) return;

            const remainingSlots = maxFiles - value.length;
            const filesToProcess = Math.min(files.length, remainingSlots);

            if (filesToProcess === 0) return;

            // If crop is enabled, open crop dialog for the first file
            if (enableCrop) {
                setSelectedFile(files[0]);
                setCropDialogOpen(true);
                return;
            }

            // Otherwise, add files directly
            const newImages: ImageFile[] = [];
            for (let i = 0; i < filesToProcess; i++) {
                const file = files[i];
                const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                newImages.push({
                    id,
                    file,
                    url: URL.createObjectURL(file),
                    name: file.name,
                });
            }

            onChange([...value, ...newImages]);
        },
        [value, onChange, maxFiles, enableCrop]
    );

    const handleCropComplete = useCallback(
        (croppedImageBlob: Blob, croppedImageUrl: string) => {
            if (!selectedFile) return;

            const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const croppedFile = new File([croppedImageBlob], selectedFile.name, {
                type: croppedImageBlob.type,
            });

            onChange([
                ...value,
                {
                    id,
                    file: croppedFile,
                    url: croppedImageUrl,
                    name: selectedFile.name,
                },
            ]);

            setSelectedFile(null);
        },
        [selectedFile, value, onChange]
    );

    const handleCropCancel = useCallback(() => {
        setSelectedFile(null);
    }, []);

    const handleRemove = useCallback(
        (id: string) => {
            const image = value.find((img) => img.id === id);
            if (image?.url.startsWith('blob:')) {
                URL.revokeObjectURL(image.url);
            }
            onChange(value.filter((img) => img.id !== id));
        },
        [value, onChange]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFileChange(e.dataTransfer.files);
        },
        [handleFileChange]
    );

    const canAddMore = value.length < maxFiles;

    return (
        <div className={cn('space-y-4', className)}>
            {label && (
                <div>
                    <label className="text-sm font-medium">{label}</label>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
            )}

            {enableCrop && selectedFile && (
                <ImageCropper
                    dialogOpen={cropDialogOpen}
                    setDialogOpen={setCropDialogOpen}
                    selectedFile={selectedFile}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                    aspectRatio={cropAspectRatio}
                    allowAspectRatioChange={allowAspectRatioChange}
                    triggerLabel="Crop Image"
                />
            )}

            {canAddMore && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                        isDragOver
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25 hover:border-primary/50'
                    )}
                >
                    <input
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="hidden"
                        id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                            Drag & drop images here, or click to select
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {value.length} of {maxFiles} images uploaded
                        </p>
                    </label>
                </div>
            )}

            {value.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={value} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {value.map((image) => (
                                <SortableImage
                                    key={image.id}
                                    image={image}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

interface SingleImageUploadProps {
    value: ImageFile | null;
    onChange: (image: ImageFile | null) => void;
    accept?: string;
    label?: string;
    description?: string;
    error?: string;
    className?: string;
}

export function SingleImageUpload({
    value,
    onChange,
    accept = 'image/*',
    label,
    description,
    error,
    className,
}: SingleImageUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = useCallback(
        (files: FileList | null) => {
            if (!files || files.length === 0) return;

            const file = files[0];
            const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            if (value?.url.startsWith('blob:')) {
                URL.revokeObjectURL(value.url);
            }

            onChange({
                id,
                file,
                url: URL.createObjectURL(file),
                name: file.name,
            });
        },
        [value, onChange]
    );

    const handleRemove = useCallback(() => {
        if (value?.url.startsWith('blob:')) {
            URL.revokeObjectURL(value.url);
        }
        onChange(null);
    }, [value, onChange]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFileChange(e.dataTransfer.files);
        },
        [handleFileChange]
    );

    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <div>
                    <label className="text-sm font-medium">{label}</label>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
            )}

            {value ? (
                <div className="relative aspect-video rounded-lg border bg-muted overflow-hidden max-w-md">
                    <img
                        src={value.url}
                        alt={value.name}
                        className="h-full w-full object-contain"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer max-w-md',
                        isDragOver
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25 hover:border-primary/50'
                    )}
                >
                    <input
                        type="file"
                        accept={accept}
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="hidden"
                        id="single-image-upload"
                    />
                    <label htmlFor="single-image-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                            Drag & drop image here, or click to select
                        </p>
                    </label>
                </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

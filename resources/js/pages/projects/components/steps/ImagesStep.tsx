import { ImageUpload, type ImageFile } from '@/components/ui/image-upload';
import { Separator } from '@/components/ui/separator';

interface ImagesStepProps {
    heroImages: ImageFile[];
    setHeroImages: (images: ImageFile[]) => void;
    galleryImages: ImageFile[];
    setGalleryImages: (images: ImageFile[]) => void;
    errors: Record<string, string>;
}

export function ImagesStep({
    heroImages,
    setHeroImages,
    galleryImages,
    setGalleryImages,
    errors,
}: ImagesStepProps) {
    return (
        <div className="space-y-6">
            <div>
                <ImageUpload
                    value={heroImages}
                    onChange={setHeroImages}
                    maxFiles={5}
                    label="Hero Görselleri"
                    description="Bu görseller ana sayfada hero slider'da görüntülenecektir. Sırayı değiştirmek için sürükleyin."
                    error={errors.hero_images}
                />
            </div>
            <Separator />
            <div>
                <ImageUpload
                    value={galleryImages}
                    onChange={setGalleryImages}
                    maxFiles={20}
                    label="Galeri Görselleri"
                    description="Bu görseller galeri bölümünde görüntülenecektir. Sırayı değiştirmek için sürükleyin."
                    error={errors.gallery_images}
                />
            </div>
        </div>
    );
}

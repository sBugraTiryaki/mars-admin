import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    images: string[];
    initialIndex: number;
    onClose: () => void;
}

export default function ImageLightbox({ images, initialIndex, onClose }: Props) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
                <div className="relative flex items-center justify-center h-[95vh]">
                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 z-50 text-white hover:bg-white/20"
                        onClick={onClose}
                    >
                        <XIcon className="h-6 w-6" />
                    </Button>

                    {/* Previous Button */}
                    {images.length > 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 text-white hover:bg-white/20"
                            onClick={handlePrevious}
                        >
                            <ChevronLeftIcon className="h-8 w-8" />
                        </Button>
                    )}

                    {/* Image */}
                    <img
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="max-h-full max-w-full object-contain"
                    />

                    {/* Next Button */}
                    {images.length > 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 text-white hover:bg-white/20"
                            onClick={handleNext}
                        >
                            <ChevronRightIcon className="h-8 w-8" />
                        </Button>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
                            {currentIndex + 1} / {images.length}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

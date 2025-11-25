import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryProps {
    t: any;
    images: string[];
    projectName: string;
}

export function Gallery({ images, projectName, t }: GalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(1);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(4);
            } else if (window.innerWidth >= 768) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (images.length === 0) return null;

    const maxIndex = Math.max(0, images.length - itemsPerPage);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    };

    return (
        <section id="gallery" className="py-24 md:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 relative">
                <h2 className="text-3xl md:text-5xl font-light text-center text-gray-900 mb-16 tracking-tight">
                    Gallery
                </h2>

                <div className="relative group">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-700 ease-out"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                            }}
                        >
                            {images.map((src, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 px-2"
                                    style={{ width: `${100 / itemsPerPage}%` }}
                                >
                                    <div className="relative overflow-hidden h-64 md:h-80 group/image">
                                        <img
                                            src={src}
                                            alt={`${projectName} - Image ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105 cursor-pointer"
                                            onClick={() => setLightboxIndex(index)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {images.length > itemsPerPage && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 -left-4 md:-left-10 transform -translate-y-1/2 p-3 bg-white border border-gray-200 text-gray-900 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:border-amber-500 hover:text-amber-500"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 -right-4 md:-right-10 transform -translate-y-1/2 p-3 bg-white border border-gray-200 text-gray-900 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:border-amber-500 hover:text-amber-500"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>

                {/* Lightbox */}
                {lightboxIndex !== null && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <button
                            onClick={() => setLightboxIndex(null)}
                            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl"
                        >
                            <X size={32} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1);
                            }}
                            className="absolute left-6 text-white/70 hover:text-amber-500 p-3 border border-white/20 hover:border-amber-500/40"
                        >
                            <ChevronLeft />
                        </button>
                        <img
                            src={images[lightboxIndex]}
                            alt={`${projectName} - Image ${lightboxIndex + 1}`}
                            className="max-h-[85vh] max-w-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1);
                            }}
                            className="absolute right-6 text-white/70 hover:text-amber-500 p-3 border border-white/20 hover:border-amber-500/40"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

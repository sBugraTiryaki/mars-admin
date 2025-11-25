import { useState, useEffect } from 'react';

interface HeroProps {
    isRTL?: boolean;
    images: string[];
    onInquire: () => void;
    t: any;
}

export function Hero({ images, onInquire, t, isRTL = false }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleDiscover = () => {
        const overviewSection = document.getElementById('overview');
        if (overviewSection) {
            overviewSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (images.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    if (images.length === 0) {
        return (
            <section className="relative h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white text-2xl">{t.noImagesAvailable}</div>
            </section>
        );
    }

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {images.map((src, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url('${src}')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
                </div>
            ))}

            <div className="absolute bottom-24 left-0 z-10 px-6 md:px-16 max-w-3xl">
                <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-4">
                    A Sanctuary of Light
                </h2>
                <h3 className="text-gray-200 text-xl md:text-3xl font-extralight tracking-wider mb-10">
                    For Those Who Feel
                </h3>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <button
                        onClick={handleDiscover}
                        className="px-6 py-3 text-sm font-light tracking-widest text-white/80 hover:text-white transition-colors"
                    >
                        {t.explore}
                    </button>
                    <button
                        onClick={onInquire}
                        className="bg-white text-gray-900 px-8 py-3 text-sm font-medium tracking-widest hover:bg-gray-100 transition-colors"
                    >
                        {t.inquire}
                    </button>
                </div>
            </div>

            {/* Navigation Dots */}
            {images.length > 1 && (
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-0.5 transition-all duration-500 ${
                                index === currentSlide
                                    ? 'bg-amber-500 w-10'
                                    : 'bg-white/40 w-6 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

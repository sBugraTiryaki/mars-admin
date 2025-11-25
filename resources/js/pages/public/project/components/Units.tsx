import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type Unit } from '@/types';

interface UnitsProps {
    isRTL?: boolean;
    t: any;
    units: Unit[];
    onSelectUnit: (unit: Unit) => void;
    formatPrice: (price: string | null, currency: string) => string;
    getUnitTypeLabel: (type: Unit['type']) => string;
}

export function Units({ units, onSelectUnit, formatPrice, getUnitTypeLabel, t, isRTL = false }: UnitsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(3);
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

    const activeUnits = units.filter((unit) => unit.is_active);

    if (activeUnits.length === 0) return null;

    const maxIndex = Math.max(0, activeUnits.length - itemsPerPage);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    };

    const getUnitDisplayName = (unit: Unit): string => {
        if (unit.name) return unit.name;
        return getUnitTypeLabel(unit.type);
    };

    const getUnitImage = (unit: Unit): string => {
        if (unit.images && unit.images.length > 0) {
            return unit.images[0];
        }
        return '/placeholder-unit.jpg';
    };

    return (
        <section id="units" className="py-24 md:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 relative">
                <h2 className="text-3xl md:text-5xl font-light text-center text-gray-900 mb-16 tracking-tight">
                    {t.availableUnits}
                </h2>

                <div className="relative group">
                    <div className="overflow-hidden py-4">
                        <div
                            className="flex transition-transform duration-700 ease-out"
                            style={{
                                transform: isRTL
                                    ? `translateX(${currentIndex * (100 / itemsPerPage)}%)`
                                    : `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                            }}
                        >
                            {activeUnits.map((unit) => (
                                <div
                                    key={unit.id}
                                    className="flex-shrink-0 px-3"
                                    style={{ width: `${100 / itemsPerPage}%` }}
                                >
                                    <div
                                        onClick={() => onSelectUnit(unit)}
                                        className="group/card bg-gray-50 border border-gray-200 overflow-hidden hover:border-amber-500/40 transition-all duration-500 cursor-pointer h-full flex flex-col"
                                    >
                                        <div className="relative overflow-hidden h-72">
                                            <img
                                                src={getUnitImage(unit)}
                                                alt={getUnitDisplayName(unit)}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                                            />
                                            <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 text-xs font-light tracking-wider text-gray-900">
                                                {unit.unit_number}
                                            </div>
                                            {unit.status !== 'available' && (
                                                <div
                                                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-light tracking-wider ${
                                                        unit.status === 'sold'
                                                            ? 'bg-red-500/90 text-white'
                                                            : unit.status === 'reserved'
                                                              ? 'bg-yellow-500/90 text-black'
                                                              : 'bg-blue-500/90 text-white'
                                                    }`}
                                                >
                                                    {unit.status.toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-8 text-center flex-grow flex flex-col justify-between">
                                            <div className="space-y-3">
                                                <h3 className="text-xl font-light text-gray-900 tracking-wide">
                                                    {getUnitDisplayName(unit)}
                                                </h3>
                                                <div className="text-gray-500 text-sm space-y-1">
                                                    <p>
                                                        {unit.size_sqft} {t.sqft} • {unit.bedrooms} {t.bed} • {unit.bathrooms}{' '}
                                                        {t.bath}
                                                    </p>
                                                    {unit.floor && <p>{t.floor} {unit.floor}</p>}
                                                </div>
                                                <p className="text-gray-700 font-light">
                                                    {t.from} {formatPrice(unit.price, unit.currency)}
                                                </p>
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <span className="text-xs uppercase tracking-widest font-light text-gray-500 group-hover/card:text-amber-500 transition-colors">
                                                    {t.explore}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {activeUnits.length > itemsPerPage && (
                        <>
                            <button
                                onClick={isRTL ? nextSlide : prevSlide}
                                className={`absolute top-1/2 transform -translate-y-1/2 p-3 bg-white border border-gray-200 text-gray-900 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:border-amber-500 hover:text-amber-500 ${isRTL ? '-right-4 md:-right-10' : '-left-4 md:-left-10'}`}
                            >
                                {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                            </button>

                            <button
                                onClick={isRTL ? prevSlide : nextSlide}
                                className={`absolute top-1/2 transform -translate-y-1/2 p-3 bg-white border border-gray-200 text-gray-900 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:border-amber-500 hover:text-amber-500 ${isRTL ? '-left-4 md:-left-10' : '-right-4 md:-right-10'}`}
                            >
                                {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

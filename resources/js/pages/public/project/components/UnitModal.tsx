import { X } from 'lucide-react';
import { type Unit } from '@/types';

interface UnitModalProps {
    unit: Unit | null;
    isOpen: boolean;
    onClose: () => void;
    onInquire: () => void;
    formatPrice: (price: string | null, currency: string) => string;
    getUnitTypeLabel: (type: Unit['type']) => string;
    getViewLabel: (view: Unit['view']) => string;
    t: any;
}

export function UnitModal({
    unit,
    isOpen,
    onClose,
    onInquire,
    formatPrice,
    getUnitTypeLabel,
    getViewLabel,
    t,
}: UnitModalProps) {
    if (!isOpen || !unit) return null;

    const getUnitDisplayName = (): string => {
        if (unit.name) return unit.name;
        return getUnitTypeLabel(unit.type);
    };

    const getUnitImage = (): string => {
        if (unit.images && unit.images.length > 0) {
            return unit.images[0];
        }
        return '/placeholder-unit.jpg';
    };

    const getUnitGallery = (): string[] => {
        if (unit.images && unit.images.length > 1) {
            return unit.images.slice(1);
        }
        return [];
    };

    const buildDescription = (): string => {
        if (unit.notes) return unit.notes;

        const parts: string[] = [];
        parts.push(`${getUnitTypeLabel(unit.type)} ${t.with} ${unit.size_sqft} ${t.sqft}${unit.size_sqm ? ` (${unit.size_sqm} ${t.sqm})` : ''}.`);
        parts.push(`${unit.bedrooms} ${unit.bedrooms === 1 ? t.bedroom : t.bedrooms} ${t.and} ${unit.bathrooms} ${unit.bathrooms === 1 ? t.bathroom : t.bathrooms}.`);
        if (unit.view) parts.push(`${getViewLabel(unit.view)}.`);

        const features: string[] = [];
        if (unit.has_balcony) features.push(t.balcony);
        if (unit.has_parking) features.push(`${t.parking} (${unit.parking_spots} ${t.spots})`);
        if (features.length > 0) parts.push(`${t.features}: ${features.join(', ')}.`);

        return parts.join(' ');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

            {/* Content */}
            <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl relative z-10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/80 p-2 text-gray-900 hover:bg-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left: Info */}
                    <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                                    {getUnitDisplayName()}
                                </h3>
                                <span className="text-sm font-light tracking-wider text-gray-500">
                                    {unit.unit_number}
                                </span>
                            </div>
                            <p className="text-xl text-gray-700 font-light">
                                {formatPrice(unit.price, unit.currency)}
                            </p>
                        </div>

                        {/* Unit details */}
                        <div className="grid grid-cols-2 gap-4 border-y border-gray-200 py-6">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{t.size}</p>
                                <p className="font-light text-gray-900">{unit.size_sqft} {t.sqft}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{t.bedrooms}</p>
                                <p className="font-light text-gray-900">{unit.bedrooms}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{t.bathrooms}</p>
                                <p className="font-light text-gray-900">{unit.bathrooms}</p>
                            </div>
                            {unit.floor && (
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{t.floor}</p>
                                    <p className="font-light text-gray-900">{unit.floor}</p>
                                </div>
                            )}
                            {unit.view && (
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{t.view}</p>
                                    <p className="font-light text-gray-900">{getViewLabel(unit.view)}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{t.status}</p>
                                <p
                                    className={`font-light ${
                                        unit.status === 'available'
                                            ? 'text-green-600'
                                            : unit.status === 'sold'
                                              ? 'text-red-600'
                                              : unit.status === 'reserved'
                                                ? 'text-yellow-600'
                                                : 'text-blue-600'
                                    }`}
                                >
                                    {t.unitStatus[unit.status]}
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed font-light">{buildDescription()}</p>

                        {unit.floor_plan && (
                            <div>
                                <h4 className="text-sm font-light tracking-wider mb-4 text-gray-900 border-b border-gray-200 pb-2">
                                    {t.floorPlan}
                                </h4>
                                <div className="bg-gray-50 border border-gray-200 p-4">
                                    <img
                                        src={unit.floor_plan}
                                        alt={t.floorPlan}
                                        className="w-full h-48 object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button className="flex-1 px-6 py-3 text-sm font-light tracking-widest text-gray-500 hover:text-gray-900 transition-colors">
                                {t.prospectus}
                            </button>
                            <button
                                className="flex-1 bg-gray-900 text-white px-6 py-3 text-sm font-medium tracking-widest hover:bg-gray-800 transition-colors"
                                onClick={() => {
                                    onClose();
                                    onInquire();
                                }}
                            >
                                {t.inquire}
                            </button>
                        </div>
                    </div>

                    {/* Right: Images */}
                    <div className="bg-gray-100 p-6 lg:p-8 overflow-y-auto max-h-[50vh] lg:max-h-[90vh]">
                        <div className="grid gap-4">
                            <img src={getUnitImage()} alt={getUnitDisplayName()} className="w-full shadow-md" />
                            {getUnitGallery().map((img, idx) => (
                                <img key={idx} src={img} alt={`Detail ${idx}`} className="w-full shadow-md" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

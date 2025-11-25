import {
    Umbrella,
    Waves,
    Dumbbell,
    Flower2,
    ConciergeBell,
    Utensils,
    Car,
    Shield,
    Wifi,
    TreePine,
    Coffee,
    Baby,
    type LucideIcon,
} from 'lucide-react';

interface AmenitiesProps {
    isRTL?: boolean;
    t: any;
    amenities: string[];
}

// Map amenity names to icons
const amenityIcons: Record<string, LucideIcon> = {
    'Private Beach': Umbrella,
    Beach: Umbrella,
    Pool: Waves,
    'Swimming Pool': Waves,
    Fitness: Dumbbell,
    Gym: Dumbbell,
    'Fitness Center': Dumbbell,
    Spa: Flower2,
    Wellness: Flower2,
    Concierge: ConciergeBell,
    '24/7 Concierge': ConciergeBell,
    Dining: Utensils,
    Restaurant: Utensils,
    Parking: Car,
    'Valet Parking': Car,
    Security: Shield,
    '24/7 Security': Shield,
    WiFi: Wifi,
    'High-Speed Internet': Wifi,
    Garden: TreePine,
    'Landscaped Gardens': TreePine,
    Cafe: Coffee,
    'Coffee Lounge': Coffee,
    'Kids Club': Baby,
    'Children Area': Baby,
};

export function Amenities({ amenities, t, isRTL = false }: AmenitiesProps) {
    if (amenities.length === 0) return null;

    const amenityItems = amenities.map((name) => ({
        icon: amenityIcons[name] || ConciergeBell,
        label: name,
    }));

    return (
        <section id="amenities" className="py-24 md:py-32 bg-gray-50">
            <div className="container mx-auto px-6 md:px-12">
                <h2 className="text-3xl md:text-5xl font-light text-center text-gray-900 mb-16 tracking-tight">
                    {t.amenities}
                </h2>

                <div
                    className={`grid gap-6 ${
                        amenityItems.length <= 3
                            ? 'grid-cols-1 md:grid-cols-3'
                            : amenityItems.length <= 4
                              ? 'grid-cols-2 md:grid-cols-4'
                              : amenityItems.length <= 6
                                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
                                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    }`}
                >
                    {amenityItems.map((item, index) => (
                        <div
                            key={index}
                            className="group bg-white p-8 border border-gray-200 hover:border-amber-500/40 transition-all duration-300 text-center flex flex-col items-center justify-center"
                        >
                            <div className="mb-4 text-gray-500 group-hover:text-amber-500 transition-colors duration-300">
                                <item.icon size={32} strokeWidth={1.5} />
                            </div>
                            <p className="font-light text-sm tracking-wide text-gray-700">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

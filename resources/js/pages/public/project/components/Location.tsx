interface LocationProps {
    isRTL?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: any;
    location: string;
    city: string;
}

export function Location({ location, city }: LocationProps) {
    const locationLabel = `${location}, ${city}`;

    return (
        <section id="location" className="w-full h-[500px] md:h-[600px] relative bg-gray-200">
            <iframe
                title="Location Map"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.251433299318!2d55.13654531500738!3d25.09332298394432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b8b9b8b8b8b%3A0x3b3b3b3b3b3b3b3b!2s${encodeURIComponent(location)}!5e0!3m2!1sen!2sae!4v1638888888888!5m2!1sen!2sae`}
                allowFullScreen
                loading="lazy"
            />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-8 py-4 border border-gray-200">
                <p className="font-light text-lg tracking-wide text-gray-900">{locationLabel}</p>
            </div>
        </section>
    );
}

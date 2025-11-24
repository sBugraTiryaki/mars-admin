interface ContactProps {
    onInquire: () => void;
}

export function Contact({ onInquire }: ContactProps) {
    return (
        <section className="py-32 md:py-40 bg-gray-50 text-center">
            <div className="container mx-auto px-6 md:px-12">
                <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
                    By Invitation Only
                </h2>
                <p className="max-w-xl mx-auto text-lg text-gray-600 mb-12 font-light leading-relaxed">
                    For those who seek more than a residence.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="px-6 py-3 text-sm font-light tracking-widest text-gray-500 hover:text-gray-900 transition-colors">
                        Prospectus
                    </button>
                    <button
                        onClick={onInquire}
                        className="bg-gray-900 text-white px-8 py-3 text-sm font-medium tracking-widest hover:bg-gray-800 transition-colors"
                    >
                        Inquire
                    </button>
                </div>
            </div>
        </section>
    );
}

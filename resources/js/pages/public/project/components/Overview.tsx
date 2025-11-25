import { type Project } from '@/types';

interface OverviewProps {
    isRTL?: boolean;
    project: Project;
    formatPrice: (price: string | null, currency: string) => string;
    getStatusLabel: (status: Project['status']) => string;
    t: any;
}

export function Overview({ project, formatPrice, getStatusLabel, t, isRTL = false }: OverviewProps) {
    const stats = [
        { label: t.developer, value: project.developer || '-' },
        { label: t.status, value: getStatusLabel(project.status) },
        { label: t.totalUnits, value: project.total_units.toString() },
        {
            label: t.priceRange,
            value:
                project.min_price && project.max_price
                    ? `${formatPrice(project.min_price, project.currency)} - ${formatPrice(project.max_price, project.currency)}`
                    : '-',
        },
        {
            label: t.completion,
            value: project.completion_date
                ? new Date(project.completion_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                  })
                : '-',
        },
    ];

    return (
        <section id="overview" className="py-24 md:py-32 bg-gray-50">
            <div className="container mx-auto px-6 md:px-12">
                <div className="text-center mb-20">
                    <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-4">
                        {t.overview}
                    </p>
                    {project.hero_title && (
                        <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-8 tracking-tight">
                            {project.hero_title}
                        </h2>
                    )}
                    {project.hero_subtitle && (
                        <p className="max-w-2xl mx-auto text-xl text-gray-500 leading-relaxed font-light mb-6">
                            {project.hero_subtitle}
                        </p>
                    )}
                    {project.overview && (
                        <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed font-light">
                            {project.overview}
                        </p>
                    )}
                </div>

                <div className="border-y border-gray-200 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <h4 className="font-light text-gray-900 text-sm mb-2 tracking-wide">
                                    {stat.label}
                                </h4>
                                <p className="text-gray-600 font-light text-sm">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

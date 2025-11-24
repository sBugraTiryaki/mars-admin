import { type Project } from '@/types';

interface OverviewProps {
    project: Project;
    formatPrice: (price: string | null, currency: string) => string;
    getStatusLabel: (status: Project['status']) => string;
}

export function Overview({ project, formatPrice, getStatusLabel }: OverviewProps) {
    const stats = [
        { label: 'Type', value: 'Residential' },
        { label: 'Status', value: getStatusLabel(project.status) },
        { label: 'Developer', value: project.developer || '-' },
        { label: 'Total Units', value: project.total_units.toString() },
        {
            label: 'Price Range',
            value:
                project.min_price && project.max_price
                    ? `${formatPrice(project.min_price, project.currency)} - ${formatPrice(project.max_price, project.currency)}`
                    : '-',
        },
        {
            label: 'Completion',
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
                        Overview
                    </p>
                    <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-8 tracking-tight">
                        Precision. Light. Permanence.
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed font-light">
                        {project.description ||
                            'Crafted for those who recognize the quiet power of restraint. Where architecture speaks in whispers, and every detail serves a singular purpose.'}
                    </p>
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

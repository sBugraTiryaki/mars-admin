import { index, edit } from '@/actions/App/Http/Controllers/ProjectController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Project } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon } from 'lucide-react';

interface Props {
    project: Project;
}

const statusColors = {
    planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    under_construction: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    sold_out: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const statusLabels = {
    planning: 'Planning',
    under_construction: 'Under Construction',
    completed: 'Completed',
    sold_out: 'Sold Out',
};

export default function ProjectShow({ project }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projects',
            href: index().url,
        },
        {
            title: project.name,
            href: '#',
        },
    ];

    const formatPrice = (price: string | null, currency: string) => {
        if (!price) return '-';
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={index().url}>
                                <ArrowLeftIcon className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">{project.name}</h1>
                        {project.is_featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                    <Button asChild>
                        <Link href={edit(project.id).url}>
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Status</span>
                                <div>
                                    <Badge className={statusColors[project.status]}>
                                        {statusLabels[project.status]}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Location</span>
                                <p className="font-medium">
                                    {project.location}, {project.city}, {project.country}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Developer</span>
                                <p className="font-medium">{project.developer || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Completion Date</span>
                                <p className="font-medium">
                                    {project.completion_date
                                        ? new Date(project.completion_date).toLocaleDateString()
                                        : '-'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Units</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Price Range</span>
                                <p className="font-medium">
                                    {formatPrice(project.min_price, project.currency)} -{' '}
                                    {formatPrice(project.max_price, project.currency)}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Total Units</span>
                                <p className="font-medium">{project.total_units}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Units in System</span>
                                <p className="font-medium">{project.units_count ?? 0}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {project.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{project.description}</p>
                        </CardContent>
                    </Card>
                )}

                {project.amenities && project.amenities.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {project.amenities.map((amenity, i) => (
                                    <Badge key={i} variant="outline">
                                        {amenity}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {project.units && project.units.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Units</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left font-medium">Unit</th>
                                            <th className="px-4 py-3 text-left font-medium">Type</th>
                                            <th className="px-4 py-3 text-left font-medium">Size</th>
                                            <th className="px-4 py-3 text-left font-medium">Price</th>
                                            <th className="px-4 py-3 text-left font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {project.units.map((unit) => (
                                            <tr key={unit.id} className="border-b">
                                                <td className="px-4 py-3">{unit.unit_number}</td>
                                                <td className="px-4 py-3 uppercase">{unit.type}</td>
                                                <td className="px-4 py-3">{unit.size_sqft} sqft</td>
                                                <td className="px-4 py-3">
                                                    {formatPrice(unit.price, unit.currency)}
                                                </td>
                                                <td className="px-4 py-3 capitalize">{unit.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

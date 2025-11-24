import { index, create, show, edit, destroy } from '@/actions/App/Http/Controllers/ProjectController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData, type Project } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: index().url,
    },
];

interface Props {
    projects: PaginatedData<Project>;
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

export default function ProjectsIndex({ projects }: Props) {
    const handleDelete = (project: Project) => {
        if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
            router.delete(destroy(project.id).url);
        }
    };

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
            <Head title="Projects" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <Button asChild>
                        <Link href={create().url}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Project
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Projects ({projects.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Location</th>
                                        <th className="px-4 py-3 text-left font-medium">Developer</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-left font-medium">Units</th>
                                        <th className="px-4 py-3 text-left font-medium">Price Range</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.data.map((project) => (
                                        <tr key={project.id} className="border-b hover:bg-muted/50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="font-medium">{project.name}</div>
                                                    {project.is_featured && (
                                                        <Badge variant="secondary" className="mt-1 text-xs">
                                                            Featured
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>{project.location}</div>
                                                <div className="text-muted-foreground text-xs">
                                                    {project.city}, {project.country}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{project.developer || '-'}</td>
                                            <td className="px-4 py-3">
                                                <Badge className={statusColors[project.status]}>
                                                    {statusLabels[project.status]}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">{project.units_count ?? 0}</td>
                                            <td className="px-4 py-3">
                                                <div className="text-xs">
                                                    {formatPrice(project.min_price, project.currency)} -{' '}
                                                    {formatPrice(project.max_price, project.currency)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={show(project.id).url}>
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={edit(project.id).url}>
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(project)}
                                                    >
                                                        <TrashIcon className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {projects.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-2">
                                {projects.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={!!link.url}
                                    >
                                        {link.url ? (
                                            <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

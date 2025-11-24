import { index, create, show, edit, destroy } from '@/actions/App/Http/Controllers/ProjectController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Developer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Units</TableHead>
                                    <TableHead>Price Range</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.data.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{project.name}</div>
                                                {project.is_featured && (
                                                    <Badge variant="secondary" className="mt-1 text-xs">
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{project.location}</div>
                                            <div className="text-muted-foreground text-xs">
                                                {project.city}, {project.country}
                                            </div>
                                        </TableCell>
                                        <TableCell>{project.developer || '-'}</TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[project.status]}>
                                                {statusLabels[project.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{project.units_count ?? 0}</TableCell>
                                        <TableCell>
                                            <div className="text-xs">
                                                {formatPrice(project.min_price, project.currency)} -{' '}
                                                {formatPrice(project.max_price, project.currency)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
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
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {projects.last_page > 1 && (
                            <Pagination className="mt-4">
                                <PaginationContent>
                                    {projects.current_page > 1 && (
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={projects.links[0]?.url || '#'}
                                            />
                                        </PaginationItem>
                                    )}
                                    {projects.links.slice(1, -1).map((link, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                href={link.url || '#'}
                                                isActive={link.active}
                                            >
                                                {link.label}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    {projects.current_page < projects.last_page && (
                                        <PaginationItem>
                                            <PaginationNext
                                                href={projects.links[projects.links.length - 1]?.url || '#'}
                                            />
                                        </PaginationItem>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

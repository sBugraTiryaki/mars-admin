import { index, create, show, destroy } from '@/actions/App/Http/Controllers/ProjectController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { PlusIcon, TrashIcon, EyeIcon, GridIcon, ListIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: index().url,
    },
];

interface Props {
    projects: PaginatedData<Project & {
        hero_images?: string[];
    }>;
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

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

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        router.get(index().url, { search: query, status: statusFilter !== 'all' ? statusFilter : undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        router.get(index().url, { search: searchQuery || undefined, status: status !== 'all' ? status : undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
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

                {/* Filters and View Toggle */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-1 gap-2">
                                <div className="relative flex-1 max-w-sm">
                                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search projects..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="planning">Planning</SelectItem>
                                        <SelectItem value="under_construction">Under Construction</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="sold_out">Sold Out</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-1 rounded-md border p-1">
                                <Button
                                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <GridIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <ListIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Grid View */}
                {viewMode === 'grid' ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {projects.data.map((project) => {
                            // Get first hero image or fallback
                            const projectImage = project.hero_images?.[0]
                                || (project.images && Array.isArray(project.images) ? project.images[0] : null)
                                || project.cover_image;

                            return (
                                <Card key={project.id} className="overflow-hidden">
                                    <Link href={show(project.id).url}>
                                        {projectImage ? (
                                            <div className="aspect-video w-full overflow-hidden bg-muted">
                                                <img
                                                    src={projectImage}
                                                    alt={project.name}
                                                    className="h-full w-full object-cover transition-transform hover:scale-105"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-video w-full bg-muted flex items-center justify-center">
                                                <span className="text-sm text-muted-foreground">No image</span>
                                            </div>
                                        )}
                                    </Link>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">
                                                <Link href={show(project.id).url} className="hover:underline">
                                                    {project.name}
                                                </Link>
                                            </CardTitle>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {project.location}, {project.city}
                                            </p>
                                        </div>
                                        {project.is_featured && (
                                            <Badge variant="secondary" className="text-xs">
                                                Featured
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Status</span>
                                        <Badge className={statusColors[project.status]}>
                                            {statusLabels[project.status]}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Developer</span>
                                        <span className="font-medium">{project.developer || '-'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Units</span>
                                        <span className="font-medium">{project.units_count ?? 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Price Range</span>
                                        <span className="font-medium text-xs">
                                            {formatPrice(project.min_price, project.currency)} - {formatPrice(project.max_price, project.currency)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end gap-1 pt-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={show(project.id).url}>
                                                <EyeIcon className="mr-2 h-4 w-4" />
                                                View
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(project)}
                                        >
                                            <TrashIcon className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            );
                        })}
                    </div>
                ) : (
                    /* List View */
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
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {projects.last_page > 1 && (
                    <Pagination>
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
            </div>
        </AppLayout>
    );
}

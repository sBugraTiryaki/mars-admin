import { index, create, show, edit, destroy } from '@/actions/App/Http/Controllers/UnitController';
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
import { type BreadcrumbItem, type PaginatedData, type Unit } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Units',
        href: index().url,
    },
];

interface Props {
    units: PaginatedData<Unit>;
}

const statusColors = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    reserved: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    sold: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    rented: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export default function UnitsIndex({ units }: Props) {
    const handleDelete = (unit: Unit) => {
        if (confirm(`Are you sure you want to delete unit "${unit.unit_number}"?`)) {
            router.delete(destroy(unit.id).url);
        }
    };

    const formatPrice = (price: string, currency: string) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Units" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Units</h1>
                    <Button asChild>
                        <Link href={create().url}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Unit
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Units ({units.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Beds/Baths</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {units.data.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell>
                                            <div className="font-medium">{unit.unit_number}</div>
                                            {unit.floor && (
                                                <div className="text-muted-foreground text-xs">
                                                    Floor {unit.floor}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{unit.project?.name || '-'}</TableCell>
                                        <TableCell className="uppercase">{unit.type}</TableCell>
                                        <TableCell>{unit.size_sqft} sqft</TableCell>
                                        <TableCell>
                                            {unit.bedrooms} / {unit.bathrooms}
                                        </TableCell>
                                        <TableCell>{formatPrice(unit.price, unit.currency)}</TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[unit.status]}>{unit.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={show(unit.id).url}>
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(unit.id).url}>
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(unit)}
                                                >
                                                    <TrashIcon className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {units.last_page > 1 && (
                            <Pagination className="mt-4">
                                <PaginationContent>
                                    {units.current_page > 1 && (
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={units.links[0]?.url || '#'}
                                            />
                                        </PaginationItem>
                                    )}
                                    {units.links.slice(1, -1).map((link, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                href={link.url || '#'}
                                                isActive={link.active}
                                            >
                                                {link.label}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    {units.current_page < units.last_page && (
                                        <PaginationItem>
                                            <PaginationNext
                                                href={units.links[units.links.length - 1]?.url || '#'}
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

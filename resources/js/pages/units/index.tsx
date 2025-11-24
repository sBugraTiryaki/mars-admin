import { index, create, show, edit, destroy } from '@/actions/App/Http/Controllers/UnitController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium">Unit</th>
                                        <th className="px-4 py-3 text-left font-medium">Project</th>
                                        <th className="px-4 py-3 text-left font-medium">Type</th>
                                        <th className="px-4 py-3 text-left font-medium">Size</th>
                                        <th className="px-4 py-3 text-left font-medium">Beds/Baths</th>
                                        <th className="px-4 py-3 text-left font-medium">Price</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.data.map((unit) => (
                                        <tr key={unit.id} className="border-b hover:bg-muted/50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{unit.unit_number}</div>
                                                {unit.floor && (
                                                    <div className="text-muted-foreground text-xs">
                                                        Floor {unit.floor}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">{unit.project?.name || '-'}</td>
                                            <td className="px-4 py-3 uppercase">{unit.type}</td>
                                            <td className="px-4 py-3">{unit.size_sqft} sqft</td>
                                            <td className="px-4 py-3">
                                                {unit.bedrooms} / {unit.bathrooms}
                                            </td>
                                            <td className="px-4 py-3">{formatPrice(unit.price, unit.currency)}</td>
                                            <td className="px-4 py-3">
                                                <Badge className={statusColors[unit.status]}>{unit.status}</Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {units.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-2">
                                {units.links.map((link, i) => (
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

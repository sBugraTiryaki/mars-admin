import { index, edit } from '@/actions/App/Http/Controllers/UnitController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Unit } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon, CheckIcon, XIcon } from 'lucide-react';

interface Props {
    unit: Unit;
}

const statusColors = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    reserved: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    sold: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    rented: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export default function UnitShow({ unit }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Units',
            href: index().url,
        },
        {
            title: unit.unit_number,
            href: '#',
        },
    ];

    const formatPrice = (price: string, currency: string) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={unit.unit_number} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={index().url}>
                                <ArrowLeftIcon className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">{unit.unit_number}</h1>
                        <Badge className={statusColors[unit.status]}>{unit.status}</Badge>
                    </div>
                    <Button asChild>
                        <Link href={edit(unit.id).url}>
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Unit Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Project</span>
                                <p className="font-medium">{unit.project?.name || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Type</span>
                                <p className="font-medium uppercase">{unit.type}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Floor</span>
                                <p className="font-medium">{unit.floor || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">View</span>
                                <p className="font-medium capitalize">{unit.view || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Size & Layout</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Size</span>
                                <p className="font-medium">
                                    {unit.size_sqft} sqft
                                    {unit.size_sqm && ` / ${unit.size_sqm} sqm`}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Bedrooms</span>
                                <p className="font-medium">{unit.bedrooms}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Bathrooms</span>
                                <p className="font-medium">{unit.bathrooms}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Price</span>
                                <p className="text-xl font-bold">{formatPrice(unit.price, unit.currency)}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Price per sqft</span>
                                <p className="font-medium">
                                    {formatPrice(
                                        (parseFloat(unit.price) / parseFloat(unit.size_sqft)).toFixed(2),
                                        unit.currency
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                {unit.has_balcony ? (
                                    <CheckIcon className="h-4 w-4 text-green-600" />
                                ) : (
                                    <XIcon className="h-4 w-4 text-red-600" />
                                )}
                                <span>Balcony</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {unit.has_parking ? (
                                    <CheckIcon className="h-4 w-4 text-green-600" />
                                ) : (
                                    <XIcon className="h-4 w-4 text-red-600" />
                                )}
                                <span>Parking {unit.has_parking && `(${unit.parking_spots} spots)`}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {unit.features && unit.features.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {unit.features.map((feature, i) => (
                                    <Badge key={i} variant="outline">
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {unit.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{unit.notes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

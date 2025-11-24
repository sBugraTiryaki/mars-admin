import { index, update } from '@/actions/App/Http/Controllers/UnitController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Unit } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    unit: Unit;
    projects: { id: number; name: string }[];
}

export default function UnitEdit({ unit, projects }: Props) {
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

    const { data, setData, put, processing, errors } = useForm({
        project_id: unit.project_id.toString(),
        unit_number: unit.unit_number,
        name: unit.name || '',
        type: unit.type,
        floor: unit.floor?.toString() || '',
        size_sqft: unit.size_sqft,
        size_sqm: unit.size_sqm || '',
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        price: unit.price,
        currency: unit.currency,
        status: unit.status,
        view: unit.view || '',
        has_balcony: unit.has_balcony,
        has_parking: unit.has_parking,
        parking_spots: unit.parking_spots,
        notes: unit.notes || '',
        is_active: unit.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(unit.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${unit.unit_number}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Edit Unit</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Unit Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="project_id">Project *</Label>
                                    <Select
                                        value={data.project_id}
                                        onValueChange={(value) => setData('project_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projects.map((project) => (
                                                <SelectItem key={project.id} value={project.id.toString()}>
                                                    {project.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.project_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit_number">Unit Number *</Label>
                                    <Input
                                        id="unit_number"
                                        value={data.unit_number}
                                        onChange={(e) => setData('unit_number', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.unit_number} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type *</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="studio">Studio</SelectItem>
                                            <SelectItem value="1br">1 BR</SelectItem>
                                            <SelectItem value="2br">2 BR</SelectItem>
                                            <SelectItem value="3br">3 BR</SelectItem>
                                            <SelectItem value="4br">4 BR</SelectItem>
                                            <SelectItem value="5br">5 BR</SelectItem>
                                            <SelectItem value="penthouse">Penthouse</SelectItem>
                                            <SelectItem value="duplex">Duplex</SelectItem>
                                            <SelectItem value="townhouse">Townhouse</SelectItem>
                                            <SelectItem value="villa">Villa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.type} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="floor">Floor</Label>
                                    <Input
                                        id="floor"
                                        type="number"
                                        value={data.floor}
                                        onChange={(e) => setData('floor', e.target.value)}
                                    />
                                    <InputError message={errors.floor} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="view">View</Label>
                                    <Select value={data.view} onValueChange={(value) => setData('view', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select view" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sea">Sea</SelectItem>
                                            <SelectItem value="city">City</SelectItem>
                                            <SelectItem value="garden">Garden</SelectItem>
                                            <SelectItem value="pool">Pool</SelectItem>
                                            <SelectItem value="park">Park</SelectItem>
                                            <SelectItem value="marina">Marina</SelectItem>
                                            <SelectItem value="golf">Golf</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.view} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="size_sqft">Size (sqft) *</Label>
                                    <Input
                                        id="size_sqft"
                                        type="number"
                                        value={data.size_sqft}
                                        onChange={(e) => setData('size_sqft', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.size_sqft} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="size_sqm">Size (sqm)</Label>
                                    <Input
                                        id="size_sqm"
                                        type="number"
                                        value={data.size_sqm}
                                        onChange={(e) => setData('size_sqm', e.target.value)}
                                    />
                                    <InputError message={errors.size_sqm} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bedrooms">Bedrooms</Label>
                                    <Input
                                        id="bedrooms"
                                        type="number"
                                        value={data.bedrooms}
                                        onChange={(e) => setData('bedrooms', parseInt(e.target.value) || 0)}
                                    />
                                    <InputError message={errors.bedrooms} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bathrooms">Bathrooms</Label>
                                    <Input
                                        id="bathrooms"
                                        type="number"
                                        value={data.bathrooms}
                                        onChange={(e) => setData('bathrooms', parseInt(e.target.value) || 1)}
                                    />
                                    <InputError message={errors.bathrooms} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.price} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AED">AED</SelectItem>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.currency} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="reserved">Reserved</SelectItem>
                                            <SelectItem value="sold">Sold</SelectItem>
                                            <SelectItem value="rented">Rented</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="has_balcony"
                                        checked={data.has_balcony}
                                        onCheckedChange={(checked) => setData('has_balcony', checked as boolean)}
                                    />
                                    <Label htmlFor="has_balcony">Has Balcony</Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="has_parking"
                                        checked={data.has_parking}
                                        onCheckedChange={(checked) => setData('has_parking', checked as boolean)}
                                    />
                                    <Label htmlFor="has_parking">Has Parking</Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                            </div>

                            {data.has_parking && (
                                <div className="space-y-2 md:w-1/4">
                                    <Label htmlFor="parking_spots">Parking Spots</Label>
                                    <Input
                                        id="parking_spots"
                                        type="number"
                                        value={data.parking_spots}
                                        onChange={(e) => setData('parking_spots', parseInt(e.target.value) || 0)}
                                    />
                                    <InputError message={errors.parking_spots} />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <textarea
                                    id="notes"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Update Unit
                                </Button>
                                <Button type="button" variant="outline" onClick={() => history.back()}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

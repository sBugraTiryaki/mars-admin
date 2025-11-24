import { index, store } from '@/actions/App/Http/Controllers/ProjectController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: index().url,
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function ProjectCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        location: '',
        city: '',
        country: 'UAE',
        total_units: 0,
        min_price: '',
        max_price: '',
        currency: 'AED',
        status: 'planning',
        completion_date: '',
        developer: '',
        is_featured: false,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Create Project</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="developer">Developer</Label>
                                    <Input
                                        id="developer"
                                        value={data.developer}
                                        onChange={(e) => setData('developer', e.target.value)}
                                    />
                                    <InputError message={errors.developer} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location *</Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.location} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.city} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                    />
                                    <InputError message={errors.country} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="min_price">Min Price</Label>
                                    <Input
                                        id="min_price"
                                        type="number"
                                        value={data.min_price}
                                        onChange={(e) => setData('min_price', e.target.value)}
                                    />
                                    <InputError message={errors.min_price} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="max_price">Max Price</Label>
                                    <Input
                                        id="max_price"
                                        type="number"
                                        value={data.max_price}
                                        onChange={(e) => setData('max_price', e.target.value)}
                                    />
                                    <InputError message={errors.max_price} />
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
                                    <Label htmlFor="total_units">Total Units</Label>
                                    <Input
                                        id="total_units"
                                        type="number"
                                        value={data.total_units}
                                        onChange={(e) => setData('total_units', parseInt(e.target.value) || 0)}
                                    />
                                    <InputError message={errors.total_units} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="planning">Planning</SelectItem>
                                            <SelectItem value="under_construction">Under Construction</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="sold_out">Sold Out</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="completion_date">Completion Date</Label>
                                    <Input
                                        id="completion_date"
                                        type="date"
                                        value={data.completion_date}
                                        onChange={(e) => setData('completion_date', e.target.value)}
                                    />
                                    <InputError message={errors.completion_date} />
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', checked as boolean)}
                                    />
                                    <Label htmlFor="is_featured">Featured</Label>
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

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Create Project
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

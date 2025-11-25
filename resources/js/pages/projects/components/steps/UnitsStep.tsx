import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { type UnitData } from '../../types';

interface UnitsStepProps {
    units: UnitData[];
    setUnits: (units: UnitData[]) => void;
    currency: string;
}

export function UnitsStep({ units, setUnits, currency }: UnitsStepProps) {
    const [newUnit, setNewUnit] = useState<UnitData>({
        id: '',
        unit_number: '',
        type: '1br',
        floor: '',
        size_sqft: '',
        min_size_sqm: '',
        max_size_sqm: '',
        bedrooms: 1,
        bathrooms: 1,
        price: '',
        min_price: '',
        max_price: '',
        status: 'available',
        view: '',
        has_balcony: false,
        has_parking: false,
    });

    const addUnit = () => {
        if (!newUnit.unit_number || !newUnit.type) {
            return;
        }

        setUnits([
            ...units,
            { ...newUnit, id: Date.now().toString() },
        ]);

        setNewUnit({
            id: '',
            unit_number: '',
            type: '1br',
            floor: '',
            size_sqft: '',
            min_size_sqm: '',
            max_size_sqm: '',
            bedrooms: 1,
            bathrooms: 1,
            price: '',
            min_price: '',
            max_price: '',
            status: 'available',
            view: '',
            has_balcony: false,
            has_parking: false,
        });
    };

    const removeUnit = (id: string) => {
        setUnits(units.filter((u) => u.id !== id));
    };

    const formatPrice = (price: string, curr: string) => {
        if (!price) return '-';
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: curr,
            maximumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    return (
        <div className="space-y-6">
            <div className="rounded-lg border p-4">
                <h3 className="mb-4 font-medium">Yeni Ünite Ekle</h3>
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="unit_number">Ünite No *</Label>
                            <Input
                                id="unit_number"
                                value={newUnit.unit_number}
                                onChange={(e) => setNewUnit({ ...newUnit, unit_number: e.target.value })}
                                placeholder="A-101"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Tip *</Label>
                            <Select
                                value={newUnit.type}
                                onValueChange={(value) => setNewUnit({ ...newUnit, type: value })}
                            >
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
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="floor">Kat</Label>
                            <Input
                                id="floor"
                                type="number"
                                value={newUnit.floor}
                                onChange={(e) => setNewUnit({ ...newUnit, floor: e.target.value })}
                                placeholder="10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Durum</Label>
                            <Select
                                value={newUnit.status}
                                onValueChange={(value) => setNewUnit({ ...newUnit, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Müsait</SelectItem>
                                    <SelectItem value="reserved">Rezerve</SelectItem>
                                    <SelectItem value="sold">Satıldı</SelectItem>
                                    <SelectItem value="rented">Kiralandı</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="size_sqft">Alan (sqft)</Label>
                            <Input
                                id="size_sqft"
                                type="number"
                                value={newUnit.size_sqft}
                                onChange={(e) => setNewUnit({ ...newUnit, size_sqft: e.target.value })}
                                placeholder="1200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="min_size_sqm">Min Alan (m²)</Label>
                            <Input
                                id="min_size_sqm"
                                type="number"
                                value={newUnit.min_size_sqm}
                                onChange={(e) => setNewUnit({ ...newUnit, min_size_sqm: e.target.value })}
                                placeholder="100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="max_size_sqm">Max Alan (m²)</Label>
                            <Input
                                id="max_size_sqm"
                                type="number"
                                value={newUnit.max_size_sqm}
                                onChange={(e) => setNewUnit({ ...newUnit, max_size_sqm: e.target.value })}
                                placeholder="150"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="view">Manzara</Label>
                            <Select
                                value={newUnit.view || undefined}
                                onValueChange={(value) => setNewUnit({ ...newUnit, view: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sea">Deniz</SelectItem>
                                    <SelectItem value="city">Şehir</SelectItem>
                                    <SelectItem value="garden">Bahçe</SelectItem>
                                    <SelectItem value="pool">Havuz</SelectItem>
                                    <SelectItem value="park">Park</SelectItem>
                                    <SelectItem value="marina">Marina</SelectItem>
                                    <SelectItem value="golf">Golf</SelectItem>
                                    <SelectItem value="other">Diğer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-5">
                        <div className="space-y-2">
                            <Label htmlFor="bedrooms">Yatak Odası</Label>
                            <Input
                                id="bedrooms"
                                type="number"
                                value={newUnit.bedrooms}
                                onChange={(e) => setNewUnit({ ...newUnit, bedrooms: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bathrooms">Banyo</Label>
                            <Input
                                id="bathrooms"
                                type="number"
                                value={newUnit.bathrooms}
                                onChange={(e) => setNewUnit({ ...newUnit, bathrooms: parseInt(e.target.value) || 1 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Fiyat</Label>
                            <Input
                                id="price"
                                type="number"
                                value={newUnit.price}
                                onChange={(e) => setNewUnit({ ...newUnit, price: e.target.value })}
                                placeholder="1500000"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="min_price">Min Fiyat</Label>
                            <Input
                                id="min_price"
                                type="number"
                                value={newUnit.min_price}
                                onChange={(e) => setNewUnit({ ...newUnit, min_price: e.target.value })}
                                placeholder="1000000"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="max_price">Max Fiyat</Label>
                            <Input
                                id="max_price"
                                type="number"
                                value={newUnit.max_price}
                                onChange={(e) => setNewUnit({ ...newUnit, max_price: e.target.value })}
                                placeholder="2000000"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="has_balcony"
                                checked={newUnit.has_balcony}
                                onCheckedChange={(checked) => setNewUnit({ ...newUnit, has_balcony: checked as boolean })}
                            />
                            <Label htmlFor="has_balcony">Balkon</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="has_parking"
                                checked={newUnit.has_parking}
                                onCheckedChange={(checked) => setNewUnit({ ...newUnit, has_parking: checked as boolean })}
                            />
                            <Label htmlFor="has_parking">Otopark</Label>
                        </div>
                    </div>

                    <Button type="button" onClick={addUnit} className="w-full">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Ünite Ekle
                    </Button>
                </div>
            </div>

            {units.length > 0 && (
                <>
                    <Separator />
                    <div>
                        <h3 className="mb-4 font-medium">Eklenen Üniteler ({units.length})</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ünite</TableHead>
                                    <TableHead>Tip</TableHead>
                                    <TableHead>Kat</TableHead>
                                    <TableHead>Alan</TableHead>
                                    <TableHead>Fiyat Aralığı</TableHead>
                                    <TableHead className="text-right">İşlem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {units.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell className="font-medium">{unit.unit_number}</TableCell>
                                        <TableCell className="uppercase">{unit.type}</TableCell>
                                        <TableCell>{unit.floor || '-'}</TableCell>
                                        <TableCell>
                                            {unit.min_size_sqm && unit.max_size_sqm
                                                ? `${unit.min_size_sqm}-${unit.max_size_sqm} m²`
                                                : unit.size_sqft
                                                  ? `${unit.size_sqft} sqft`
                                                  : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {unit.min_price && unit.max_price
                                                ? `${formatPrice(unit.min_price, currency)} - ${formatPrice(unit.max_price, currency)}`
                                                : unit.price
                                                  ? formatPrice(unit.price, currency)
                                                  : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeUnit(unit.id)}
                                            >
                                                <TrashIcon className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </div>
    );
}

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { type AmenityData } from '../../types';

interface AmenitiesStepProps {
    amenities: AmenityData[];
    setAmenities: (amenities: AmenityData[]) => void;
    errors: Record<string, string>;
}

export function AmenitiesStep({ amenities, setAmenities, errors }: AmenitiesStepProps) {
    const [newAmenity, setNewAmenity] = useState<Omit<AmenityData, 'id'>>({
        key: '',
        value: '',
        order: amenities.length,
    });

    const addAmenity = () => {
        if (!newAmenity.key || !newAmenity.value) {
            return;
        }

        setAmenities([
            ...amenities,
            {
                ...newAmenity,
                id: Date.now().toString(),
                order: amenities.length,
            },
        ]);

        setNewAmenity({
            key: '',
            value: '',
            order: amenities.length + 1,
        });
    };

    const removeAmenity = (id: string) => {
        setAmenities(amenities.filter((a) => a.id !== id));
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newAmenities = [...amenities];
        [newAmenities[index - 1], newAmenities[index]] = [newAmenities[index], newAmenities[index - 1]];
        // Update order values
        newAmenities.forEach((amenity, idx) => {
            amenity.order = idx;
        });
        setAmenities(newAmenities);
    };

    const moveDown = (index: number) => {
        if (index === amenities.length - 1) return;
        const newAmenities = [...amenities];
        [newAmenities[index], newAmenities[index + 1]] = [newAmenities[index + 1], newAmenities[index]];
        // Update order values
        newAmenities.forEach((amenity, idx) => {
            amenity.order = idx;
        });
        setAmenities(newAmenities);
    };

    return (
        <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
                Projenin özelliklerini key-value (anahtar-değer) çiftleri olarak ekleyin. Örneğin: "Havuz" - "Açık ve kapalı havuz", "Spor Salonu" - "Tam donanımlı fitness center"
            </div>

            <div className="rounded-lg border p-4">
                <h3 className="mb-4 font-medium">Yeni Özellik Ekle</h3>
                <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="amenity_key">Özellik Adı (Key) *</Label>
                            <Input
                                id="amenity_key"
                                value={newAmenity.key}
                                onChange={(e) => setNewAmenity({ ...newAmenity, key: e.target.value })}
                                placeholder="Örn: Havuz, Spor Salonu, Güvenlik"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amenity_value">Açıklama (Value) *</Label>
                            <Textarea
                                id="amenity_value"
                                className="min-h-[60px]"
                                value={newAmenity.value}
                                onChange={(e) => setNewAmenity({ ...newAmenity, value: e.target.value })}
                                placeholder="Örn: Açık ve kapalı havuz"
                            />
                        </div>
                    </div>
                    <Button type="button" onClick={addAmenity} className="w-full md:w-auto">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Özellik Ekle
                    </Button>
                </div>
            </div>

            {amenities.length > 0 && (
                <>
                    <div>
                        <h3 className="mb-4 font-medium">Eklenen Özellikler ({amenities.length})</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[60px]">Sıra</TableHead>
                                    <TableHead>Özellik</TableHead>
                                    <TableHead>Açıklama</TableHead>
                                    <TableHead className="text-right w-[120px]">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {amenities.map((amenity, index) => (
                                    <TableRow key={amenity.id}>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => moveUp(index)}
                                                    disabled={index === 0}
                                                    className="h-6 px-2"
                                                >
                                                    ↑
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => moveDown(index)}
                                                    disabled={index === amenities.length - 1}
                                                    className="h-6 px-2"
                                                >
                                                    ↓
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{amenity.key}</TableCell>
                                        <TableCell className="max-w-md truncate">{amenity.value}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeAmenity(amenity.id)}
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

            {errors.project_amenities && (
                <InputError message={errors.project_amenities} />
            )}
        </div>
    );
}

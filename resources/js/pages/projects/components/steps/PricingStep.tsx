import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type StepProps } from '../../types';

export function PricingStep({ projectData, updateProjectData, errors }: StepProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="min_price">Minimum Fiyat</Label>
                    <Input
                        id="min_price"
                        type="number"
                        value={projectData.min_price}
                        onChange={(e) => updateProjectData('min_price', e.target.value)}
                        placeholder="500000"
                    />
                    <InputError message={errors.min_price} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="max_price">Maximum Fiyat</Label>
                    <Input
                        id="max_price"
                        type="number"
                        value={projectData.max_price}
                        onChange={(e) => updateProjectData('max_price', e.target.value)}
                        placeholder="5000000"
                    />
                    <InputError message={errors.max_price} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="currency">Para Birimi</Label>
                    <Select
                        value={projectData.currency}
                        onValueChange={(value) => updateProjectData('currency', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="AED">AED</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="TRY">TRY</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="status">Proje Durumu</Label>
                    <Select
                        value={projectData.status}
                        onValueChange={(value) => updateProjectData('status', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="planning">Planlama</SelectItem>
                            <SelectItem value="under_construction">İnşaat Halinde</SelectItem>
                            <SelectItem value="completed">Tamamlandı</SelectItem>
                            <SelectItem value="sold_out">Tükendi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="completion_date">Tamamlanma Tarihi</Label>
                    <Input
                        id="completion_date"
                        type="date"
                        value={projectData.completion_date}
                        onChange={(e) => updateProjectData('completion_date', e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="delivery_status">Teslim Durumu</Label>
                <Input
                    id="delivery_status"
                    value={projectData.delivery_status}
                    onChange={(e) => updateProjectData('delivery_status', e.target.value)}
                    placeholder="Örn: Ready to Move, Q4 2025"
                />
                <InputError message={errors.delivery_status} />
            </div>

            <div className="flex gap-6">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="is_featured"
                        checked={projectData.is_featured}
                        onCheckedChange={(checked) => updateProjectData('is_featured', checked as boolean)}
                    />
                    <Label htmlFor="is_featured">Öne Çıkan Proje</Label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="is_active"
                        checked={projectData.is_active}
                        onCheckedChange={(checked) => updateProjectData('is_active', checked as boolean)}
                    />
                    <Label htmlFor="is_active">Aktif</Label>
                </div>
            </div>
        </div>
    );
}

import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { type StepProps } from '../../types';

export function DetailsStep({ projectData, updateProjectData, errors }: StepProps) {
    return (
        <div className="space-y-6">
            {/* Citizenship & Housing */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium">Vatandaşlık ve Konut Bilgileri</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="citizenship_eligibility">Vatandaşlık Durumu</Label>
                        <Select
                            value={projectData.citizenship_eligibility}
                            onValueChange={(value) => updateProjectData('citizenship_eligibility', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="eligible">Uygun</SelectItem>
                                <SelectItem value="not_eligible">Uygun Değil</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.citizenship_eligibility} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="is_government_housing"
                            checked={projectData.is_government_housing}
                            onCheckedChange={(checked) => updateProjectData('is_government_housing', checked as boolean)}
                        />
                        <Label htmlFor="is_government_housing">Emlak Konut</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="has_title_deed"
                            checked={projectData.has_title_deed}
                            onCheckedChange={(checked) => updateProjectData('has_title_deed', checked as boolean)}
                        />
                        <Label htmlFor="has_title_deed">Tapu</Label>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Project Types */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium">Proje Tipleri</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="unit_type">Daire Tipi</Label>
                        <Input
                            id="unit_type"
                            value={projectData.unit_type}
                            onChange={(e) => updateProjectData('unit_type', e.target.value)}
                            placeholder="Örn: Residence, Villa"
                        />
                        <InputError message={errors.unit_type} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="project_type">Proje Tipi</Label>
                        <Input
                            id="project_type"
                            value={projectData.project_type}
                            onChange={(e) => updateProjectData('project_type', e.target.value)}
                            placeholder="Örn: Residential, Mixed-use"
                        />
                        <InputError message={errors.project_type} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="view_type">Manzara</Label>
                        <Input
                            id="view_type"
                            value={projectData.view_type}
                            onChange={(e) => updateProjectData('view_type', e.target.value)}
                            placeholder="Örn: Sea, City, Garden"
                        />
                        <InputError message={errors.view_type} />
                    </div>
                </div>
            </div>

            <Separator />

            {/* Rental Guarantee */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="has_rental_guarantee"
                        checked={projectData.has_rental_guarantee}
                        onCheckedChange={(checked) => updateProjectData('has_rental_guarantee', checked as boolean)}
                    />
                    <Label htmlFor="has_rental_guarantee" className="font-medium">
                        Kira Garantisi Var
                    </Label>
                </div>
                {projectData.has_rental_guarantee && (
                    <div className="grid gap-4 md:grid-cols-2 pl-6">
                        <div className="space-y-2">
                            <Label htmlFor="rental_guarantee_years">Kira Garantisi Süresi (Yıl) *</Label>
                            <Input
                                id="rental_guarantee_years"
                                type="number"
                                value={projectData.rental_guarantee_years}
                                onChange={(e) => updateProjectData('rental_guarantee_years', e.target.value)}
                                placeholder="Örn: 3"
                                min="1"
                                required={projectData.has_rental_guarantee}
                            />
                            <InputError message={errors.rental_guarantee_years} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rental_guarantee_rate">Kira Garantisi Oranı (%) *</Label>
                            <Input
                                id="rental_guarantee_rate"
                                type="number"
                                step="0.01"
                                value={projectData.rental_guarantee_rate}
                                onChange={(e) => updateProjectData('rental_guarantee_rate', e.target.value)}
                                placeholder="Örn: 7.5"
                                min="0"
                                max="100"
                                required={projectData.has_rental_guarantee}
                            />
                            <InputError message={errors.rental_guarantee_rate} />
                        </div>
                    </div>
                )}
            </div>

            <Separator />

            {/* Buyback Guarantee */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="has_buyback_guarantee"
                        checked={projectData.has_buyback_guarantee}
                        onCheckedChange={(checked) => updateProjectData('has_buyback_guarantee', checked as boolean)}
                    />
                    <Label htmlFor="has_buyback_guarantee" className="font-medium">
                        Geri Satın Alma Garantisi Var
                    </Label>
                </div>
                {projectData.has_buyback_guarantee && (
                    <div className="grid gap-4 md:grid-cols-1 pl-6">
                        <div className="space-y-2">
                            <Label htmlFor="buyback_guarantee_rate">Geri Satın Alma Oranı (%) *</Label>
                            <Input
                                id="buyback_guarantee_rate"
                                type="number"
                                step="0.01"
                                value={projectData.buyback_guarantee_rate}
                                onChange={(e) => updateProjectData('buyback_guarantee_rate', e.target.value)}
                                placeholder="Örn: 120"
                                min="0"
                                required={projectData.has_buyback_guarantee}
                            />
                            <InputError message={errors.buyback_guarantee_rate} />
                        </div>
                    </div>
                )}
            </div>

            <Separator />

            {/* Payment Plan */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium">Ödeme Planı</h3>
                <div className="space-y-2">
                    <Label htmlFor="payment_plan">Ödeme Planı</Label>
                    <Select
                        value={projectData.payment_plan}
                        onValueChange={(value) => updateProjectData('payment_plan', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">Peşin</SelectItem>
                            <SelectItem value="installment">Taksit</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.payment_plan} />
                </div>

                {projectData.payment_plan === 'installment' && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="down_payment_amount">Peşinat Tutarı *</Label>
                            <Input
                                id="down_payment_amount"
                                type="number"
                                step="0.01"
                                value={projectData.down_payment_amount}
                                onChange={(e) => updateProjectData('down_payment_amount', e.target.value)}
                                placeholder="Peşinat miktarı"
                                min="0"
                                required={projectData.payment_plan === 'installment'}
                            />
                            <InputError message={errors.down_payment_amount} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="installment_months">Taksit Süresi (Ay) *</Label>
                            <Input
                                id="installment_months"
                                type="number"
                                value={projectData.installment_months}
                                onChange={(e) => updateProjectData('installment_months', e.target.value)}
                                placeholder="Örn: 36"
                                min="1"
                                required={projectData.payment_plan === 'installment'}
                            />
                            <InputError message={errors.installment_months} />
                        </div>
                    </div>
                )}
            </div>

            <Separator />

            {/* VAT */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium">KDV ve Komisyon</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="vat_included"
                                checked={projectData.vat_included}
                                onCheckedChange={(checked) => updateProjectData('vat_included', checked as boolean)}
                            />
                            <Label htmlFor="vat_included">KDV Dahil</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vat_rate">KDV Oranı (%)</Label>
                            <Input
                                id="vat_rate"
                                type="number"
                                step="0.01"
                                value={projectData.vat_rate}
                                onChange={(e) => updateProjectData('vat_rate', e.target.value)}
                                placeholder="Örn: 18"
                                min="0"
                                max="100"
                            />
                            <InputError message={errors.vat_rate} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="commission_included"
                                checked={projectData.commission_included}
                                onCheckedChange={(checked) => updateProjectData('commission_included', checked as boolean)}
                            />
                            <Label htmlFor="commission_included">Komisyon Dahil</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="commission_rate">Komisyon Oranı (%)</Label>
                            <Input
                                id="commission_rate"
                                type="number"
                                step="0.01"
                                value={projectData.commission_rate}
                                onChange={(e) => updateProjectData('commission_rate', e.target.value)}
                                placeholder="Örn: 2"
                                min="0"
                                max="100"
                            />
                            <InputError message={errors.commission_rate} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

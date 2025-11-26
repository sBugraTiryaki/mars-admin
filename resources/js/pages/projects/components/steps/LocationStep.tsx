import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type StepProps } from '../../types';

export function LocationStep({ projectData, updateProjectData, errors }: StepProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="country">Ülke *</Label>
                    <Input
                        id="country"
                        value={projectData.country}
                        onChange={(e) => updateProjectData('country', e.target.value)}
                        placeholder="Örn: UAE"
                    />
                    <InputError message={errors.country} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">Şehir *</Label>
                    <Input
                        id="city"
                        value={projectData.city}
                        onChange={(e) => updateProjectData('city', e.target.value)}
                        placeholder="Örn: Dubai"
                        required
                    />
                    <InputError message={errors.city} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Bölge/Alan *</Label>
                    <Input
                        id="location"
                        value={projectData.location}
                        onChange={(e) => updateProjectData('location', e.target.value)}
                        placeholder="Örn: Dubai Marina"
                        required
                    />
                    <InputError message={errors.location} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="district">İlçe</Label>
                    <Input
                        id="district"
                        value={projectData.district}
                        onChange={(e) => updateProjectData('district', e.target.value)}
                        placeholder="İlçe"
                    />
                    <InputError message={errors.district} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="neighborhood">Mahalle</Label>
                    <Input
                        id="neighborhood"
                        value={projectData.neighborhood}
                        onChange={(e) => updateProjectData('neighborhood', e.target.value)}
                        placeholder="Mahalle"
                    />
                    <InputError message={errors.neighborhood} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="street">Sokak</Label>
                    <Input
                        id="street"
                        value={projectData.street}
                        onChange={(e) => updateProjectData('street', e.target.value)}
                        placeholder="Sokak adı"
                    />
                    <InputError message={errors.street} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="building_no">Bina No</Label>
                    <Input
                        id="building_no"
                        value={projectData.building_no}
                        onChange={(e) => updateProjectData('building_no', e.target.value)}
                        placeholder="Bina numarası"
                    />
                    <InputError message={errors.building_no} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address_details">Adres Detayları</Label>
                <Textarea
                    id="address_details"
                    className="min-h-[100px]"
                    value={projectData.address_details}
                    onChange={(e) => updateProjectData('address_details', e.target.value)}
                    placeholder="Ek adres bilgileri, tarif, landmark vb."
                />
                <InputError message={errors.address_details} />
            </div>
        </div>
    );
}

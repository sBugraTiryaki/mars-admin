import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type StepProps } from '../../types';

export function BasicInfoStep({ projectData, updateProjectData, errors }: StepProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Proje Adı *</Label>
                    <Input
                        id="name"
                        value={projectData.name}
                        onChange={(e) => updateProjectData('name', e.target.value)}
                        placeholder="Örn: Marina Heights Tower"
                        required
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="public_name">Proje Temsili Adı</Label>
                    <Input
                        id="public_name"
                        value={projectData.public_name}
                        onChange={(e) => updateProjectData('public_name', e.target.value)}
                        placeholder="Public view için görünecek isim"
                    />
                    <InputError message={errors.public_name} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="developer">İnşaat Firması *</Label>
                    <Input
                        id="developer"
                        value={projectData.developer}
                        onChange={(e) => updateProjectData('developer', e.target.value)}
                        placeholder="Örn: Emaar Properties"
                        required
                    />
                    <InputError message={errors.developer} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="construction_company">İnşaat Firması (İkincil)</Label>
                    <Input
                        id="construction_company"
                        value={projectData.construction_company}
                        onChange={(e) => updateProjectData('construction_company', e.target.value)}
                        placeholder="Opsiyonel"
                    />
                    <InputError message={errors.construction_company} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="marketing_company">Pazarlama Firması</Label>
                    <Input
                        id="marketing_company"
                        value={projectData.marketing_company}
                        onChange={(e) => updateProjectData('marketing_company', e.target.value)}
                        placeholder="Pazarlama firması"
                    />
                    <InputError message={errors.marketing_company} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                    id="description"
                    className="min-h-[100px]"
                    value={projectData.description}
                    onChange={(e) => updateProjectData('description', e.target.value)}
                    placeholder="Kısa açıklama..."
                />
                <InputError message={errors.description} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="overview">Proje Hakkında (Overview)</Label>
                <Textarea
                    id="overview"
                    className="min-h-[150px]"
                    value={projectData.overview}
                    onChange={(e) => updateProjectData('overview', e.target.value)}
                    placeholder="Proje hakkında detaylı bilgi, özellikler, benzersiz satış noktaları..."
                />
                <InputError message={errors.overview} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="hero_title">Hero Bölüm Başlığı</Label>
                    <Input
                        id="hero_title"
                        value={projectData.hero_title}
                        onChange={(e) => updateProjectData('hero_title', e.target.value)}
                        placeholder="Ana sayfa hero başlığı"
                    />
                    <InputError message={errors.hero_title} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hero_subtitle">Hero Bölüm Alt Başlığı</Label>
                    <Textarea
                        id="hero_subtitle"
                        className="min-h-[60px]"
                        value={projectData.hero_subtitle}
                        onChange={(e) => updateProjectData('hero_subtitle', e.target.value)}
                        placeholder="Ana sayfa hero alt başlığı"
                    />
                    <InputError message={errors.hero_subtitle} />
                </div>
            </div>
        </div>
    );
}

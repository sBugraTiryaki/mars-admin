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
                <Label htmlFor="overview">Proje Hakkında (Overview) - Varsayılan</Label>
                <Textarea
                    id="overview"
                    className="min-h-[150px]"
                    value={projectData.overview}
                    onChange={(e) => updateProjectData('overview', e.target.value)}
                    placeholder="Proje hakkında detaylı bilgi (varsayılan dil)"
                />
                <InputError message={errors.overview} />
            </div>

            <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-medium">Çeviriler - Translations - الترجمات</h3>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="overview_tr">Proje Hakkında (Türkçe)</Label>
                        <Textarea
                            id="overview_tr"
                            className="min-h-[120px]"
                            value={projectData.overview_tr}
                            onChange={(e) => updateProjectData('overview_tr', e.target.value)}
                            placeholder="Proje hakkında (Türkçe)"
                        />
                        <InputError message={errors.overview_tr} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="overview_en">About Project (English)</Label>
                        <Textarea
                            id="overview_en"
                            className="min-h-[120px]"
                            value={projectData.overview_en}
                            onChange={(e) => updateProjectData('overview_en', e.target.value)}
                            placeholder="About the project (English)"
                        />
                        <InputError message={errors.overview_en} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="overview_ar">نبذة عن المشروع (العربية)</Label>
                        <Textarea
                            id="overview_ar"
                            className="min-h-[120px]"
                            dir="rtl"
                            value={projectData.overview_ar}
                            onChange={(e) => updateProjectData('overview_ar', e.target.value)}
                            placeholder="نبذة عن المشروع (العربية)"
                        />
                        <InputError message={errors.overview_ar} />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="hero_title_tr">Hero Başlığı (Türkçe)</Label>
                        <Input
                            id="hero_title_tr"
                            value={projectData.hero_title_tr}
                            onChange={(e) => updateProjectData('hero_title_tr', e.target.value)}
                            placeholder="Ana başlık (Türkçe)"
                        />
                        <InputError message={errors.hero_title_tr} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hero_title_en">Hero Title (English)</Label>
                        <Input
                            id="hero_title_en"
                            value={projectData.hero_title_en}
                            onChange={(e) => updateProjectData('hero_title_en', e.target.value)}
                            placeholder="Main title (English)"
                        />
                        <InputError message={errors.hero_title_en} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hero_title_ar">عنوان البطل (العربية)</Label>
                        <Input
                            id="hero_title_ar"
                            dir="rtl"
                            value={projectData.hero_title_ar}
                            onChange={(e) => updateProjectData('hero_title_ar', e.target.value)}
                            placeholder="العنوان الرئيسي (العربية)"
                        />
                        <InputError message={errors.hero_title_ar} />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="hero_subtitle_tr">Hero Alt Başlık (Türkçe)</Label>
                        <Textarea
                            id="hero_subtitle_tr"
                            className="min-h-[60px]"
                            value={projectData.hero_subtitle_tr}
                            onChange={(e) => updateProjectData('hero_subtitle_tr', e.target.value)}
                            placeholder="Alt başlık (Türkçe)"
                        />
                        <InputError message={errors.hero_subtitle_tr} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hero_subtitle_en">Hero Subtitle (English)</Label>
                        <Textarea
                            id="hero_subtitle_en"
                            className="min-h-[60px]"
                            value={projectData.hero_subtitle_en}
                            onChange={(e) => updateProjectData('hero_subtitle_en', e.target.value)}
                            placeholder="Subtitle (English)"
                        />
                        <InputError message={errors.hero_subtitle_en} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hero_subtitle_ar">العنوان الفرعي (العربية)</Label>
                        <Textarea
                            id="hero_subtitle_ar"
                            className="min-h-[60px]"
                            dir="rtl"
                            value={projectData.hero_subtitle_ar}
                            onChange={(e) => updateProjectData('hero_subtitle_ar', e.target.value)}
                            placeholder="العنوان الفرعي (العربية)"
                        />
                        <InputError message={errors.hero_subtitle_ar} />
                    </div>
                </div>
            </div>
        </div>
    );
}

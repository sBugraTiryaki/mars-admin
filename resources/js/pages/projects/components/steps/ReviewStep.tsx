import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type AmenityData, type ProjectFormData, type UnitData } from '../../types';

interface ReviewStepProps {
    projectData: ProjectFormData;
    units: UnitData[];
    amenities: AmenityData[];
}

export function ReviewStep({ projectData, units, amenities }: ReviewStepProps) {
    const formatPrice = (price: string, currency: string) => {
        if (!price) return '-';
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Temel Bilgiler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Proje Adı:</span>
                            <span className="font-medium">{projectData.name}</span>
                        </div>
                        {projectData.public_name && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Temsili Ad:</span>
                                <span>{projectData.public_name}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">İnşaat Firması:</span>
                            <span>{projectData.developer}</span>
                        </div>
                        {projectData.construction_company && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">İnşaat (İkincil):</span>
                                <span>{projectData.construction_company}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Konum</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Lokasyon:</span>
                            <span>{projectData.location}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Şehir:</span>
                            <span>{projectData.city}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Ülke:</span>
                            <span>{projectData.country}</span>
                        </div>
                        {projectData.district && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">İlçe:</span>
                                <span>{projectData.district}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Fiyatlandırma</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Fiyat Aralığı:</span>
                            <span>
                                {formatPrice(projectData.min_price, projectData.currency)} -{' '}
                                {formatPrice(projectData.max_price, projectData.currency)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Durum:</span>
                            <Badge variant="outline" className="capitalize">
                                {projectData.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Para Birimi:</span>
                            <span>{projectData.currency}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Özellikler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Vatandaşlık:</span>
                            <Badge variant={projectData.citizenship_eligibility === 'eligible' ? 'default' : 'secondary'}>
                                {projectData.citizenship_eligibility === 'eligible' ? 'Uygun' : 'Uygun Değil'}
                            </Badge>
                        </div>
                        {projectData.is_government_housing && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Emlak Konut:</span>
                                <Badge>Evet</Badge>
                            </div>
                        )}
                        {projectData.has_title_deed && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tapu:</span>
                                <Badge>Var</Badge>
                            </div>
                        )}
                        {projectData.has_rental_guarantee && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kira Garantisi:</span>
                                <span>{projectData.rental_guarantee_years} yıl</span>
                            </div>
                        )}
                        {projectData.has_buyback_guarantee && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Geri Satın Alma:</span>
                                <span>%{projectData.buyback_value_loss_percentage}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {amenities.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Özellikler ({amenities.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-2">
                            {amenities.map((amenity) => (
                                <div key={amenity.id} className="flex flex-col gap-1">
                                    <span className="text-sm font-medium">{amenity.key}</span>
                                    <span className="text-xs text-muted-foreground">{amenity.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {units.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Üniteler ({units.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {units.map((unit) => (
                                <Badge key={unit.id} variant="secondary">
                                    {unit.unit_number} - {unit.type.toUpperCase()}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

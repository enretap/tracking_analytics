import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Building2, Image, Globe, Tag } from 'lucide-react';

interface Account {
    id: number;
    name: string;
    domain?: string;
    reference_ctrack?: string;
    logo?: string;
    platforms?: { id: number }[];
}

interface Platform {
    id: number;
    name: string;
}

interface Props {
    account: Account;
    platforms: Platform[];
}

export default function EditAccount({ account, platforms }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: account.name || '',
        domain: account.domain || '',
        reference_ctrack: account.reference_ctrack || '',
        logo: null as File | null,
        platform_ids: account.platforms?.map(p => p.id) || [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/settings/accounts/${account.id}`, {
            forceFormData: true,
        });
    };

    const togglePlatform = (platformId: number) => {
        if (data.platform_ids.includes(platformId)) {
            setData('platform_ids', data.platform_ids.filter(id => id !== platformId));
        } else {
            setData('platform_ids', [...data.platform_ids, platformId]);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Paramètres', href: '/settings' },
            { title: 'Comptes', href: '/settings/accounts' },
            { title: account.name, href: `/settings/accounts/${account.id}` },
            { title: 'Modifier', href: `/settings/accounts/${account.id}/edit` }
        ]}>
            <Head title={`Modifier ${account.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/settings/accounts">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Modifier {account.name}
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Modifiez les informations du compte
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Informations du compte
                        </CardTitle>
                        <CardDescription>
                            Modifiez le compte et ses plateformes associées
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom du compte</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Compte principal"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="domain" className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    Domaine d'activité
                                </Label>
                                <Input
                                    id="domain"
                                    type="text"
                                    value={data.domain}
                                    onChange={(e) => setData('domain', e.target.value)}
                                    placeholder="Transport, Logistique, etc."
                                />
                                {errors.domain && (
                                    <p className="text-sm text-red-600">{errors.domain}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reference_ctrack" className="flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Référence CTRACK
                                </Label>
                                <Input
                                    id="reference_ctrack"
                                    type="text"
                                    value={data.reference_ctrack}
                                    onChange={(e) => setData('reference_ctrack', e.target.value)}
                                    placeholder="Référence du compte sur CTRACK"
                                />
                                {errors.reference_ctrack && (
                                    <p className="text-sm text-red-600">{errors.reference_ctrack}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="logo" className="flex items-center gap-2">
                                    <Image className="h-4 w-4" />
                                    Logo du compte
                                </Label>
                                {account.logo && !data.logo && (
                                    <div className="mb-2">
                                        <img 
                                            src={`/storage/${account.logo}`} 
                                            alt="Logo actuel" 
                                            className="h-16 w-auto rounded border border-gray-200"
                                        />
                                        <p className="text-sm text-gray-600 mt-1">Logo actuel</p>
                                    </div>
                                )}
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('logo', e.target.files?.[0] || null)}
                                />
                                {data.logo && (
                                    <p className="text-sm text-gray-600">Nouveau fichier sélectionné : {data.logo.name}</p>
                                )}
                                {errors.logo && (
                                    <p className="text-sm text-red-600">{errors.logo}</p>
                                )}
                            </div>

                            {platforms.length > 0 && (
                                <div className="space-y-3">
                                    <Label>Plateformes associées</Label>
                                    <div className="space-y-2">
                                        {platforms.map((platform) => (
                                            <div key={platform.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`platform-${platform.id}`}
                                                    checked={data.platform_ids.includes(platform.id)}
                                                    onCheckedChange={() => togglePlatform(platform.id)}
                                                />
                                                <label
                                                    htmlFor={`platform-${platform.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {platform.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.platform_ids && (
                                        <p className="text-sm text-red-600">{errors.platform_ids}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/settings/accounts">Annuler</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

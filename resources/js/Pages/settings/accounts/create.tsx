import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Building2 } from 'lucide-react';

interface Platform {
    id: number;
    name: string;
}

interface Props {
    platforms: Platform[];
}

export default function CreateAccount({ platforms }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        platform_ids: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/accounts');
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
            { title: 'Créer', href: '/settings/accounts/create' }
        ]}>
            <Head title="Créer un compte" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/settings/accounts">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Créer un compte
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Ajoutez un nouveau compte de plateforme
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
                            Configurez le compte et associez-le à des plateformes
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
                                    {processing ? 'Création en cours...' : 'Créer le compte'}
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

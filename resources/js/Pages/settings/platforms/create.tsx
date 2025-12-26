import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Server } from 'lucide-react';

export default function CreatePlatform() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'telematics',
        provider: '',
        api_url: '',
        api_key: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/platforms');
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Paramètres', href: '/settings' },
            { title: 'Plateformes', href: '/settings/platforms' },
            { title: 'Créer', href: '/settings/platforms/create' }
        ]}>
            <Head title="Créer une plateforme" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/settings/platforms">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Créer une plateforme
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Ajoutez une nouvelle plateforme de télématique
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5" />
                            Informations de la plateforme
                        </CardTitle>
                        <CardDescription>
                            Configurez les paramètres de connexion à la plateforme
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom de la plateforme</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="TARGE TELEMATICS"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) => setData('type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="telematics">Télématique</SelectItem>
                                        <SelectItem value="gps">GPS</SelectItem>
                                        <SelectItem value="fleet">Gestion de flotte</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-sm text-red-600">{errors.type}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="provider">Fournisseur</Label>
                                <Input
                                    id="provider"
                                    type="text"
                                    value={data.provider}
                                    onChange={(e) => setData('provider', e.target.value)}
                                    placeholder="TARGE"
                                    required
                                />
                                {errors.provider && (
                                    <p className="text-sm text-red-600">{errors.provider}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="api_url">URL de l'API</Label>
                                <Input
                                    id="api_url"
                                    type="url"
                                    value={data.api_url}
                                    onChange={(e) => setData('api_url', e.target.value)}
                                    placeholder="https://api.example.com"
                                    required
                                />
                                {errors.api_url && (
                                    <p className="text-sm text-red-600">{errors.api_url}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="api_key">Clé API</Label>
                                <Input
                                    id="api_key"
                                    type="password"
                                    value={data.api_key}
                                    onChange={(e) => setData('api_key', e.target.value)}
                                    placeholder="••••••••••••••••"
                                    required
                                />
                                {errors.api_key && (
                                    <p className="text-sm text-red-600">{errors.api_key}</p>
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    La clé sera stockée de manière sécurisée
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Création en cours...' : 'Créer la plateforme'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/settings/platforms">Annuler</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

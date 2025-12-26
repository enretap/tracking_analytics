import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface Platform {
    id: number;
    name: string;
    type?: string;
    provider?: string;
    is_active?: boolean;
    created_at?: string;
}

interface Props {
    platforms: Platform[];
}

const deletePlatform = (platformId: number, platformName: string) => {
    if (confirm(`Voulez-vous vraiment supprimer la plateforme "${platformName}" ?`)) {
        router.delete(`/settings/platforms/${platformId}`);
    }
};

export default function PlatformsIndex({ platforms }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Paramètres', href: '/settings' },
            { title: 'Plateformes', href: '/settings/platforms' }
        ]}>
            <Head title="Plateformes" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Plateformes
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Gérez vos plateformes de télématique
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/settings/platforms/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvelle plateforme
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5" />
                            Plateformes configurées ({platforms.length})
                        </CardTitle>
                        <CardDescription>
                            Liste de toutes les plateformes de télématique disponibles
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {platforms && platforms.length > 0 ? (
                            <div className="space-y-3">
                                {platforms.map((platform) => (
                                    <div
                                        key={platform.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {platform.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    {platform.provider && (
                                                        <>
                                                            <span>{platform.provider}</span>
                                                            <span>•</span>
                                                        </>
                                                    )}
                                                    {platform.type && (
                                                        <>
                                                            <Badge variant="outline">{platform.type}</Badge>
                                                            <span>•</span>
                                                        </>
                                                    )}
                                                    {platform.is_active !== undefined && (
                                                        <Badge variant={platform.is_active ? 'default' : 'secondary'}>
                                                            {platform.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/settings/platforms/${platform.id}`}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Voir
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/settings/platforms/${platform.id}/edit`}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Éditer
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => deletePlatform(platform.id, platform.name)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Server className="h-12 w-12 text-gray-300 dark:text-gray-700" />
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    Aucune plateforme configurée
                                </p>
                                <Button asChild className="mt-4" size="sm">
                                    <Link href="/settings/platforms/create">
                                        Créer votre première plateforme
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

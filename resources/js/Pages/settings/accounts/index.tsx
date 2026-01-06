import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface Platform {
    id: number;
    name: string;
}

interface Account {
    id: number;
    name: string;
    logo?: string;
    platforms?: Platform[];
    created_at?: string;
}

interface Props {
    accounts: Account[];
}

const deleteAccount = (accountId: number, accountName: string) => {
    if (confirm(`Voulez-vous vraiment supprimer le compte "${accountName}" ?`)) {
        router.delete(`/settings/accounts/${accountId}`);
    }
};

export default function AccountsIndex({ accounts }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Paramètres', href: '/settings' },
            { title: 'Comptes', href: '/settings/accounts' }
        ]}>
            <Head title="Comptes" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Comptes
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Gérez vos comptes de plateforme
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/settings/accounts/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau compte
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Comptes configurés ({accounts.length})
                        </CardTitle>
                        <CardDescription>
                            Liste de tous les comptes clients avec leurs plateformes associées
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {accounts && accounts.length > 0 ? (
                            <div className="space-y-3">
                                {accounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 overflow-hidden">
                                                {account.logo ? (
                                                    <img 
                                                        src={`/storage/${account.logo}`} 
                                                        alt={account.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {account.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    {account.platforms && account.platforms.length > 0 ? (
                                                        <>
                                                            <span>{account.platforms.length} plateforme{account.platforms.length > 1 ? 's' : ''}</span>
                                                            <span>•</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {account.platforms.slice(0, 3).map((platform) => (
                                                                    <Badge key={platform.id} variant="secondary" className="text-xs">
                                                                        {platform.name}
                                                                    </Badge>
                                                                ))}
                                                                {account.platforms.length > 3 && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        +{account.platforms.length - 3}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="text-amber-600 dark:text-amber-400">Aucune plateforme</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/settings/accounts/${account.id}`}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Voir
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/settings/accounts/${account.id}/edit`}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Éditer
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => deleteAccount(account.id, account.name)}
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
                                <Building2 className="h-12 w-12 text-gray-300 dark:text-gray-700" />
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    Aucun compte configuré
                                </p>
                                <Button asChild className="mt-4" size="sm">
                                    <Link href="/settings/accounts/create">
                                        Créer votre premier compte
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

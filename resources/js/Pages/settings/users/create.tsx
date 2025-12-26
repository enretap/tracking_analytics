import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Mail } from 'lucide-react';

interface Account {
    id: number;
    name: string;
}

interface Props {
    accounts: Account[];
}

export default function UsersCreate({ accounts }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 'agent',
        account_id: accounts.length === 1 ? accounts[0].id : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/users');
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Paramètres', href: '/settings' },
            { title: 'Utilisateurs', href: '/settings/users' },
            { title: 'Inviter', href: '/settings/users/create' }
        ]}>
            <Head title="Inviter un utilisateur" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/settings/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Inviter un utilisateur
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Envoyez une invitation par email
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Informations de l'utilisateur
                        </CardTitle>
                        <CardDescription>
                            L'utilisateur recevra un email avec un lien pour créer son compte
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom complet</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Jean Dupont"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="jean.dupont@example.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Rôle</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) => setData('role', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un rôle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="agent">Agent</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="super-admin">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-sm text-red-600">{errors.role}</p>
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {data.role === 'super-admin' && 'Accès complet à toutes les fonctionnalités'}
                                    {data.role === 'admin' && 'Peut gérer les utilisateurs de son compte'}
                                    {data.role === 'agent' && 'Accès en lecture seule aux rapports'}
                                </p>
                            </div>

                            {accounts.length > 1 && (
                                <div className="space-y-2">
                                    <Label htmlFor="account_id">Compte</Label>
                                    <Select
                                        value={data.account_id?.toString() || ''}
                                        onValueChange={(value) => setData('account_id', parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un compte" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((account) => (
                                                <SelectItem key={account.id} value={account.id.toString()}>
                                                    {account.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.account_id && (
                                        <p className="text-sm text-red-600">{errors.account_id}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/settings/users">Annuler</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

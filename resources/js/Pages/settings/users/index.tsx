import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, UserPlus, Clock, XCircle, RefreshCw } from 'lucide-react';

interface Account {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    account_id?: number;
    account?: Account;
    created_at: string;
}

interface Invitation {
    id: number;
    email: string;
    role: string;
    account_id?: number;
    account?: Account;
    created_at: string;
    expires_at: string;
}

interface Props {
    users: User[];
    invitations: Invitation[];
}

const getRoleBadge = (role: string) => {
    switch (role) {
        case 'super-admin':
            return <Badge className="bg-purple-500">Super Admin</Badge>;
        case 'admin':
            return <Badge className="bg-blue-500">Admin</Badge>;
        case 'agent':
            return <Badge variant="secondary">Agent</Badge>;
        default:
            return <Badge variant="outline">{role}</Badge>;
    }
};

const resendInvitation = (invitationId: number) => {
    router.post(`/settings/users/invitations/${invitationId}/resend`, {}, {
        preserveScroll: true,
    });
};

const cancelInvitation = (invitationId: number) => {
    if (confirm('Voulez-vous vraiment annuler cette invitation ?')) {
        router.delete(`/settings/users/invitations/${invitationId}`, {
            preserveScroll: true,
        });
    }
};

const deleteUser = (userId: number) => {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
        router.delete(`/settings/users/${userId}`);
    }
};

export default function UsersIndex({ users, invitations }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Paramètres', href: '/settings' },
            { title: 'Utilisateurs', href: '/settings/users' }
        ]}>
            <Head title="Gestion des utilisateurs" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Gestion des utilisateurs
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Gérez les utilisateurs et les invitations
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/settings/users/create">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Inviter un utilisateur
                        </Link>
                    </Button>
                </div>

                {/* Invitations en attente */}
                {invitations.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Invitations en attente ({invitations.length})
                            </CardTitle>
                            <CardDescription>
                                Ces utilisateurs n'ont pas encore accepté leur invitation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {invitations.map((invitation) => (
                                    <div
                                        key={invitation.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                                                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {invitation.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    {getRoleBadge(invitation.role)}
                                                    {invitation.account && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{invitation.account.name}</span>
                                                        </>
                                                    )}
                                                    <span>•</span>
                                                    <span>
                                                        Expire le {new Date(invitation.expires_at).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => resendInvitation(invitation.id)}
                                            >
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Renvoyer
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => cancelInvitation(invitation.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Liste des utilisateurs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Utilisateurs actifs ({users.length})
                        </CardTitle>
                        <CardDescription>
                            Liste de tous les utilisateurs de votre organisation
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {users.length > 0 ? (
                            <div className="space-y-3">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>{user.email}</span>
                                                    <span>•</span>
                                                    {getRoleBadge(user.role)}
                                                    {user.account && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{user.account.name}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`/settings/users/${user.id}/edit`}>
                                                    Modifier
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => deleteUser(user.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="h-12 w-12 text-gray-300 dark:text-gray-700" />
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    Aucun utilisateur pour le moment
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

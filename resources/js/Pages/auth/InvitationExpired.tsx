import { Head, Link } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { AlertCircle } from 'lucide-react';

interface InvitationExpiredProps {
    email: string;
}

export default function InvitationExpired({ email }: InvitationExpiredProps) {
    return (
        <AuthLayout>
            <Head title="Invitation expirée" />

            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2 text-yellow-600">
                        <AlertCircle className="h-6 w-6" />
                        <CardTitle>Invitation expirée</CardTitle>
                    </div>
                    <CardDescription>
                        Le lien d'invitation que vous avez utilisé a expiré.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Pour des raisons de sécurité, les invitations expirent après 7 jours.
                    </p>
                    
                    <div className="rounded-md bg-gray-50 p-4">
                        <p className="text-sm font-medium text-gray-900">Email invité :</p>
                        <p className="text-sm text-gray-600">{email}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            Veuillez contacter votre administrateur pour demander une nouvelle invitation.
                        </p>
                    </div>

                    <Button asChild className="w-full">
                        <Link href={route('login')}>
                            Retour à la connexion
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}

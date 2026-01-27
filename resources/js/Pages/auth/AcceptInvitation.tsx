import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

interface AcceptInvitationProps {
    token: string;
    name: string;
    email: string;
}

export default function AcceptInvitation({ token, name, email }: AcceptInvitationProps) {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('invitation.accept', { token }));
    };

    return (
        <AuthLayout>
            <Head title="Accepter l'invitation" />

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Bienvenue !</CardTitle>
                    <CardDescription>
                        Vous avez été invité à rejoindre le Tracking Dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                disabled
                                className="bg-gray-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                disabled
                                className="bg-gray-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
                                autoFocus
                                required
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">
                                Confirmer le mot de passe
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-red-600">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        {errors.token && (
                            <div className="rounded-md bg-red-50 p-4">
                                <p className="text-sm text-red-800">{errors.token}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? 'Création du compte...' : 'Créer mon compte'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}

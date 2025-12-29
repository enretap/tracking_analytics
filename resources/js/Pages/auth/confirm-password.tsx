import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/user/confirm-password', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Confirmer le mot de passe"
            description="Veuillez confirmer votre mot de passe pour continuer"
        >
            <Head title="Confirmer le mot de passe" />

            <form onSubmit={submit} className="space-y-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Il s'agit d'une zone sécurisée de l'application. Veuillez confirmer votre mot
                    de passe avant de continuer.
                </p>

                <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    {errors.password && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    Confirmer
                </Button>
            </form>
        </AuthLayout>
    );
}

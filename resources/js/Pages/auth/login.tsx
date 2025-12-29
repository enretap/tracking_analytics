import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
    canResetPassword: boolean;
    canRegister: boolean;
    status?: string;
}

export default function Login({ canResetPassword, canRegister, status }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Tracking Analytics" description="Connectez-vous à votre compte">
            <Head title="Connexion" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="votre.email@example.com"
                        required
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Entrez votre mot de passe"
                        required
                    />
                    {errors.password && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked === true)}
                        />
                        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                            Se souvenir de moi
                        </Label>
                    </div>

                    {canResetPassword && (
                        <Link
                            href="/forgot-password"
                            className="text-sm text-amber-600 hover:text-amber-500 dark:text-amber-400"
                        >
                            Mot de passe oublié ?
                        </Link>
                    )}
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" disabled={processing}>
                    Se connecter
                </Button>

                {/* {canRegister && (
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Pas encore de compte ?{' '}
                        <Link
                            href="/register"
                            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        >
                            S'inscrire
                        </Link>
                    </p>
                )} */}
            </form>
        </AuthLayout>
    );
}

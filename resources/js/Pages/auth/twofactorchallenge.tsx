import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TwoFactorChallenge() {
    const [recovery, setRecovery] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        recovery_code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/two-factor-challenge', {
            onFinish: () => reset('code', 'recovery_code'),
        });
    };

    return (
        <AuthLayout
            title="Authentification à deux facteurs"
            description={
                recovery
                    ? 'Veuillez confirmer l\'accès à votre compte en saisissant un de vos codes de récupération'
                    : 'Veuillez confirmer l\'accès à votre compte en saisissant le code d\'authentification fourni par votre application d\'authentification'
            }
        >
            <Head title="Authentification à deux facteurs" />

            <form onSubmit={submit} className="space-y-6">
                {!recovery ? (
                    <div className="space-y-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            name="code"
                            value={data.code}
                            autoComplete="one-time-code"
                            autoFocus
                            onChange={(e) => setData('code', e.target.value)}
                            required
                        />
                        {errors.code && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.code}</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="recovery_code">Code de récupération</Label>
                        <Input
                            id="recovery_code"
                            type="text"
                            name="recovery_code"
                            value={data.recovery_code}
                            autoComplete="one-time-code"
                            autoFocus
                            onChange={(e) => setData('recovery_code', e.target.value)}
                            required
                        />
                        {errors.recovery_code && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.recovery_code}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        onClick={() => {
                            setRecovery(!recovery);
                            reset();
                        }}
                    >
                        {recovery
                            ? 'Utiliser un code d\'authentification'
                            : 'Utiliser un code de récupération'}
                    </button>

                    <Button type="submit" disabled={processing}>
                        Se connecter
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}

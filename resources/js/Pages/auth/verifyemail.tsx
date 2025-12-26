import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
    status?: string;
}

export default function VerifyEmail({ status }: Props) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <AuthLayout
            title="Vérifier votre email"
            description="Un lien de vérification a été envoyé à votre adresse email"
        >
            <Head title="Vérification email" />

            <div className="space-y-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Merci de vous être inscrit ! Avant de commencer, pourriez-vous vérifier votre
                    adresse email en cliquant sur le lien que nous venons de vous envoyer ? Si vous
                    n'avez pas reçu l'email, nous vous en enverrons un autre avec plaisir.
                </p>

                {status === 'verification-link-sent' && (
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        Un nouveau lien de vérification a été envoyé à l'adresse email que vous avez
                        fournie lors de l'inscription.
                    </div>
                )}

                <form onSubmit={submit} className="flex items-center justify-between gap-4">
                    <Button type="submit" disabled={processing}>
                        Renvoyer l'email de vérification
                    </Button>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                        Se déconnecter
                    </Link>
                </form>
            </div>
        </AuthLayout>
    );
}

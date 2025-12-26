import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={[
            { label: 'Paramètres', href: '/settings' },
            { label: 'Apparence', href: '/settings/appearance' }
        ]}>
            <Head title="Apparence" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Apparence
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Personnalisez l'apparence de l'application
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        Les paramètres d'apparence seront disponibles prochainement.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

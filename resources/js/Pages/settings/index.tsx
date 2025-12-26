import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function SettingsIndex() {
    return (
        <AppLayout breadcrumbs={[
            { label: 'Paramètres', href: '/settings' }
        ]}>
            <Head title="Paramètres" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Paramètres
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Gérez vos paramètres système
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <a
                        href="/settings/appearance"
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Apparence
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Personnalisez l'apparence de l'application
                        </p>
                    </a>

                    <a
                        href="/settings/platforms"
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Plateformes
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gérez vos plateformes de télématique
                        </p>
                    </a>

                    <a
                        href="/settings/accounts"
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Comptes
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gérez vos comptes de plateforme
                        </p>
                    </a>

                    <a
                        href="/settings/reports"
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Rapports
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Configurez vos rapports
                        </p>
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Platform {
    id: number;
    name: string;
    type?: string;
}

interface Props {
    platform: Platform;
}

export default function ShowPlatform({ platform }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Paramètres', href: '/settings' },
            { title: 'Plateformes', href: '/settings/platforms' },
            { title: platform.name, href: `/settings/platforms/${platform.id}` }
        ]}>
            <Head title={platform.name} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {platform.name}
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Détails de la plateforme
                        </p>
                    </div>
                    <Link
                        href={`/settings/platforms/${platform.id}/edit`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Modifier
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <pre className="text-sm text-gray-900 dark:text-gray-100 overflow-auto">
                        {JSON.stringify(platform, null, 2)}
                    </pre>
                </div>
            </div>
        </AppLayout>
    );
}

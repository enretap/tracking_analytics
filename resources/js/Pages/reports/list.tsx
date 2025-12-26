import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Account {
    id: number;
    name: string;
}

interface Platform {
    id: number;
    name: string;
}

interface Report {
    id: number;
    name: string;
    account_id: number;
    account?: Account;
}

interface Props {
    accounts: Account[];
    platforms: Platform[];
    reports: Report[];
}

export default function ReportsList({ accounts, platforms, reports }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Rapports', href: '/reports' }
        ]}>
            <Head title="Rapports" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Rapports
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Consultez vos rapports d'activité
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    {reports && reports.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reports.map((report) => (
                                <Link
                                    key={report.id}
                                    href={`/reports/${report.id}`}
                                    className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {report.name}
                                    </h3>
                                    {report.account && (
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            Compte: {report.account.name}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                            Aucun rapport disponible
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

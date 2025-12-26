import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface Account {
    id: number;
    name: string;
}

interface Report {
    id: number;
    name: string;
    type?: string;
    description?: string;
    accounts?: Account[];
    created_at?: string;
}

interface Props {
    reports: Report[];
}

const deleteReport = (reportId: number, reportName: string) => {
    if (confirm(`Voulez-vous vraiment supprimer le rapport "${reportName}" ?`)) {
        router.delete(`/settings/reports/${reportId}`);
    }
};

const getReportTypeBadge = (type?: string) => {
    if (!type) return null;
    
    const typeColors: Record<string, string> = {
        'summary': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        'fleet_activity': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        'driver_behavior': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'maintenance': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        'fuel_consumption': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    
    return (
        <Badge variant="outline" className={typeColors[type] || ''}>
            {type.replace('_', ' ')}
        </Badge>
    );
};

export default function ReportsIndex({ reports }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Paramètres', href: '/settings' },
            { title: 'Rapports', href: '/settings/reports' }
        ]}>
            <Head title="Configuration des rapports" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Configuration des rapports
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Gérez vos configurations de rapports
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/settings/reports/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau rapport
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Rapports configurés ({reports.length})
                        </CardTitle>
                        <CardDescription>
                            Liste de tous les types de rapports disponibles pour vos comptes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {reports && reports.length > 0 ? (
                            <div className="space-y-3">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                                                <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {report.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    {report.type && (
                                                        <>
                                                            {getReportTypeBadge(report.type)}
                                                            <span>•</span>
                                                        </>
                                                    )}
                                                    {report.accounts && report.accounts.length > 0 ? (
                                                        <>
                                                            <span>{report.accounts.length} compte{report.accounts.length > 1 ? 's' : ''}</span>
                                                            <span>•</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {report.accounts.slice(0, 2).map((account) => (
                                                                    <Badge key={account.id} variant="secondary" className="text-xs">
                                                                        {account.name}
                                                                    </Badge>
                                                                ))}
                                                                {report.accounts.length > 2 && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        +{report.accounts.length - 2}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="text-amber-600 dark:text-amber-400">Aucun compte</span>
                                                    )}
                                                </div>
                                                {report.description && (
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                        {report.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/settings/reports/${report.id}`}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Voir
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/settings/reports/${report.id}/edit`}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Éditer
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => deleteReport(report.id, report.name)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="h-12 w-12 text-gray-300 dark:text-gray-700" />
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    Aucun rapport configuré
                                </p>
                                <Button asChild className="mt-4" size="sm">
                                    <Link href="/settings/reports/create">
                                        Créer votre premier rapport
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

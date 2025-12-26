import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { SummaryTemplate } from '@/components/reports/templates/SummaryTemplate';
import { FleetActivityTemplate } from '@/components/reports/templates/FleetActivityTemplate';
import { DriverBehaviorTemplate } from '@/components/reports/templates/DriverBehaviorTemplate';
import { MaintenanceTemplate } from '@/components/reports/templates/MaintenanceTemplate';
import { FuelConsumptionTemplate } from '@/components/reports/templates/FuelConsumptionTemplate';

interface Report {
    id: number;
    name: string;
    type?: string;
    data?: any;
    period_start?: string;
    period_end?: string;
}

interface Props {
    report: Report;
}

export default function ReportDetail({ report }: Props) {
    const renderTemplate = () => {
        // Fusionner les données avec les dates de période
        const data = {
            ...report.data,
            period_start: report.period_start,
            period_end: report.period_end,
        };

        switch (report.type) {
            case 'summary':
                return <SummaryTemplate data={data} />;
            
            case 'fleet_activity':
                return <FleetActivityTemplate data={data} />;
            
            case 'driver_behavior':
                return <DriverBehaviorTemplate data={data} />;
            
            case 'maintenance':
                return <MaintenanceTemplate data={data} />;
            
            case 'fuel_consumption':
                return <FuelConsumptionTemplate data={data} />;
            
            default:
                // Fallback: afficher le template FleetActivity par défaut
                return <FleetActivityTemplate data={data} />;
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Rapports', href: '/reports' },
            { title: report.name, href: `/reports/${report.id}` }
        ]}>
            <Head title={report.name} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {report.name}
                    </h1>
                    {report.period_start && report.period_end && (
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Période: {new Date(report.period_start).toLocaleDateString('fr-FR')} - {new Date(report.period_end).toLocaleDateString('fr-FR')}
                        </p>
                    )}
                </div>

                {renderTemplate()}
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { SummaryTemplate } from '@/components/reports/templates/SummaryTemplate';
import { FleetActivityTemplate } from '@/components/reports/templates/FleetActivityTemplate';
import { DriverBehaviorTemplate } from '@/components/reports/templates/DriverBehaviorTemplate';
import { MaintenanceTemplate } from '@/components/reports/templates/MaintenanceTemplate';
import { FuelConsumptionTemplate } from '@/components/reports/templates/FuelConsumptionTemplate';
import { EcoDrivingTemplate } from '@/components/reports/templates/EcoDrivingTemplate';
import { DriverEcoDrivingTemplate } from '@/components/reports/templates/DriverEcoDrivingTemplate';
import { GeoEcoDrivingTemplate } from '@/components/reports/templates/GeoEcoDrivingTemplate';
import { Button } from '@/components/ui/button';
import { Download, Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';

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
    const [isExporting, setIsExporting] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const response = await fetch(`/api/reports/${report.id}/export/pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf',
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rapport-${report.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                console.error('Erreur lors de l\'export PDF');
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleShareEmail = async () => {
        setIsSharing(true);
        try {
            const response = await fetch(`/api/reports/${report.id}/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Le rapport a été envoyé par email avec succès !');
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.message || 'Impossible d\'envoyer le rapport'}`);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'envoi du rapport');
        } finally {
            setIsSharing(false);
        }
    };

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
            
            case 'eco_driving':
                return <EcoDrivingTemplate data={data} />;
            
            case 'driver_eco_driving':
                return <DriverEcoDrivingTemplate data={data} />;
            
            case 'geo_eco_driving':
                return <GeoEcoDrivingTemplate data={data} />;
            
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {report.name}
                        </h1>
                        {report.period_start && report.period_end && (
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Période: {new Date(report.period_start).toLocaleDateString('fr-FR')} - {new Date(report.period_end).toLocaleDateString('fr-FR')}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            {isExporting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            {isExporting ? 'Export en cours...' : 'Exporter en PDF'}
                        </Button>

                        <Button
                            onClick={handleShareEmail}
                            disabled={isSharing}
                            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600"
                        >
                            {isSharing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Mail className="h-4 w-4" />
                            )}
                            {isSharing ? 'Envoi en cours...' : 'Partager par email'}
                        </Button>
                    </div>
                </div>

                {renderTemplate()}
            </div>
        </AppLayout>
    );
}

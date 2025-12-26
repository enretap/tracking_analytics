import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, FileText } from 'lucide-react';

interface Report {
    id: number;
    name: string;
    type: string;
    description?: string;
    accounts?: { id: number }[];
}

interface Account {
    id: number;
    name: string;
}

interface Props {
    report: Report;
    accounts: Account[];
}

export default function EditReport({ report, accounts }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: report.name || '',
        type: report.type || 'summary',
        description: report.description || '',
        account_ids: report.accounts?.map(a => a.id) || [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/settings/reports/${report.id}`);
    };

    const toggleAccount = (accountId: number) => {
        if (data.account_ids.includes(accountId)) {
            setData('account_ids', data.account_ids.filter(id => id !== accountId));
        } else {
            setData('account_ids', [...data.account_ids, accountId]);
        }
    };

    const reportTypes = [
        { value: 'summary', label: 'Rapport de synthèse' },
        { value: 'fleet_activity', label: 'Activité de la flotte' },
        { value: 'driver_behavior', label: 'Comportement conducteur' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'fuel_consumption', label: 'Consommation carburant' },
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Paramètres', href: '/settings' },
            { title: 'Rapports', href: '/settings/reports' },
            { title: report.name, href: `/settings/reports/${report.id}` },
            { title: 'Modifier', href: `/settings/reports/${report.id}/edit` }
        ]}>
            <Head title={`Modifier ${report.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/settings/reports">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Modifier {report.name}
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Modifiez la configuration du rapport
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Configuration du rapport
                        </CardTitle>
                        <CardDescription>
                            Modifiez le type de rapport et les comptes associés
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom du rapport</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Rapport mensuel"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type de rapport</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) => setData('type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {reportTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-sm text-red-600">{errors.type}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Description du rapport..."
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {accounts.length > 0 && (
                                <div className="space-y-3">
                                    <Label>Comptes associés</Label>
                                    <div className="space-y-2">
                                        {accounts.map((account) => (
                                            <div key={account.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`account-${account.id}`}
                                                    checked={data.account_ids.includes(account.id)}
                                                    onCheckedChange={() => toggleAccount(account.id)}
                                                />
                                                <label
                                                    htmlFor={`account-${account.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {account.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.account_ids && (
                                        <p className="text-sm text-red-600">{errors.account_ids}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/settings/reports">Annuler</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

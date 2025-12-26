import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Zap, CheckCircle, XCircle, Settings, Trash2, TestTube } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

interface Account {
    id: number;
    name: string;
    configured: boolean;
    api_url?: string;
    api_token?: string;
    http_method: string;
    token_type: string;
    token_key?: string;
    additional_params?: string;
    configured_at?: string;
}

interface Platform {
    id: number;
    name: string;
    slug: string;
    provider: string;
    accounts: Account[];
}

interface Props {
    platforms: Platform[];
    error?: string;
}

export default function PlatformConfiguration({ platforms, error }: Props) {
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        account_id: 0,
        platform_id: 0,
        api_url: '',
        api_token: '',
        http_method: 'GET',
        token_type: 'bearer',
        token_key: '',
        additional_params: '',
    });

    const openConfigDialog = (platform: Platform, account: Account) => {
        setSelectedPlatform(platform);
        setSelectedAccount(account);
        setTestResult(null);
        
        setData({
            account_id: account.id,
            platform_id: platform.id,
            api_url: account.api_url || '',
            api_token: account.api_token || '',
            http_method: account.http_method || 'GET',
            token_type: account.token_type || 'bearer',
            token_key: account.token_key || '',
            additional_params: account.additional_params || '',
        });
        
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedAccount(null);
        setSelectedPlatform(null);
        setTestResult(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/platform-api', {
            preserveScroll: true,
            onSuccess: () => {
                closeDialog();
            },
        });
    };

    const handleDelete = (platformId: number, accountId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
            router.delete(`/settings/platform-api/${platformId}`, {
                data: { account_id: accountId },
                preserveScroll: true,
            });
        }
    };

    const handleTestConnection = async () => {
        setIsTestingConnection(true);
        setTestResult(null);

        try {
            const response = await axios.post('/settings/platform-api/test', {
                api_url: data.api_url,
                api_token: data.api_token,
                http_method: data.http_method,
                token_type: data.token_type,
                token_key: data.token_key,
                additional_params: data.additional_params,
            });

            setTestResult({
                success: true,
                message: response.data.message,
            });
        } catch (error: any) {
            setTestResult({
                success: false,
                message: error.response?.data?.message || 'Erreur lors du test de connexion',
            });
        } finally {
            setIsTestingConnection(false);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Paramètres', href: '/settings' },
            { title: 'Configuration API', href: '/settings/platform-api' }
        ]}>
            <Head title="Configuration API" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Configuration API
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Configurez les APIs pour chaque compte par plateforme
                    </p>
                </div>

                {error && (
                    <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                        <CardContent className="pt-6">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {platforms.map((platform) => (
                    <Card key={platform.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                {platform.name}
                                <Badge variant="outline" className="ml-2">
                                    {platform.provider}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Configurez les accès API pour chaque compte
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {platform.accounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            {account.configured ? (
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-gray-400" />
                                            )}
                                            <div>
                                                <p className="font-medium">{account.name}</p>
                                                {account.configured && account.api_url && (
                                                    <p className="text-sm text-gray-500">
                                                        {account.api_url}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {account.configured ? (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openConfigDialog(platform, account)}
                                                    >
                                                        <Settings className="h-4 w-4 mr-1" />
                                                        Modifier
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(platform.id, account.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Supprimer
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => openConfigDialog(platform, account)}
                                                >
                                                    Configurer
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedAccount?.configured ? 'Modifier' : 'Configurer'} l'API
                        </DialogTitle>
                        <DialogDescription>
                            Configuration de {selectedPlatform?.name} pour {selectedAccount?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="api_url">URL de l'API *</Label>
                            <Input
                                id="api_url"
                                type="url"
                                value={data.api_url}
                                onChange={(e) => setData('api_url', e.target.value)}
                                placeholder="https://api.example.com/endpoint"
                                required
                            />
                            {errors.api_url && (
                                <p className="text-sm text-red-600">{errors.api_url}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="http_method">Méthode HTTP</Label>
                                <Select
                                    value={data.http_method}
                                    onValueChange={(value) => setData('http_method', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="token_type">Type de Token</Label>
                                <Select
                                    value={data.token_type}
                                    onValueChange={(value) => setData('token_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bearer">Bearer</SelectItem>
                                        <SelectItem value="header">Header personnalisé</SelectItem>
                                        <SelectItem value="body">Dans le body</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {data.token_type !== 'bearer' && (
                            <div className="space-y-2">
                                <Label htmlFor="token_key">Nom de la clé du token</Label>
                                <Input
                                    id="token_key"
                                    type="text"
                                    value={data.token_key}
                                    onChange={(e) => setData('token_key', e.target.value)}
                                    placeholder="X-API-Key ou api_token"
                                />
                                <p className="text-sm text-gray-500">
                                    Le nom du header ou du paramètre body pour le token
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="api_token">Token API *</Label>
                            <Input
                                id="api_token"
                                type="password"
                                value={data.api_token}
                                onChange={(e) => setData('api_token', e.target.value)}
                                placeholder="••••••••••••••••"
                                required
                            />
                            {errors.api_token && (
                                <p className="text-sm text-red-600">{errors.api_token}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="additional_params">Paramètres additionnels (JSON)</Label>
                            <Textarea
                                id="additional_params"
                                value={data.additional_params}
                                onChange={(e) => setData('additional_params', e.target.value)}
                                placeholder='{"param1": "value1", "param2": "value2"}'
                                rows={3}
                            />
                            <p className="text-sm text-gray-500">
                                Format JSON valide pour les paramètres supplémentaires
                            </p>
                            {errors.additional_params && (
                                <p className="text-sm text-red-600">{errors.additional_params}</p>
                            )}
                        </div>

                        {testResult && (
                            <div
                                className={`rounded-lg p-4 ${
                                    testResult.success
                                        ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900'
                                        : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900'
                                }`}
                            >
                                <p
                                    className={
                                        testResult.success
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }
                                >
                                    {testResult.message}
                                </p>
                            </div>
                        )}

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleTestConnection}
                                disabled={isTestingConnection || !data.api_url || !data.api_token}
                            >
                                <TestTube className="h-4 w-4 mr-2" />
                                {isTestingConnection ? 'Test en cours...' : 'Tester la connexion'}
                            </Button>
                            <Button type="button" variant="outline" onClick={closeDialog}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

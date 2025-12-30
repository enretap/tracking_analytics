import { useState, useEffect } from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, FileText, Loader2 } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Report {
    id: number;
    name: string;
    type?: string;
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [reports, setReports] = useState<Report[]>([]);
    const [loadingReports, setLoadingReports] = useState(false);
    const [reportsOpen, setReportsOpen] = useState(false);
    
    // Charger les rapports quand le collapsible s'ouvre
    useEffect(() => {
        if (reportsOpen && reports.length === 0 && !loadingReports) {
            fetchReports();
        }
    }, [reportsOpen]);
    
    const fetchReports = async () => {
        setLoadingReports(true);
        try {
            const response = await fetch('/api/reports');
            if (response.ok) {
                const data = await response.json();
                setReports(data.data || []);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des rapports:', error);
        } finally {
            setLoadingReports(false);
        }
    };
    
    const isItemActive = (itemHref: string) => {
        const currentUrl = page.url;
        const itemUrl = resolveUrl(itemHref);
        
        // Comparaison exacte
        if (currentUrl === itemUrl) {
            return true;
        }
        
        // Vérifier si l'URL courante commence par cet item
        if (currentUrl.startsWith(itemUrl + '/')) {
            // Vérifier qu'aucun autre item ne correspond de manière plus spécifique
            const hasMoreSpecificMatch = items.some((otherItem) => {
                const otherUrl = resolveUrl(otherItem.href);
                return otherUrl !== itemUrl && 
                       otherUrl.length > itemUrl.length &&
                       (currentUrl === otherUrl || currentUrl.startsWith(otherUrl + '/'));
            });
            
            return !hasMoreSpecificMatch;
        }
        
        return false;
    };
    
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    // Menu spécial pour "Rapports d'usage" avec sous-menu
                    if (item.title === 'Rapports d\'usage') {
                        return (
                            <Collapsible
                                key={item.title}
                                open={reportsOpen}
                                onOpenChange={setReportsOpen}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            isActive={isItemActive(item.href)}
                                            tooltip={{ children: item.title }}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {loadingReports ? (
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton disabled>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span>Chargement...</span>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ) : reports.length > 0 ? (
                                                <>
                                                    {reports.slice(0, 5).map((report) => (
                                                        <SidebarMenuSubItem key={report.id}>
                                                            <SidebarMenuSubButton asChild>
                                                                <Link href={`/reports/${report.id}`}>
                                                                    <FileText className="h-4 w-4" />
                                                                    <span>{report.name}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                    {reports.length > 5 && (
                                                        <SidebarMenuSubItem>
                                                            <SidebarMenuSubButton asChild>
                                                                <Link href="/reports" className="text-muted-foreground">
                                                                    <span>Voir tous les rapports ({reports.length})</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    )}
                                                </>
                                            ) : (
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href="/reports" className="text-muted-foreground">
                                                            <span>Aucun rapport</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            )}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }
                    
                    // Menu spécial pour "Paramètres" avec sous-menu
                    if (item.title === 'Paramètres') {
                        return (
                            <Collapsible
                                key={item.title}
                                defaultOpen={false}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            isActive={isItemActive(item.href)}
                                            tooltip={{ children: item.title }}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href="/settings/platforms">
                                                        <span>Plateformes</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href="/settings/accounts">
                                                        <span>Comptes</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href="/settings/reports">
                                                        <span>Rapports</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }
                    
                    // Menu normal pour les autres items
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isItemActive(item.href)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

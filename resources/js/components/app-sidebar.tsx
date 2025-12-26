import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Settings as SettingsIcon, Users, Zap } from 'lucide-react';
import AppLogo from './app-logo';

const getMainNavItems = (isSuperAdmin: boolean, hasAdminAccess: boolean): NavItem[] => {
    const items: NavItem[] = [
        {
            title: 'Tableau de bord de la flotte',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Rapports d\'usage',
            href: '/reports',
            icon: BookOpen,
        },
    ];

    // Menu Utilisateurs accessible aux admins et super-admins
    if (hasAdminAccess) {
        items.push({
            title: 'Utilisateurs',
            href: '/settings/users',
            icon: Users,
        });
    }
    
    // Configuration API réservée uniquement aux super-admins
    if (isSuperAdmin) {
        items.push({
            title: 'Configuration API',
            href: '/settings/platform-api',
            icon: Zap,
        });
    }

    // Menu Paramètres accessible uniquement aux super-admins
    if (isSuperAdmin) {
        items.push({
            title: 'Paramètres',
            href: '/settings/platforms',
            icon: SettingsIcon,
        });
    }

    return items;
};

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const isSuperAdmin = user?.isSuperAdmin ?? false;
    const hasAdminAccess = user?.hasAdminAccess ?? false;
    const mainNavItems = getMainNavItems(isSuperAdmin, hasAdminAccess);
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

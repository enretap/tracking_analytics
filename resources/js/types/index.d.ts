import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    account_name?: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Platform {
    id: number;
    name: string;
    api_key?: string;
    api_secret?: string;
    created_at: string;
    updated_at: string;
}

export interface Account {
    id: number;
    name: string;
    platforms?: Platform[];
    created_at: string;
    updated_at: string;
}

export interface Report {
    id: number;
    name: string;
    description?: string;
    accounts?: Account[];
    created_at: string;
    updated_at: string;
}

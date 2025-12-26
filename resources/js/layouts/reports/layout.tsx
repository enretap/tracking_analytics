import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { cn, isSameUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

type SettingsLayoutProps = PropsWithChildren<{
    title?: string;
    description?: string;
}>;

const sidebarNavItems: NavItem[] = [
    { title: 'Tous les rapports', href: '/reports', icon: null },
    { title: 'Paramètres', href: '/settings/reports', icon: null },
];

export default function ReportsLayout({ children, title, description }: SettingsLayoutProps) {
    // Only render the layout on the client (avoid SSR mismatch)
    if (typeof window === 'undefined') return null;

    const currentPath = window.location.pathname;

    return (
        <div className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <Heading
                        title={title ?? 'Vos rapports'}
                        description={description ?? 'Gérer vos rapports personnalisés.'}
                    />

                    <div className="flex items-center gap-2">
                        <Button asChild size="sm">
                            <Link href="/settings/reports">Paramètres</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-2 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm">
                            {sidebarNavItems.map((item: NavItem, index: number) => (
                                <Button
                                    key={`${item.href}-${index}`}
                                    asChild
                                    variant="ghost"
                                    className={cn('w-full justify-start rounded-md', {
                                        'bg-muted': isSameUrl(currentPath, item.href),
                                    })}
                                >
                                    <Link href={item.href}>
                                        {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                                        <span className="text-sm">{item.title}</span>
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </aside>

                    <main className="min-w-0">
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

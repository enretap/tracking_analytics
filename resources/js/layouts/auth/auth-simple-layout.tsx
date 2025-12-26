import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden p-6 md:p-10">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
                {/* Animated gradient orbs */}
                <div className="absolute -left-40 top-0 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 opacity-30 blur-3xl mix-blend-multiply filter dark:opacity-20"></div>
                <div className="animation-delay-2000 absolute -right-40 top-0 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-purple-400 to-pink-300 opacity-30 blur-3xl mix-blend-multiply filter dark:opacity-20"></div>
                <div className="animation-delay-4000 absolute -bottom-40 left-20 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-indigo-400 to-blue-300 opacity-30 blur-3xl mix-blend-multiply filter dark:opacity-20"></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8">
                   
                    <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-2xl backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/80">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium transition-transform hover:scale-105"
                        >
                            <div className="mb-1 flex items-center justify-center rounded-2xl bg-white/80 p-4 backdrop-blur-sm dark:bg-gray-800/80">
                                <img 
                                    src="/logo-ct.png" 
                                    alt="ATC Comafrique Logo" 
                                    className="h-16 w-auto object-contain"
                                />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium text-gray-900 dark:text-white">{title}</h1>
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400 pb-4">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

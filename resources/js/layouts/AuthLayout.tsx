import { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div className="flex flex-col items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Tracking Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Gestion de rapports télématiques</p>
            </div>

            <div className="w-full sm:max-w-md px-6">
                {children}
            </div>
        </div>
    );
}

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

type Toast = { id: number; message: string; type?: 'success' | 'error' };

const ToastContext = createContext<{
    show: (message: string, type?: Toast['type']) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const show = useCallback((message: string, type: Toast['type'] = 'success') => {
        const id = Date.now();
        setToasts((t) => [...t, { id, message, type }]);
        setTimeout(() => {
            setToasts((t) => t.filter((x) => x.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div aria-live="polite" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:items-start sm:justify-end z-50">
                <div className="w-full flex flex-col items-center space-y-2 sm:items-end">
                    {toasts.map((t) => (
                        <div key={t.id} className={`max-w-sm w-full bg-white dark:bg-gray-800 shadow rounded-md pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}>
                            <div className={`p-3 ${t.type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{t.type === 'success' ? 'Succès' : 'Erreur'}</div>
                                <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">{t.message}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}

export default ToastProvider;

export function FlashToast() {
    const { props } = usePage();
    const toast = useToast();

    useEffect(() => {
        const flash = (props as any).flash ?? {};
        if (flash.success) {
            toast.show(flash.success as string, 'success');
        }
        if (flash.error) {
            toast.show(flash.error as string, 'error');
        }
    }, [(props as any).flash, toast]);

    return null;
}

// /components/ui/tabs.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface pour le contexte
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

// Création du contexte
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Les composants Tabs doivent être utilisés à l\'intérieur d\'un composant Tabs');
  }
  return context;
}

// Interface pour les props de Tabs
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

// Composant Tabs principal
export function Tabs({ 
  defaultValue, 
  value: controlledValue, 
  onValueChange, 
  children, 
  className = '' 
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  // Décider si on utilise le mode contrôlé ou non
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// Interface pour TabsList
interface TabsListProps {
  children: ReactNode;
  className?: string;
}

// Composant TabsList
export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div 
      className={`inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ${className}`}
    >
      {children}
    </div>
  );
}

// Interface pour TabsTrigger
interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

// Composant TabsTrigger
export function TabsTrigger({ 
  value, 
  children, 
  className = '', 
  disabled = false 
}: TabsTriggerProps) {
  const { value: currentValue, onValueChange } = useTabsContext();
  const isActive = currentValue === value;

  return (
    <button
      type="button"
      onClick={() => !disabled && onValueChange(value)}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium 
        transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
        disabled:pointer-events-none disabled:opacity-50
        ${isActive 
          ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white' 
          : 'text-gray-500 hover:bg-white/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900/50 dark:hover:text-white'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// Interface pour TabsContent
interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

// Composant TabsContent
export function TabsContent({ 
  value, 
  children, 
  className = '' 
}: TabsContentProps) {
  const { value: currentValue } = useTabsContext();

  // Ne pas rendre si ce n'est pas l'onglet actif
  if (currentValue !== value) {
    return null;
  }

  return (
    <div className={`mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}
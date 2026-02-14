import React, { createContext, useContext, ReactNode } from 'react';
import { usePanelLock, type PanelLockOptions } from '@/hooks/usePanelLock';
import type { LockReason } from '@/lib/auth/biometric-lock';

interface PanelLockContextType {
    isLocked: boolean;
    lockReason: LockReason | null;
    lockedAt: number | null;
    lastActivity: number;
    lock: (reason?: LockReason) => void;
    unlock: () => void;
    updateActivity: () => void;
    getTimeInfo: () => {
        timeSinceLock: number;
        timeSinceLastActivity: number;
        inactivityTimeout: number;
    };
}

const PanelLockContext = createContext<PanelLockContextType | undefined>(undefined);

interface PanelLockProviderProps {
    children: ReactNode;
    options?: PanelLockOptions;
}

/**
 * Provider del contexto de bloqueo del panel
 * Debe envolver el AdminLayout para proveer funcionalidad de lock screen
 */
export const PanelLockProvider: React.FC<PanelLockProviderProps> = ({
    children,
    options
}) => {
    const panelLock = usePanelLock(options);

    return (
        <PanelLockContext.Provider value={panelLock}>
            {children}
        </PanelLockContext.Provider>
    );
};

/**
 * Hook para acceder al contexto de bloqueo del panel
 * Debe usarse dentro de un PanelLockProvider
 */
export const usePanelLockContext = () => {
    const context = useContext(PanelLockContext);
    if (context === undefined) {
        throw new Error('usePanelLockContext must be used within a PanelLockProvider');
    }
    return context;
};

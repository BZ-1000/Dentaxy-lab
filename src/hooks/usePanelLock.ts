import { useState, useEffect, useCallback, useRef } from 'react';
import {
    getLockState,
    lockPanel as lockPanelLib,
    unlockPanel as unlockPanelLib,
    updateLastActivity as updateActivityLib,
    isLocked,
    getTimeSinceLock,
    getTimeSinceLastActivity,
    setInactivityTimeout as setTimeoutLib,
    getInactivityTimeout,
    startInactivityMonitor,
    registerActivityListeners,
    type LockState,
    type LockReason
} from '@/lib/auth/biometric-lock';

export interface PanelLockOptions {
    /** Timeout de inactividad en ms (0 para deshabilitar) */
    inactivityTimeout?: number;
    /** Callback ejecutado cuando se bloquea el panel */
    onLock?: (reason: LockReason) => void;
    /** Callback ejecutado cuando se desbloquea el panel */
    onUnlock?: () => void;
}

/**
 * Hook para gestionar el bloqueo y desbloqueo del panel admin
 * 
 * @example
 * const { isLocked, lock, unlock, lastActivity } = usePanelLock({
 *   inactivityTimeout: 300000 // 5 minutos
 * });
 */
export function usePanelLock(options?: PanelLockOptions) {
    const [state, setState] = useState<LockState>(getLockState());
    const monitorCleanupRef = useRef<(() => void) | null>(null);
    const activityCleanupRef = useRef<(() => void) | null>(null);

    // Sincronizar con cambios de localStorage (desde otros tabs)
    useEffect(() => {
        const handleStorageChange = (e: CustomEvent) => {
            setState(e.detail as LockState);
        };

        // Escuchar evento personalizado
        window.addEventListener('panel-lock-change' as any, handleStorageChange);

        return () => {
            window.removeEventListener('panel-lock-change' as any, handleStorageChange);
        };
    }, []);

    // Configurar timeout de inactividad
    useEffect(() => {
        if (options?.inactivityTimeout !== undefined) {
            setTimeoutLib(options.inactivityTimeout);
        }
    }, [options?.inactivityTimeout]);

    // Iniciar monitoreo de inactividad
    useEffect(() => {
        // Limpieza previa
        if (monitorCleanupRef.current) {
            monitorCleanupRef.current();
        }

        // Iniciar nuevo monitoreo
        const cleanup = startInactivityMonitor(() => {
            if (options?.onLock) {
                options.onLock('inactivity');
            }
        });

        monitorCleanupRef.current = cleanup;

        return () => {
            if (monitorCleanupRef.current) {
                monitorCleanupRef.current();
            }
        };
    }, [options?.onLock]);

    // Registrar listeners de actividad
    useEffect(() => {
        // Limpieza previa
        if (activityCleanupRef.current) {
            activityCleanupRef.current();
        }

        // Registrar nuevos listeners
        const cleanup = registerActivityListeners();
        activityCleanupRef.current = cleanup;

        return () => {
            if (activityCleanupRef.current) {
                activityCleanupRef.current();
            }
        };
    }, []);

    /**
     * Bloquea el panel inmediatamente
     */
    const lock = useCallback((reason: LockReason = 'manual') => {
        lockPanelLib(reason);
        setState(getLockState());
        if (options?.onLock) {
            options.onLock(reason);
        }
    }, [options?.onLock]);

    /**
     * Desbloquea el panel tras autenticación exitosa
     */
    const unlock = useCallback(() => {
        unlockPanelLib();
        setState(getLockState());
        if (options?.onUnlock) {
            options.onUnlock();
        }
    }, [options?.onUnlock]);

    /**
     * Actualiza el timestamp de última actividad manualmente
     */
    const updateActivity = useCallback(() => {
        updateActivityLib();
        setState(getLockState());
    }, []);

    /**
     * Obtiene información de tiempo
     */
    const getTimeInfo = useCallback(() => ({
        timeSinceLock: getTimeSinceLock(),
        timeSinceLastActivity: getTimeSinceLastActivity(),
        inactivityTimeout: getInactivityTimeout()
    }), []);

    return {
        isLocked: state.isLocked,
        lockReason: state.reason,
        lockedAt: state.lockedAt,
        lastActivity: state.lastActivity,
        lock,
        unlock,
        updateActivity,
        getTimeInfo
    };
}

import { useState, useCallback } from 'react';
import { reauthenticateWithPasskey } from '@/lib/auth/webauthn';
import { toast } from 'sonner';

export interface BiometricReauthOptions {
    /** Mensaje personalizado para mostrar en el UI */
    message?: string;
    /** Si se debe mostrar fallback de contraseña */
    allowPasswordFallback?: boolean;
}

/**
 * Hook para solicitar reautenticación biométrica antes de acciones críticas
 * 
 * @example
 * const { requestReauth, isReauthenticating } = useBiometricReauth();
 * 
 * const handleDeleteUser = async () => {
 *   const authenticated = await requestReauth('admin.delete_user');
 *   if (!authenticated) return;
 *   // ... ejecutar acción crítica
 * }
 */
export function useBiometricReauth() {
    const [isReauthenticating, setIsReauthenticating] = useState(false);
    const [lastReauthAction, setLastReauthAction] = useState<string | null>(null);

    /**
     * Solicita reautenticación biométrica para una acción específica
     * @param actionName Nombre de la acción (ej: 'admin.delete_user')
     * @param options Opciones adicionales
     * @returns true si la reauth fue exitosa, false si falló o fue cancelada
     */
    const requestReauth = useCallback(async (
        actionName: string,
        options?: BiometricReauthOptions
    ): Promise<boolean> => {
        setIsReauthenticating(true);

        try {
            // Mostrar toast informativo
            const toastId = toast.loading(
                options?.message || 'Verificación biométrica requerida',
                {
                    description: 'Usa tu huella, FaceID o llave de seguridad',
                    duration: Infinity
                }
            );

            const result = await reauthenticateWithPasskey(actionName);

            toast.dismiss(toastId);

            if (result.success) {
                setLastReauthAction(actionName);
                toast.success('Verificación exitosa', {
                    description: 'Acción autorizada',
                    icon: '🔓'
                });
                return true;
            } else {
                toast.error('Verificación fallida', {
                    description: result.error || 'No se pudo verificar tu identidad'
                });
                return false;
            }
        } catch (error: any) {
            console.error('Error en requestReauth:', error);
            toast.error('Error inesperado', {
                description: 'Intenta nuevamente'
            });
            return false;
        } finally {
            setIsReauthenticating(false);
        }
    }, []);

    /**
     * Verifica si hay una reauth reciente válida para una acción
     * @param actionName Nombre de la acción
     * @param timeoutSeconds Timeout en segundos (por defecto 300 = 5 min)
     */
    const hasRecentReauth = useCallback((
        actionName: string,
        timeoutSeconds: number = 300
    ): boolean => {
        const lastReauth = localStorage.getItem(`reauth_${actionName}`);
        if (!lastReauth) return false;

        const elapsed = Date.now() - parseInt(lastReauth);
        const timeoutMs = timeoutSeconds * 1000;

        return elapsed < timeoutMs;
    }, []);

    /**
     * Limpia el estado de reauth para una acción (forzar nueva reauth)
     */
    const clearReauth = useCallback((actionName: string) => {
        localStorage.removeItem(`reauth_${actionName}`);
        if (lastReauthAction === actionName) {
            setLastReauthAction(null);
        }
    }, [lastReauthAction]);

    return {
        requestReauth,
        isReauthenticating,
        lastReauthAction,
        hasRecentReauth,
        clearReauth
    };
}

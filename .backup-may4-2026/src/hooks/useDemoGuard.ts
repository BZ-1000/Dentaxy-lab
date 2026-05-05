/**
 * useDemoGuard.ts
 * 
 * Hook central de seguridad para los demos de Dentaxy.
 * Verifica si el usuario tiene acceso legítimo al demo requerido.
 * 
 * Lógica de verificación (en orden de prioridad):
 *  1. ¿Hay demo_session_token en sessionStorage? → Acceso permitido
 *  2. ¿El módulo tiene free_access = true en Supabase? → Libre acceso
 *  3. Ninguno → Redirigir al Hub en la card correspondiente
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface DemoGuardState {
    isAllowed: boolean;
    isLoading: boolean;
    isFreeAccess: boolean;
    accessMessage: string | null;
}

/**
 * @param moduleName - Nombre del módulo en Supabase (ej. 'dicom', 'motor_neuronal')
 */
export function useDemoGuard(moduleName: string): DemoGuardState {
    const navigate = useNavigate();
    const [state, setState] = useState<DemoGuardState>({
        isAllowed: false,
        isLoading: true,
        isFreeAccess: false,
        accessMessage: null,
    });
    const hasRedirected = useRef(false);

    useEffect(() => {
        let cancelled = false;

        const verify = async () => {
            // Paso 1: Verificar sessionStorage (acceso por token desde Hub)
            const sessionToken = sessionStorage.getItem('demo_session_token');
            if (sessionToken) {
                if (!cancelled) {
                    setState({ isAllowed: true, isLoading: false, isFreeAccess: false, accessMessage: null });
                }
                return;
            }

            // Paso 2: Verificar free_access en Supabase
            try {
                const { data, error } = await supabase
                    .from('dentaxy_modules')
                    .select('free_access, access_message')
                    .eq('name', moduleName)
                    .maybeSingle();

                if (error) throw error;

                if (data?.free_access) {
                    if (!cancelled) {
                        setState({
                            isAllowed: true,
                            isLoading: false,
                            isFreeAccess: true,
                            accessMessage: data.access_message || null,
                        });
                    }
                    return;
                }
            } catch (err) {
                console.error('[useDemoGuard] Error verificando módulo:', err);
            }

            // Paso 3: Sin acceso → Redirigir al Hub en la card correcta
            if (!cancelled && !hasRedirected.current) {
                hasRedirected.current = true;
                setState({ isAllowed: false, isLoading: false, isFreeAccess: false, accessMessage: null });
                navigate(`/modules?module=${moduleName}`, { replace: true });
            }
        };

        verify();

        return () => {
            cancelled = true;
        };
    }, [moduleName, navigate]);

    return state;
}

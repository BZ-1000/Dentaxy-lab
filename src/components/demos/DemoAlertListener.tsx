import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * DemoAlertListener - Componente para escuchar alertas en tiempo real
 * 
 * Debe ser incluido en todos los componentes de demo para recibir:
 * - Alertas del admin
 * - Notificaciones de sesión bloqueada
 */
export const DemoAlertListener: React.FC = () => {
    const navigate = useNavigate();
    const sessionId = sessionStorage.getItem('current_demo_session_id');

    // Listener de alertas
    useEffect(() => {
        if (!sessionId) return;

        const subscription = supabase
            .channel(`alerts_${sessionId}`)
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'demo_alerts',
                    filter: `session_id=eq.${sessionId}`
                },
                (payload) => {
                    const alert = payload.new as any;

                    // Mostrar alerta según tipo
                    const toastFunctions = {
                        'info': toast.info,
                        'warning': toast.warning,
                        'error': toast.error,
                        'success': toast.success
                    };

                    const toastFn = toastFunctions[alert.alert_type as keyof typeof toastFunctions] || toast.info;

                    toastFn(alert.message, {
                        duration: 10000,
                        description: 'Mensaje del administrador'
                    });

                    // Marcar como leída
                    supabase
                        .from('demo_alerts')
                        .update({ read_at: new Date().toISOString() })
                        .eq('id', alert.id)
                        .then(() => { });
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [sessionId]);

    // Verificar si la sesión está bloqueada
    useEffect(() => {
        if (!sessionId) return;

        const checkBlocked = async () => {
            try {
                const { data, error } = await supabase
                    .from('demo_sessions')
                    .select('is_blocked, blocked_reason')
                    .eq('id', sessionId)
                    .single();

                if (error) {
                    console.error('Error checking blocked status:', error);
                    return;
                }

                if (data?.is_blocked) {
                    toast.error(
                        `Tu sesión ha sido bloqueada${data.blocked_reason ? `: ${data.blocked_reason}` : ''}`,
                        { duration: Infinity }
                    );

                    // Redirigir después de 3 segundos
                    setTimeout(() => {
                        navigate('/session-blocked');
                    }, 3000);
                }
            } catch (error) {
                console.error('Error in checkBlocked:', error);
            }
        };

        // Check inicial
        checkBlocked();

        // Check periódico cada 10 segundos
        const interval = setInterval(checkBlocked, 10000);

        return () => clearInterval(interval);
    }, [sessionId, navigate]);

    return null; // Este componente no renderiza nada
};

export default DemoAlertListener;

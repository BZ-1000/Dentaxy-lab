import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuditLogEntry {
    user_id?: string;
    event_type: string;
    action?: string;
    ip_address?: string;
    user_agent?: string;
    metadata?: Record<string, any>;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Verificar autenticación (opcional para algunos eventos públicos)
        const authHeader = req.headers.get('Authorization');
        let userId: string | undefined;

        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const { data: { user } } = await supabaseAdmin.auth.getUser(token);
            userId = user?.id;
        }

        const {
            eventType,
            action,
            metadata = {}
        } = await req.json() as {
            eventType: string;
            action?: string;
            metadata?: Record<string, any>;
        };

        if (!eventType) {
            throw new Error('eventType is required');
        }

        // Obtener información de contexto
        const ipAddress = req.headers.get('x-forwarded-for') ||
            req.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        // Crear entrada de audit log
        const logEntry: AuditLogEntry = {
            event_type: eventType,
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata
        };

        if (userId) {
            logEntry.user_id = userId;
        }

        if (action) {
            logEntry.action = action;
        }

        // Insertar en la base de datos
        const { data, error } = await supabaseAdmin
            .from('auth_audit_log')
            .insert(logEntry)
            .select()
            .single();

        if (error) {
            console.error('Error inserting audit log:', error);
            throw new Error('Failed to create audit log entry');
        }

        console.log('Audit log created:', {
            id: data.id,
            eventType,
            userId,
            action
        });

        return new Response(
            JSON.stringify({
                success: true,
                logId: data.id,
                message: 'Audit log entry created'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        console.error('Error in audit-security-events:', error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});

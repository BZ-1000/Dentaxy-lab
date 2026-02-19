import { supabase } from '@/integrations/supabase/client';

export type LeadSource = 'Shop' | 'Seed';

export interface Lead {
    id: string;
    created_at: string;
    full_name: string;
    phone: string;
    source: LeadSource;
    peer_id: string;
    status: 'pending' | 'connected' | 'completed' | 'archived';
    email?: string;
    metadata?: Record<string, unknown>;
}

export const leadsService = {
    // ── LEADS ─────────────────────────────────────────────────────────────────
    async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'status'>) {
        const { data, error } = await supabase
            .from('leads_central')
            .insert([{ ...lead, status: 'pending' }])
            .select()
            .single();

        if (error) {
            console.error('[Leads] Error creando lead:', error);
            throw error;
        }

        return data;
    },

    async getLeads() {
        const { data, error } = await supabase
            .from('leads_central')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Leads] Error obteniendo leads:', error);
            throw error;
        }

        return data as Lead[];
    },

    async getRecentLeads(limit = 10) {
        const { data, error } = await supabase
            .from('leads_central')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[Leads] Error obteniendo leads recientes:', error);
            throw error;
        }

        return data as Lead[];
    },

    subscribeToLeads(callback: (payload: unknown) => void) {
        return supabase
            .channel('leads_central_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'leads_central' },
                callback
            )
            .subscribe();
    },

    // ── NEXUS CONFIG (PeerID del receptor) ────────────────────────────────────

    /**
     * Lee el PeerID activo del receptor (NexusIntel).
     * Los emisores (Shop/Seed) lo usan para saber a quién conectarse.
     */
    async getReceiverPeerId(): Promise<string> {
        const { data, error } = await supabase
            .from('nexus_config')
            .select('value')
            .eq('key', 'receiver_peer_id')
            .single();

        if (error) {
            console.error('[NexusConfig] Error leyendo receiver_peer_id:', error);
            return '';
        }

        return (data?.value as string) || '';
    },

    /**
     * Guarda el PeerID del receptor cuando NexusIntel se inicializa.
     * Llamado SOLO desde NexusIntel al montar el componente.
     */
    async saveReceiverPeerId(peerId: string): Promise<void> {
        const { error } = await supabase
            .from('nexus_config')
            .update({ value: peerId, updated_at: new Date().toISOString() })
            .eq('key', 'receiver_peer_id');

        if (error) {
            console.error('[NexusConfig] Error guardando receiver_peer_id:', error);
            throw error;
        }

        console.log('[NexusConfig] PeerID de receptor guardado:', peerId);
    },
};

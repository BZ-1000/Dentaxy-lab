/**
 * UaoSandboxContext.tsx
 * Abstracción de Estado Efímero Multijugador (Phase 2).
 * Sincroniza las operaciones CRUD con las tablas del Sandbox en Supabase.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS DEL SANDBOX
// ─────────────────────────────────────────────────────────────────────────────

export interface SandboxPatient {
  id: string;
  demo_link_id: string;
  nombre: string;
  edad: number | null;
  curp: string | null;
  diagnostico: string | null;
  saldo: number;
  creador_rol: string;
  creador_nombre: string | null;
  created_at: string;
}

export interface SandboxRecord {
  id: string;
  demo_link_id: string;
  patient_id: string;
  tipo: string;
  contenido: any;
  creador_rol: string;
  creador_nombre: string | null;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  firma_docente: string | null;
  nodo_clinica: string | null;
  created_at: string;
}

interface SandboxContextType {
  patients: SandboxPatient[];
  records: SandboxRecord[];
  isLoading: boolean;
  addPatient: (data: Partial<SandboxPatient>) => Promise<boolean>;
  addRecord: (data: Partial<SandboxRecord>) => Promise<boolean>;
  approveRecord: (recordId: string, firma: string) => Promise<boolean>;
}

const SandboxContext = createContext<SandboxContextType | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export const UaoSandboxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<SandboxPatient[]>([]);
  const [records, setRecords] = useState<SandboxRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Intentamos obtener el UUID real del demo_link si venía de un token (Supabase).
  // Sino, usamos 'demo_local' como fallback preventivo para no reventar.
  const sessionTokenString = sessionStorage.getItem('demo_token') || 'demo_local';
  
  // Como demo_link_id en la DB es UUID y el usuario tiene el "TKN-XXXX", primero
  // necesitamos buscar ese UUID en la DB real. Para acelerar, en el DemoDemo.tsx 
  // podríamos guardar el ID real directio. Por ahora vamos a asumir que podemos
  // obtener el UUID o que usamos un canal genérico local si no hay internet.
  const [demoLinkId, setDemoLinkId] = useState<string | null>(sessionStorage.getItem('demo_link_uuid'));

  useEffect(() => {
    // 1. Resolver el UUID del token de sesión si no lo tenemos y si estamos en Supabase
    const resolveToken = async () => {
      if (demoLinkId || sessionTokenString === 'demo_local') return;
      try {
         const { data } = await supabase
           .from('demo_links')
           .select('id')
           .eq('token', sessionTokenString)
           .single();
         if (data?.id) {
           setDemoLinkId(data.id);
           sessionStorage.setItem('demo_link_uuid', data.id);
         }
      } catch (err) {
         console.warn("No pudimos resolver el UUID del Sandbox", err);
      }
    };
    resolveToken();
  }, [sessionTokenString, demoLinkId]);

  useEffect(() => {
    if (!demoLinkId) {
      if (sessionTokenString === 'admin') setIsLoading(false);
      return;
    }

    const loadInitialData = async () => {
      setIsLoading(true);
      // Fetch Patients
      const { data: pData } = await supabase
        .from('uao_sandbox_patients')
        .select('*')
        .eq('demo_link_id', demoLinkId)
        .order('created_at', { ascending: false });

      if (pData) setPatients(pData as SandboxPatient[]);

      // Fetch Records
      const { data: rData } = await supabase
        .from('uao_sandbox_records')
        .select('*')
        .eq('demo_link_id', demoLinkId)
        .order('created_at', { ascending: false });

      if (rData) setRecords(rData as SandboxRecord[]);
      setIsLoading(false);
    };

    loadInitialData();

    // 2. Suscribirse a Cambios Multi-jugador vía Supabase Realtime
    const channel = supabase.channel(`sandbox_${demoLinkId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'uao_sandbox_patients', filter: `demo_link_id=eq.${demoLinkId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPatients(prev => [payload.new as SandboxPatient, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPatients(prev => prev.map(p => p.id === payload.new.id ? payload.new as SandboxPatient : p));
          } else if (payload.eventType === 'DELETE') {
            setPatients(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'uao_sandbox_records', filter: `demo_link_id=eq.${demoLinkId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRecords(prev => [payload.new as SandboxRecord, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setRecords(prev => prev.map(r => r.id === payload.new.id ? payload.new as SandboxRecord : r));
          } else if (payload.eventType === 'DELETE') {
            setRecords(prev => prev.filter(r => r.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [demoLinkId, sessionTokenString]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  const addPatient = async (data: Partial<SandboxPatient>) => {
    if (!demoLinkId) return false;
    try {
      const payload = {
        ...data,
        demo_link_id: demoLinkId,
        creador_rol: data.creador_rol || 'Desconocido'
      };
      const { error } = await supabase.from('uao_sandbox_patients').insert(payload);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const addRecord = async (data: Partial<SandboxRecord>) => {
    if (!demoLinkId) return false;
    try {
      const payload = {
        ...data,
        demo_link_id: demoLinkId,
        tipo: data.tipo || 'nota',
        contenido: data.contenido || {},
        creador_rol: data.creador_rol || 'Desconocido'
      };
      const { error } = await supabase.from('uao_sandbox_records').insert(payload);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const approveRecord = async (recordId: string, firma: string) => {
    if (!demoLinkId) return false;
    try {
      const { error } = await supabase
        .from('uao_sandbox_records')
        .update({ estado: 'aprobado', firma_docente: firma })
        .eq('id', recordId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <SandboxContext.Provider value={{
      patients,
      records,
      isLoading,
      addPatient,
      addRecord,
      approveRecord
    }}>
      {children}
    </SandboxContext.Provider>
  );
};

export const useUaoSandbox = () => {
  const ctx = useContext(SandboxContext);
  if (!ctx) throw new Error("useUaoSandbox debe usarse dentro de UaoSandboxProvider");
  return ctx;
};

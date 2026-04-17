/**
 * DemoContext.tsx
 * Estado global del Demo DentaXy UAO Sync
 * Persiste en sessionStorage para no perder estado al navegar entre vistas
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { RolId, NodoId, getRolById, getNodoById, Rol, NodoClinico } from '@/data/uaoMockData';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

interface DemoState {
  isAuthenticated: boolean;
  rolActivo: RolId | null;
  nodoActivo: NodoId | null;
  subUnidadActiva: string | null;
  isZeroState: boolean;
}

interface DemoContextType extends DemoState {
  rolData: Rol | null;
  nodoData: NodoClinico | null;
  loginWithToken: (token: string) => boolean;
  logout: () => void;
  selectRol: (rolId: RolId) => void;
  selectNodo: (nodoId: NodoId, subUnidadId?: string) => void;
  clearNodo: () => void;
  toggleZeroState: () => void;
  generateToken: (rolId: RolId) => string;
  validTokens: Record<string, RolId>;
}

// ─────────────────────────────────────────────────────────────────────────────
// VALORES POR DEFECTO
// ─────────────────────────────────────────────────────────────────────────────


const STORAGE_KEY = 'uao_demo_state';
const TOKENS_KEY = 'uao_demo_tokens';

const DEFAULT_TOKENS: Record<string, RolId> = {
  'TKN-DIR-2026': 'director',
  'TKN-COO-2026': 'coordinador',
  'TKN-JEF-2026': 'jefe',
  'TKN-DOC-2026': 'docente',
  'TKN-ALU-2026': 'alumno',
  'TKN-ADM-2026': 'administrativo',
  'TKN-PAC-2026': 'paciente'
};

const defaultState: DemoState = {
  isAuthenticated: false,
  rolActivo: null,
  nodoActivo: null,
  subUnidadActiva: null,
  isZeroState: true, // Por defecto inicia en zero-state como pidió el usuario
};

const DemoContext = createContext<DemoContextType | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DemoState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  const [validTokens, setValidTokens] = useState<Record<string, RolId>>(() => {
    try {
      const saved = localStorage.getItem(TOKENS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_TOKENS;
    } catch {
      return DEFAULT_TOKENS;
    }
  });

  // Persist state
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [state]);

  // Persist tokens
  useEffect(() => {
    try {
      localStorage.setItem(TOKENS_KEY, JSON.stringify(validTokens));
    } catch { /* ignore */ }
  }, [validTokens]);

  // ── Acciones
  const loginWithToken = useCallback((token: string): boolean => {
    const t = token.trim();
    if (t.toLowerCase() === 'admin') {
      setState(prev => ({ ...prev, isAuthenticated: true }));
      return true;
    }
    const match = validTokens[t];
    if (match) {
      setState(prev => ({ ...prev, isAuthenticated: true, rolActivo: match }));
      return true;
    }
    return false;
  }, [validTokens]);

  const generateToken = useCallback((rolId: RolId) => {
    const prefix = rolId.substring(0, 3).toUpperCase();
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newToken = `TKN-${prefix}-${hash}`;
    setValidTokens(prev => ({ ...prev, [newToken]: rolId }));
    return newToken;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }, []);

  const selectRol = useCallback((rolId: RolId) => {
    setState(prev => ({ ...prev, rolActivo: rolId, nodoActivo: null, subUnidadActiva: null }));
  }, []);

  const selectNodo = useCallback((nodoId: NodoId, subUnidadId?: string) => {
    setState(prev => ({
      ...prev,
      nodoActivo: nodoId,
      subUnidadActiva: subUnidadId ?? null,
    }));
  }, []);

  const clearNodo = useCallback(() => {
    setState(prev => ({ ...prev, nodoActivo: null, subUnidadActiva: null }));
  }, []);

  const toggleZeroState = useCallback(() => {
    setState(prev => ({ ...prev, isZeroState: !prev.isZeroState }));
  }, []);

  // ── Derived
  const rolData = state.rolActivo ? getRolById(state.rolActivo) ?? null : null;
  const nodoData = state.nodoActivo ? getNodoById(state.nodoActivo) ?? null : null;

  return (
    <DemoContext.Provider value={{
      ...state, rolData, nodoData, loginWithToken, logout,
      selectRol, selectNodo, clearNodo, toggleZeroState,
      generateToken, validTokens
    }}>
      {children}
    </DemoContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export const useDemo = (): DemoContextType => {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo debe usarse dentro de <DemoProvider>');
  return ctx;
};

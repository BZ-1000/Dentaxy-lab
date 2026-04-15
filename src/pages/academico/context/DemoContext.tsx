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
  login: (usuario: string, password: string) => boolean;
  logout: () => void;
  selectRol: (rolId: RolId) => void;
  selectNodo: (nodoId: NodoId, subUnidadId?: string) => void;
  clearNodo: () => void;
  toggleZeroState: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// VALORES POR DEFECTO
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'uao_demo_state';

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

  // Persist to sessionStorage whenever state changes
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [state]);

  // ── Acciones
  const login = useCallback((usuario: string, password: string): boolean => {
    if (usuario.trim().toLowerCase() === 'admin' && password === 'admin') {
      setState(prev => ({ ...prev, isAuthenticated: true }));
      return true;
    }
    return false;
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
    <DemoContext.Provider value={{ ...state, rolData, nodoData, login, logout, selectRol, selectNodo, clearNodo, toggleZeroState }}>
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

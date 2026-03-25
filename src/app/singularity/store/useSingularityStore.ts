import { create } from 'zustand';

export type SingularityTheme = 'dark' | 'legendary' | 'cyberpunk';

export type ModuleId = 'sala-guerra' | 'servidor-local' | 'atrio' | 'agentes';

export interface WindowState {
    id: string;
    moduleId: ModuleId;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isMinimized: boolean;
    isMaximized: boolean;
}

interface SingularityStore {
    // Ventanas
    windows: WindowState[];
    activeWindowId: string | null;
    nextZIndex: number;

    // UI
    theme: SingularityTheme;
    isSidebarCollapsed: boolean;
    commandPaletteOpen: boolean;

    // Misiones (mock NEXUS-01)
    missions: Mission[];

    // Acciones
    openWindow: (moduleId: ModuleId) => void;
    closeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    updateWindowPosition: (id: string, x: number, y: number) => void;
    setTheme: (theme: SingularityTheme) => void;
    toggleSidebar: () => void;
    setCommandPaletteOpen: (open: boolean) => void;
    toggleMissionStatus: (id: string) => void;
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    priority: 'normal' | 'high' | 'legendary';
    completed: boolean;
    xp: number;
    agent: 'NEXUS-01' | 'AIDA-7' | 'SYNTAX-9' | 'CYPHER-CORE';
}

const MODULE_CONFIG: Record<ModuleId, { title: string; defaultWidth: number; defaultHeight: number }> = {
    'sala-guerra': { title: '⚔️ Sala de Guerra', defaultWidth: 780, defaultHeight: 520 },
    'servidor-local': { title: '🔐 Servidor Local', defaultWidth: 700, defaultHeight: 480 },
    'atrio': { title: '🏛️ Atrio de Colaboración', defaultWidth: 720, defaultHeight: 500 },
    'agentes': { title: '🤖 Consejo de Agentes', defaultWidth: 660, defaultHeight: 460 },
};

const INITIAL_MISSIONS: Mission[] = [
    { id: 'm1', title: 'Cerrar 3 demos esta semana', description: 'Contactar clínicas CROID, UAZ y Mexident para demostración de Dentaxy', priority: 'legendary', completed: false, xp: 500, agent: 'NEXUS-01' },
    { id: 'm2', title: 'Optimizar historia clínica AI', description: 'Reducir tiempo de redacción de 3 min a 45s con nuevos scripts', priority: 'high', completed: false, xp: 300, agent: 'AIDA-7' },
    { id: 'm3', title: 'Configurar Dentaxy Shop pagos', description: 'Integrar pasarela de pagos y activar primeros productos', priority: 'high', completed: false, xp: 250, agent: 'CYPHER-CORE' },
    { id: 'm4', title: 'Generar contrato UAZ', description: 'Documentación legal para alianza con Universidad Autónoma de Zacatecas', priority: 'normal', completed: true, xp: 150, agent: 'SYNTAX-9' },
    { id: 'm5', title: 'Actualizar pitch deck 2026', description: 'Incluir métricas Q1 y roadmap Singularity', priority: 'normal', completed: false, xp: 100, agent: 'AIDA-7' },
];

let windowCounter = 0;

export const useSingularityStore = create<SingularityStore>((set, get) => ({
    windows: [],
    activeWindowId: null,
    nextZIndex: 10,
    theme: 'dark',
    isSidebarCollapsed: false,
    commandPaletteOpen: false,
    missions: INITIAL_MISSIONS,

    openWindow: (moduleId) => {
        const { windows, nextZIndex } = get();
        // Si ya está abierta, solo hacer focus
        const existing = windows.find(w => w.moduleId === moduleId && !w.isMinimized);
        if (existing) {
            get().focusWindow(existing.id);
            return;
        }
        const cfg = MODULE_CONFIG[moduleId];
        const offset = (windowCounter % 5) * 30;
        windowCounter++;
        const newWindow: WindowState = {
            id: `win-${Date.now()}`,
            moduleId,
            title: cfg.title,
            x: 80 + offset,
            y: 60 + offset,
            width: cfg.defaultWidth,
            height: cfg.defaultHeight,
            zIndex: nextZIndex,
            isMinimized: false,
            isMaximized: false,
        };
        set(s => ({
            windows: [...s.windows, newWindow],
            activeWindowId: newWindow.id,
            nextZIndex: s.nextZIndex + 1,
        }));
    },

    closeWindow: (id) => {
        set(s => ({
            windows: s.windows.filter(w => w.id !== id),
            activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
        }));
    },

    focusWindow: (id) => {
        const { nextZIndex } = get();
        set(s => ({
            windows: s.windows.map(w => w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w),
            activeWindowId: id,
            nextZIndex: s.nextZIndex + 1,
        }));
    },

    minimizeWindow: (id) => {
        set(s => ({
            windows: s.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
            activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
        }));
    },

    maximizeWindow: (id) => {
        set(s => ({
            windows: s.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w),
        }));
    },

    updateWindowPosition: (id, x, y) => {
        set(s => ({
            windows: s.windows.map(w => w.id === id ? { ...w, x, y } : w),
        }));
    },

    setTheme: (theme) => set({ theme }),
    toggleSidebar: () => set(s => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
    setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

    toggleMissionStatus: (id) => {
        set(s => ({
            missions: s.missions.map(m => m.id === id ? { ...m, completed: !m.completed } : m),
        }));
    },
}));

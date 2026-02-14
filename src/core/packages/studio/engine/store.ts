import { create } from 'zustand';
import { StudioStore } from '../StudioTypes';

export const useStudioStore = create<StudioStore>((set, get) => ({
    selectedComponentId: null,
    inspectedFile: null,
    isMinimized: false,
    isMaximized: false,
    isSidebarOpen: true,

    selectFile: (file) => set({ inspectedFile: file, selectedComponentId: file.name }),
    setMinimized: (minimized) => set({ isMinimized: minimized }),
    toggleMaximized: () => set((state) => ({ isMaximized: !state.isMaximized })),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    generateMetadata: (componentName) => {
        const specs = `[CLONE_REQUEST]\nComponent: ${componentName}\nContext: Dentaxy Studio v3.0\nSpecs: Exported from Visualizer`;
        return specs;
    }
}));

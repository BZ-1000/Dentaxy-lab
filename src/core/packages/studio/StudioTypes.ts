import { LucideIcon } from 'lucide-react';

export interface FileItem {
    name: string;
    label: string;
    type: 'Form' | 'Section' | 'View' | 'UI' | 'Utility' | 'Page' | 'System';
    path: string;
    icon?: LucideIcon;
}

export interface StudioState {
    selectedComponentId: string | null;
    inspectedFile: FileItem | null;
    isMinimized: boolean;
    isMaximized: boolean;
    isSidebarOpen: boolean;
}

export interface StudioActions {
    selectFile: (file: FileItem) => void;
    setMinimized: (minimized: boolean) => void;
    toggleMaximized: () => void;
    toggleSidebar: () => void;
    generateMetadata: (componentName: string) => string;
}

export type StudioStore = StudioState & StudioActions;

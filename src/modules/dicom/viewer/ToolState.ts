import { create } from 'zustand';

interface ToolState {
    activeTool: string;
    viewportProperties: {
        zoom: number;
        pan: { x: number; y: number };
        voi: { windowWidth: number; windowCenter: number };
        invert: boolean;
        rotation: number;
        flipHorizontal: boolean;
        flipVertical: boolean;
    };
    measurements: any[]; // Placeholder for measurements

    // Actions
    setActiveTool: (toolName: string) => void;
    setViewportProperties: (props: Partial<ToolState['viewportProperties']>) => void;
    setMeasurements: (measurements: any[]) => void;
    resetViewportProperties: () => void;
}

const defaultViewportProperties = {
    zoom: 1,
    pan: { x: 0, y: 0 },
    voi: { windowWidth: 400, windowCenter: 40 },
    invert: false,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
};

export const useToolState = create<ToolState>((set) => ({
    activeTool: 'WindowLevel', // Default tool
    viewportProperties: defaultViewportProperties,
    measurements: [],

    setActiveTool: (toolName) => set({ activeTool: toolName }),
    setViewportProperties: (props) =>
        set((state) => ({
            viewportProperties: { ...state.viewportProperties, ...props },
        })),
    setMeasurements: (measurements) => set({ measurements }),
    resetViewportProperties: () => set({ viewportProperties: defaultViewportProperties }),
}));

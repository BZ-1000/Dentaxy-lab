/**
 * Window/Level presets for different tissue types
 */

export interface WindowLevelPreset {
    description: string;
    windowWidth: number;
    windowCenter: number;
}

export const WINDOW_LEVEL_PRESETS: Record<string, WindowLevelPreset> = {
    DEFAULT: {
        description: 'Default',
        windowWidth: 400,
        windowCenter: 40,
    },
    LUNG: {
        description: 'Pulmón',
        windowWidth: 1500,
        windowCenter: -600,
    },
    BONE: {
        description: 'Hueso',
        windowWidth: 2000,
        windowCenter: 300,
    },
    SOFT_TISSUE: {
        description: 'Tejido Blando',
        windowWidth: 350,
        windowCenter: 40,
    },
    BRAIN: {
        description: 'Cerebro',
        windowWidth: 80,
        windowCenter: 40,
    },
    TEETH: {
        description: 'Dental',
        windowWidth: 1500,
        windowCenter: 250,
    },
};

import React from 'react';
import {
    Sun, Move, ZoomIn, MousePointer2, Ruler, Crosshair,
    ScanLine, Type, Contrast, Maximize, Menu
} from 'lucide-react';
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WINDOW_LEVEL_PRESETS } from '../utils/presets';
import { ToolNames } from '../viewer/ToolRegistry';


interface DicomToolbarProps {
    activeTool: string;
    onToolChange: (toolName: string) => void;
    toolGroupId: string; // Needed for applying presets
    orientation?: 'horizontal' | 'vertical';
}

const COLORMAPS = [
    { name: 'Gray', label: 'Escala de Grises' },
    { name: 'Hot Iron', label: 'Hot Iron' },
    { name: 'PET', label: 'PET' },
    { name: 'Hot Metal Blue', label: 'Hot Metal Blue' },
    { name: 'Pet 20 Step', label: 'PET 20 Step' },
];

export const DicomToolbar: React.FC<DicomToolbarProps> = ({
    activeTool,
    onToolChange,
    toolGroupId,
    orientation = 'horizontal'
}) => {
    const isVertical = orientation === 'vertical';

    // Lista de herramientas alineada con ToolRegistry y requisitos del usuario
    const tools = [
        { name: ToolNames.WindowLevel, icon: Sun, label: 'W/L' },
        { name: ToolNames.Pan, icon: Move, label: 'Mover' },
        { name: ToolNames.Zoom, icon: ZoomIn, label: 'Zoom' },
        { name: ToolNames.ArrowAnnotate, icon: MousePointer2, label: 'Cursor' }, // "Cursor / Selección"
        { separator: true },
        { name: ToolNames.Length, icon: Ruler, label: 'Longitud' },
        { name: ToolNames.Angle, icon: Crosshair, label: 'Ángulo' },
        { separator: true },
        { name: ToolNames.RectangleROI, icon: ScanLine, label: 'ROI □' },
        { name: ToolNames.CircleROI, icon: Type, label: 'ROI ○' },
        { name: ToolNames.Probe, icon: Crosshair, label: 'Sonda' },
    ];

    // Handlers que usan ToolController/ViewportController
    const handleToolClick = (toolName: string) => {
        onToolChange(toolName);
    };

    const toggleInvert = () => {
        // Importación dinámica para evitar ciclos o usar ViewportController si ya está importado
        import('../viewer/ViewportController').then(({ ViewportController }) => {
            ViewportController.toggleInvert();
        });
    };

    const handleOneToOne = () => {
        import('../viewer/ViewportController').then(({ ViewportController }) => {
            ViewportController.setRealSize();
        });
    };

    const applyPreset = (preset: any) => {
        import('../viewer/ViewportController').then(({ ViewportController }) => {
            ViewportController.setWindowLevel(preset.windowWidth, preset.windowCenter);
        });
    };

    const applyColormap = (colormapName: string) => {
        // This function needs to be updated to use ViewportController as getViewport is removed.
        // For now, it's left as is, assuming ViewportController will expose a similar method.
        // Placeholder for future implementation:
        import('../viewer/ViewportController').then(({ ViewportController }) => {
            ViewportController.setColormap(colormapName);
        });
    };

    // Clases base para el contenedor
    const containerClasses = cn(
        "bg-black/60 backdrop-blur-md border border-white/10 p-2 flex gap-2 transition-all duration-300",
        isVertical ? "flex-col w-16 rounded-r-xl border-l-0 h-auto self-start mt-4" : "flex-row items-center justify-center w-full overflow-x-auto pb-safe border-t"
    );

    // Clases para los botones
    const buttonClasses = (isActive: boolean) => cn(
        "flex flex-col items-center justify-center rounded-xl transition-all duration-200 gap-1",
        isVertical ? "w-12 h-12" : "w-14 h-14",
        isActive
            ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
            : "text-white/60 hover:text-white hover:bg-white/10"
    );

    const iconClasses = isVertical ? "w-4 h-4" : "w-5 h-5";
    const labelClasses = isVertical ? "text-[8px] font-medium hidden sm:block scale-90" : "text-[9px] font-medium";

    const commonButtonContent = (icon: any, label: string) => {
        const Icon = icon;
        return (
            <>
                <Icon className={iconClasses} />
                {!isVertical && <span className={labelClasses}>{label}</span>}
            </>
        );
    };

    return (
        <div className={containerClasses}>
            {tools.map((tool, index) => {
                if (tool.separator) {
                    return <div key={`sep-${index}`} className={cn("bg-white/20 mx-1", isVertical ? "w-8 h-px my-1" : "w-px h-8")} />;
                }

                const isActive = activeTool === tool.name;

                return (
                    <button
                        key={tool.name}
                        onClick={() => handleToolClick(tool.name!)}
                        className={buttonClasses(isActive)}
                        title={tool.label}
                    >
                        {commonButtonContent(tool.icon, tool.label)}
                    </button>
                );
            })}

            <div className={cn("bg-white/20 mx-1", isVertical ? "w-8 h-px my-1" : "w-px h-8")} />

            {/* Invert Button */}
            <button
                onClick={toggleInvert}
                className={buttonClasses(false)}
                title="Invertir Color"
            >
                {commonButtonContent(Contrast, "Invertir")}
            </button>

            {/* 1:1 Button */}
            <button
                onClick={handleOneToOne}
                className={cn(buttonClasses(false), "text-emerald-400/80 hover:text-emerald-300")}
                title="Tamaño Real 1:1"
            >
                {commonButtonContent(Maximize, "1:1")}
            </button>

            {/* Presets & Colormaps Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className={buttonClasses(false)}>
                        {commonButtonContent(Menu, "Ajustes")}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side={isVertical ? "right" : "top"}
                    align={isVertical ? "start" : "end"}
                    sideOffset={10}
                    className="bg-black/90 border-white/10 text-white backdrop-blur-xl w-48"
                >
                    <DropdownMenuItem disabled className="text-white/40 text-xs font-bold uppercase tracking-wider">Presets W/L</DropdownMenuItem>
                    {Object.entries(WINDOW_LEVEL_PRESETS).map(([key, preset]) => (
                        <DropdownMenuItem
                            key={key}
                            onClick={() => applyPreset(preset)}
                            className="bg-transparent hover:bg-white/10 cursor-pointer text-xs"
                        >
                            {preset.description}
                        </DropdownMenuItem>
                    ))}
                    <div className="h-px bg-white/10 my-1" />
                    <DropdownMenuItem disabled className="text-white/40 text-xs font-bold uppercase tracking-wider">Mapas de Color</DropdownMenuItem>
                    {COLORMAPS.map((cmap) => (
                        <DropdownMenuItem
                            key={cmap.name}
                            onClick={() => applyColormap(cmap.name)}
                            className="bg-transparent hover:bg-white/10 cursor-pointer text-xs"
                        >
                            {cmap.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

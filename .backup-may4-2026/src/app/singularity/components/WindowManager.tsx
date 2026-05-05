import React, { useRef, useCallback, useEffect } from 'react';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { useSingularityStore, WindowState } from '../store/useSingularityStore';
import { SalaDeGuerra } from '../modules/SalaDeGuerra';
import { ServidorLocal } from '../modules/ServidorLocal';
import { AtrioColaboracion } from '../modules/AtrioColaboracion';
import { AgentesModule } from '../modules/AgentesModule';

const MODULE_COMPONENTS = {
    'sala-guerra': SalaDeGuerra,
    'servidor-local': ServidorLocal,
    'atrio': AtrioColaboracion,
    'agentes': AgentesModule,
};

interface SingularityWindowProps {
    window: WindowState;
}

export const SingularityWindow: React.FC<SingularityWindowProps> = ({ window: win }) => {
    const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, updateWindowPosition, activeWindowId, theme } =
        useSingularityStore();

    const isActive = activeWindowId === win.id;
    const windowRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });

    const onMouseDownHeader = useCallback(
        (e: React.MouseEvent) => {
            if (win.isMaximized) return;
            focusWindow(win.id);
            dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: win.x, origY: win.y };
        },
        [win.id, win.x, win.y, win.isMaximized, focusWindow]
    );

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!dragRef.current.dragging) return;
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;
            const newX = Math.max(0, dragRef.current.origX + dx);
            const newY = Math.max(0, dragRef.current.origY + dy);
            updateWindowPosition(win.id, newX, newY);
        };
        const onMouseUp = () => { dragRef.current.dragging = false; };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [win.id, updateWindowPosition]);

    if (win.isMinimized) return null;

    const glowColor = isActive
        ? theme === 'legendary'
            ? 'rgba(255,215,0,0.7)'
            : 'rgba(0,212,255,0.6)'
        : 'rgba(255,255,255,0.06)';

    const style: React.CSSProperties = win.isMaximized
        ? { position: 'absolute', inset: 0, borderRadius: 0, zIndex: win.zIndex }
        : {
            position: 'absolute',
            left: win.x,
            top: win.y,
            width: win.width,
            height: win.height,
            zIndex: win.zIndex,
        };

    const ModuleContent = MODULE_COMPONENTS[win.moduleId];

    return (
        <div
            ref={windowRef}
            style={style}
            className="flex flex-col rounded-2xl overflow-hidden select-none"
            onMouseDown={() => focusWindow(win.id)}
            onClick={() => focusWindow(win.id)}
        >
            {/* Glassmorphism border/glow effect */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    border: `1px solid ${glowColor}`,
                    boxShadow: isActive ? `0 0 24px 2px ${glowColor}33, 0 8px 32px rgba(0,0,0,0.5)` : '0 8px 32px rgba(0,0,0,0.4)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
            />

            {/* Background glassmorphism */}
            <div
                className="absolute inset-0 rounded-2xl"
                style={{ background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            />

            {/* Header / Title Bar */}
            <div
                className="relative flex items-center gap-3 px-4 py-3 cursor-move border-b"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                onMouseDown={onMouseDownHeader}
                onDoubleClick={() => maximizeWindow(win.id)}
            >
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 z-10">
                    <button
                        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center group"
                        onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                    >
                        <X size={7} className="opacity-0 group-hover:opacity-100 text-red-900" />
                    </button>
                    <button
                        className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors flex items-center justify-center group"
                        onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
                    >
                        <Minus size={7} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
                    </button>
                    <button
                        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors flex items-center justify-center group"
                        onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}
                    >
                        {win.isMaximized
                            ? <Minimize2 size={7} className="opacity-0 group-hover:opacity-100 text-green-900" />
                            : <Maximize2 size={7} className="opacity-0 group-hover:opacity-100 text-green-900" />}
                    </button>
                </div>

                {/* Title */}
                <span className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-white/70 pointer-events-none">
                    {win.title}
                </span>
            </div>

            {/* Content */}
            <div className="relative flex-1 overflow-auto">
                <ModuleContent />
            </div>
        </div>
    );
};

export const WindowManager: React.FC = () => {
    const { windows } = useSingularityStore();

    return (
        <div className="relative flex-1 overflow-hidden">
            {windows.map(win => (
                <SingularityWindow key={win.id} window={win} />
            ))}
        </div>
    );
};

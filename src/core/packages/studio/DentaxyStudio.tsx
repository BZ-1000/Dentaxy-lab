import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Sidebar as SidebarIcon,
    Monitor,
    Layout,
    Layers,
    Component,
    Code2,
    Info,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Minus,
    X,
    FolderOpen,
    Copy,
    CheckCircle2,
    Lock,
    Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudioStore } from './engine/store';
import { toast } from 'sonner';
import DentaxyFormPanel from '../clinical-form';
import Landing from '@/pages/Landing';
import ShopAdminPreview from './previews/ShopAdminPreview';
import { AnimationsShowcase } from './showcase/AnimationsShowcase';
import { useElementInspector } from './hooks/useElementInspector';

// --- Apple Traffic Lights Component ---
const TrafficLights = ({ onClose, onMinimize, onMaximize }: { onClose?: () => void, onMinimize?: () => void, onMaximize?: () => void }) => (
    <div className="flex gap-2 px-4 group/controls">
        <motion.button
            whileHover={{ scale: 1.2 }}
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] relative flex items-center justify-center transition-colors"
        >
            <X size={8} className="opacity-0 group-hover/controls:opacity-100 text-[#4C0000] transition-opacity" />
        </motion.button>
        <motion.button
            whileHover={{ scale: 1.2 }}
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89F24] relative flex items-center justify-center transition-colors"
        >
            <Minus size={8} className="opacity-0 group-hover/controls:opacity-100 text-[#5C3C00] transition-opacity" />
        </motion.button>
        <motion.button
            whileHover={{ scale: 1.2 }}
            onClick={onMaximize}
            className="w-3 h-3 rounded-full bg-[#10B981] border border-[#059669] relative flex items-center justify-center transition-colors"
        >
            <Maximize2 size={8} className="opacity-0 group-hover/controls:opacity-100 text-[#004D32] transition-opacity" />
        </motion.button>
    </div>
);

export const DentaxyStudio = () => {
    const {
        inspectedFile,
        selectFile,
        isSidebarOpen,
        toggleSidebar,
        generateMetadata,
        isMaximized,
        toggleMaximized
    } = useStudioStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    // --- Inspector State ---
    const [isInspectorActive, setIsInspectorActive] = useState(false);
    const previewContainerRef = React.useRef<HTMLDivElement>(null);
    const { hoveredElement, selectedElement, setSelectedElement } = useElementInspector(previewContainerRef, isInspectorActive);

    const handleCopySpecs = () => {
        if (!inspectedFile && !selectedElement) return;

        let specs = '';
        if (selectedElement) {
            specs = `[ELEMENT_SPEC]
Tag: <${selectedElement.tagName}>
Classes: ${selectedElement.className}
Dimensions: ${Math.round(selectedElement.rect.width)}x${Math.round(selectedElement.rect.height)}
Content: "${selectedElement.text}"
Styles:
  - Color: ${selectedElement.computedStyles.color}
  - Background: ${selectedElement.computedStyles.backgroundColor}
  - Font: ${selectedElement.computedStyles.fontSize} ${selectedElement.computedStyles.fontFamily}
`;
        } else if (inspectedFile) {
            specs = generateMetadata(inspectedFile.name);
        }

        navigator.clipboard.writeText(specs);
        setCopySuccess(true);
        toast.success(selectedElement ? "Elemento clonado" : "Specs copiadas para Antigravity");
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleCloseOrMinimize = () => {
        if (isMaximized) {
            toggleMaximized();
        }
    };

    const handleClose = () => {
        if (isMaximized) {
            toggleMaximized();
        } else {
            selectFile(null);
            setSelectedElement(null);
            setIsInspectorActive(false);
        }
    };

    // Calculate highlighter position relative to the container usually
    // But since our preview might scroll, let's use fixed overlay or absolute matching the target.
    // simpler approach: Fixed overlay on top using getBoundingClientRect

    // We only show highlighter if active or something is selected
    // User requested: "si salgo de selector no aparezca nada del selector bugueado"
    const activeHighlight = isInspectorActive ? (hoveredElement || selectedElement) : null;

    return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-transparent overflow-hidden">
            {/* Highlighter Overlay - Removed from here, moved inside container */}

            <motion.div
                layout
                layoutId="studio-window"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    width: isMaximized ? '100vw' : '100%',
                    height: isMaximized ? '100vh' : '85vh',
                    maxWidth: isMaximized ? '100vw' : '1400px',
                    borderRadius: isMaximized ? '0rem' : '1.5rem',
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={cn(
                    "bg-white/80 backdrop-blur-3xl border border-white/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex overflow-hidden relative",
                    isMaximized && "fixed inset-0 z-[2000] border-none"
                )}
            >
                {/* --- SIDEBAR --- */}
                <AnimatePresence initial={false}>
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 260, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="h-full bg-white/20 border-r border-black/5 overflow-hidden flex flex-col"
                        >
                            <div className="h-14 flex items-center px-4 mb-4 mt-12">
                                <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] px-2">Explorar Proyecto</span>
                            </div>

                            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                                {[
                                    {
                                        group: 'Core Clinical', items: [
                                            { name: 'DentaxyFormPanel', label: 'Dentaxy Form', type: 'Form' as const, path: '/src/core/packages/clinical-form', icon: Layout },
                                            { name: 'PadecimientoActual', label: 'Padecimiento Actual', type: 'Section' as const, path: '/src/core/packages/clinical-form/components', icon: Component },
                                        ]
                                    },
                                    {
                                        group: 'Pages', items: [
                                            { name: 'LandingPage', label: 'Main Page', type: 'Page' as const, path: '/src/pages/Landing.tsx', icon: Layout },
                                            { name: 'ShopAdminLogin', label: 'Shop Admin + Popups', type: 'Page' as const, path: '/src/pages/shop/ShopLogin.tsx', icon: Lock },
                                        ]
                                    },
                                    {
                                        group: 'UI System', items: [
                                            { name: 'CoreInterface', label: 'Main Layout', type: 'View' as const, path: '/src/core/ui', icon: Monitor },
                                            { name: 'OrganicShopFrame', label: 'Apple Frame', type: 'UI' as const, path: '/src/components/shop', icon: Layers },
                                            { name: 'AnimationsShowcase', label: 'Animations Showcase', type: 'System' as const, path: '/src/core/packages/studio/showcase', icon: Play },
                                            { name: 'DentaxyStudio', label: 'Studio v3.0', type: 'Utility' as const, path: '/src/core/packages/studio', icon: Code2 },
                                        ]
                                    }
                                ].map((group) => {
                                    const filteredItems = group.items.filter(item =>
                                        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        item.name.toLowerCase().includes(searchQuery.toLowerCase())
                                    );

                                    if (filteredItems.length === 0) return null;

                                    return (
                                        <div key={group.group} className="mb-4">
                                            <h3 className="px-4 py-2 text-[10px] font-bold text-black/20 uppercase">{group.group}</h3>
                                            {filteredItems.map(item => (
                                                <SidebarItem
                                                    key={item.name}
                                                    icon={item.icon}
                                                    label={item.label}
                                                    onClick={() => {
                                                        selectFile(item);
                                                        setSelectedElement(null); // Reset element selection on file change
                                                        setIsInspectorActive(false);
                                                    }}
                                                    active={inspectedFile?.name === item.name}
                                                />
                                            ))}
                                        </div>
                                    );
                                })}
                            </nav>

                            <div className="p-4 mt-auto">
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Vibe Coding Sync</span>
                                    </div>
                                    <p className="text-[9px] text-emerald-600/60 font-medium">Motor de clonación listo.</p>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#F5F5F7]/20">
                    <header className="h-14 border-b border-black/5 flex items-center justify-between px-4 z-10">
                        <div className="flex items-center gap-4">
                            {!isSidebarOpen && <TrafficLights onClose={handleClose} onMinimize={handleCloseOrMinimize} onMaximize={toggleMaximized} />}
                            <div className="flex items-center gap-1 ml-2">
                                <button
                                    onClick={toggleSidebar}
                                    className="p-1.5 hover:bg-black/5 rounded-lg transition-all active:scale-90"
                                >
                                    <SidebarIcon size={18} className="text-black/60" />
                                </button>
                            </div>
                            <h1 className="text-[13px] font-bold text-black/80 tracking-tight">Dentaxy Studio <span className="text-black/20 font-medium ml-2">— {selectedElement ? `Inspecting <${selectedElement.tagName}>` : (inspectedFile?.name || 'Visor')}</span></h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* INSPECTOR TOGGLE */}
                            <button
                                onClick={() => {
                                    const nextState = !isInspectorActive;
                                    setIsInspectorActive(nextState);
                                    if (!nextState) {
                                        // Optionally clear selection? User didn't explicitly ask to clear the panel, just the visual box.
                                        // But often behavior is: Exit inspector -> Keep selection in panel but stop highlighting.
                                    }
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border",
                                    isInspectorActive
                                        ? "bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-500/20"
                                        : "bg-white text-black/60 border-black/5 hover:bg-slate-50"
                                )}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path d="M13 13l6 6" /></svg>
                                <span>{isInspectorActive ? 'Selector Activo' : 'Selector'}</span>
                            </button>

                            <div className="relative group/search">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
                                <input
                                    type="text"
                                    placeholder="Buscar en archivos..."
                                    className="w-64 h-8 bg-black/5 border-none rounded-lg pl-9 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="p-1.5 hover:bg-black/5 rounded-lg transition-colors">
                                <Info size={18} className="text-black/40" />
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-8 overflow-auto flex flex-col items-center">
                        <AnimatePresence mode="wait">
                            {inspectedFile ? (
                                <motion.div
                                    key={inspectedFile.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="w-full max-w-4xl space-y-8 pb-20"
                                >
                                    {/* PREVIEW CARD */}
                                    <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden group">
                                        <div className="p-6 border-b border-black/[0.03] bg-black/[0.01] flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                                    <Component size={20} />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-black text-black tracking-tight">{inspectedFile.name} <span className="text-black/20 font-medium ml-2 text-sm">{selectedElement ? `> <${selectedElement.tagName.toLowerCase()}>` : ''}</span></h2>
                                                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{inspectedFile.path}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="px-4 py-2 bg-black text-white text-[11px] font-bold rounded-full hover:scale-105 active:scale-95 transition-all">
                                                    Abrir Código
                                                </button>
                                            </div>
                                        </div>

                                        <div
                                            ref={previewContainerRef}
                                            className="p-12 flex items-center justify-center bg-transparent min-h-[400px] relative"
                                        >
                                            {/* Highlighter Overlay */}
                                            {(activeHighlight && activeHighlight.relativeRect) && (
                                                <motion.div
                                                    layoutId="highlighter"
                                                    initial={{ opacity: 0 }}
                                                    animate={{
                                                        opacity: 1,
                                                        top: activeHighlight.relativeRect.top,
                                                        left: activeHighlight.relativeRect.left,
                                                        width: activeHighlight.relativeRect.width,
                                                        height: activeHighlight.relativeRect.height,
                                                    }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                    className={cn(
                                                        "absolute z-[50] pointer-events-none rounded border-2 box-border transition-colors",
                                                        isInspectorActive && !selectedElement ? "border-blue-500/50 bg-blue-500/10" : "border-emerald-500 bg-emerald-500/10"
                                                    )}
                                                >
                                                    <div className="absolute -top-6 left-0 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                                        {activeHighlight.tagName.toLowerCase()}
                                                        {activeHighlight.className && <span className="opacity-50 ml-1">.{activeHighlight.className.split(' ')[0]}</span>}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {inspectedFile.name === 'DentaxyFormPanel' ? (
                                                <div className="w-full scale-90 origin-top">
                                                    <DentaxyFormPanel />
                                                </div>
                                            ) : inspectedFile.name === 'LandingPage' ? (
                                                <div className="w-full h-full overflow-hidden border border-black/10 rounded-xl shadow-2xl bg-white origin-top scale-[0.6]">
                                                    <Landing />
                                                </div>
                                            ) : inspectedFile.name === 'ShopAdminLogin' ? (
                                                <div className="w-full h-[700px] overflow-hidden border border-black/10 rounded-xl shadow-2xl bg-white origin-top scale-[0.75]">
                                                    <ShopAdminPreview />
                                                </div>
                                            ) : inspectedFile.name === 'AnimationsShowcase' ? (
                                                <div className="w-full h-full">
                                                    <AnimationsShowcase />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center text-center opacity-40">
                                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                                        <Monitor size={32} />
                                                    </div>
                                                    <p className="text-sm font-bold uppercase tracking-widest">Visualización en Vivo</p>
                                                    <p className="text-xs mt-1">El componente se renderizará aquí para inspección visual.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* CLONING BOX (VIBE CODING ENGINE) */}
                                    <div className="bg-[#1C1C1E] rounded-[2rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />

                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                    <Code2 size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-black text-lg tracking-tight">Caja de Clonación</h3>
                                                    <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-[0.2em]">{selectedElement ? "Element Selector Active" : "Antigravity Vibe Sync"}</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleCopySpecs}
                                                className={cn(
                                                    "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs transition-all active:scale-95 shadow-xl",
                                                    copySuccess
                                                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                                        : "bg-white text-black hover:bg-slate-100"
                                                )}
                                            >
                                                {copySuccess ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                                {copySuccess ? 'Copiado' : 'Copiar Specs'}
                                            </button>
                                        </div>

                                        <div className="p-6 bg-black/40 rounded-2xl border border-white/5 font-mono text-[13px] leading-relaxed text-emerald-400/80 shadow-inner max-h-96 overflow-auto custom-scrollbar">
                                            {selectedElement ? (
                                                <div className="space-y-3">
                                                    <div className="flex gap-4 border-b border-white/5 pb-2 mb-4">
                                                        <span className="text-emerald-500 font-bold uppercase tracking-wider">Detalles del Elemento Seleccionado</span>
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-blue-400 font-bold text-[10px] uppercase">Etiqueta HTML</span>
                                                        <span className="text-white bg-white/5 px-2 py-1 rounded w-fit">&lt;{selectedElement.tagName.toLowerCase()}&gt;</span>
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-blue-400 font-bold text-[10px] uppercase">Clases (Tailwind)</span>
                                                        <div className="text-white/70 break-all text-[11px] leading-tight bg-black/30 p-2 rounded border border-white/5">
                                                            {selectedElement.className || "Sin clases"}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-blue-400 font-bold text-[10px] uppercase">Dimensiones</span>
                                                            <span className="text-white/60">{Math.round(selectedElement.rect.width)}px x {Math.round(selectedElement.rect.height)}px</span>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-blue-400 font-bold text-[10px] uppercase">Texto Interno</span>
                                                            <span className="text-white/60 truncate" title={selectedElement.text}>"{selectedElement.text || ''}"</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-1 mt-2">
                                                        <span className="text-blue-400 font-bold text-[10px] uppercase">Estilos Computados Clave</span>
                                                        <div className="grid grid-cols-2 gap-2 text-[11px] text-white/50">
                                                            <div className="flex justify-between"><span>Color:</span> <span className="text-white/80">{selectedElement.computedStyles.color}</span></div>
                                                            <div className="flex justify-between"><span>Bg:</span> <span className="text-white/80">{selectedElement.computedStyles.backgroundColor}</span></div>
                                                            <div className="flex justify-between"><span>Font:</span> <span className="text-white/80">{selectedElement.computedStyles.fontSize}</span></div>
                                                            <div className="flex justify-between"><span>Padding:</span> <span className="text-white/80">{selectedElement.computedStyles.padding}</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex gap-4">
                                                        <span className="text-emerald-500/20">01</span>
                                                        <span>[CLONE_REQUEST]</span>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <span className="text-emerald-500/20">02</span>
                                                        <span className="text-blue-400">Component:</span>
                                                        <span>{inspectedFile.name}</span>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <span className="text-emerald-500/20">03</span>
                                                        <span className="text-blue-400">Path:</span>
                                                        <span className="text-white/60">{inspectedFile.path}</span>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <span className="text-emerald-500/20">04</span>
                                                        <span className="text-blue-400">Type:</span>
                                                        <span className="px-2 py-0.5 bg-emerald-500/10 rounded text-[10px] font-bold uppercase">{inspectedFile.type}</span>
                                                    </div>
                                                    <div className="flex gap-4 mt-4">
                                                        <span className="text-emerald-500/20">05</span>
                                                        <span className="opacity-40 italic">// Selector inactivo. Activa el selector para inspeccionar elementos específicos.</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                                    <div className="w-24 h-24 bg-black/5 rounded-[2rem] flex items-center justify-center mb-8">
                                        <FolderOpen size={48} className="text-black/20" />
                                    </div>
                                    <h2 className="text-2xl font-black text-black">Explorador Dentaxy Studio</h2>
                                    <p className="text-sm text-black/40 mt-2 max-w-xs">Selecciona un elemento de la barra lateral para inspeccionarlo y extraer sus metadatos.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>

                {
                    isSidebarOpen && (
                        <div className="absolute top-4 left-0 z-50">
                            <TrafficLights onClose={handleClose} onMinimize={handleCloseOrMinimize} onMaximize={toggleMaximized} />
                        </div>
                    )
                }
            </motion.div >
        </div >
    );
};

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300",
            active
                ? "bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20"
                : "text-black/50 hover:bg-black/5 hover:text-black font-medium"
        )}
    >
        <Icon size={18} className={cn(active ? "text-white" : "text-black/30")} />
        <span className="flex-1 text-left">{label}</span>
        {active && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
    </button>
);


import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Globe as GlobeIcon } from 'lucide-react';

// Hook robusto para detectar redimensionamiento sin dependencias externas
function useElementSize<T extends HTMLElement = HTMLDivElement>(): [React.RefObject<T>, { width: number; height: number }] {
    const ref = useRef<T>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    const handleResize = useCallback(() => {
        if (ref.current) {
            setSize({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            });
        }
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        handleResize();

        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(() => handleResize());
            resizeObserver.observe(element);
            return () => resizeObserver.disconnect();
        } else {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [handleResize]);

    return [ref, size];
}

interface SimpleGlobeVisualizationProps {
    activeNodes: number;
}

// Componente de visualización 2D simplificado y robusto
const SimpleGlobeVisualization: React.FC<SimpleGlobeVisualizationProps> = ({ activeNodes }) => {
    const [pulseIndex, setPulseIndex] = useState(0);

    // Generar nodos visuales basados en la cantidad real (max 20 para no saturar)
    // Si activeNodes es 0, no hay nodos.
    const nodes = useMemo(() => {
        if (activeNodes === 0) return [];

        // Mostrar hasta 20 puntos visuales representativos
        const visualNodeCount = Math.min(Math.max(3, Math.ceil(activeNodes / 50)), 20);

        return Array.from({ length: visualNodeCount }).map(() => ({
            x: 20 + Math.random() * 60, // Mantener en el centro (20-80%)
            y: 20 + Math.random() * 60,
            color: Math.random() > 0.5 ? 'bg-cyan-400' : 'bg-purple-400'
        }));
    }, [activeNodes]);

    useEffect(() => {
        if (nodes.length === 0) return;
        const interval = setInterval(() => {
            setPulseIndex(prev => (prev + 1) % nodes.length);
        }, 1000);
        return () => clearInterval(interval);
    }, [nodes.length]);

    return (
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="relative w-[400px] h-[400px]">
                {/* Círculo principal (globo simplificado) */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />
                <div className="absolute inset-8 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-16 rounded-full border border-cyan-500/10" />

                {/* Nodos distribuidos */}
                {nodes.map((node, i) => (
                    <div
                        key={i}
                        className={`absolute w-3 h-3 rounded-full ${node.color} shadow-lg ${pulseIndex === i ? 'animate-ping' : ''}`}
                        style={{
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

interface GlobeVisualizerProps {
    activeNodes?: number;
}

export const GlobeVisualizer: React.FC<GlobeVisualizerProps> = ({ activeNodes = 0 }) => {
    const [containerRef] = useElementSize<HTMLDivElement>();

    return (
        <div ref={containerRef} className="relative w-full h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl">
            {/* Overlay UI - restored */}
            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_#22d3ee] ${activeNodes > 0 ? 'bg-cyan-400 animate-pulse' : 'bg-red-500'}`} />
                    <h3 className="text-sm font-bold tracking-widest text-white uppercase">Global Network</h3>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                    {activeNodes > 0 ? "Live Node Connections" : "No Active Connections"}
                </p>
            </div>

            {/* Visualización simplificada 2D */}
            <SimpleGlobeVisualization activeNodes={activeNodes} />

            {/* Icono central decorativo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <GlobeIcon className={`w-32 h-32 ${activeNodes > 0 ? 'text-cyan-500/10' : 'text-zinc-800/20'}`} strokeWidth={1} />
            </div>
        </div>
    );
};

import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { motion } from 'framer-motion';

interface NetworkActivityGraphProps {
    className?: string;
    opsPerMinute: number; // Datos reales de operaciones por minuto
}

export const NetworkActivityGraph: React.FC<NetworkActivityGraphProps> = ({ className, opsPerMinute }) => {
    // Historial de datos reales
    const [data, setData] = React.useState<Array<{ index: number, value: number }>>([]);

    // Actualizar gráfico SOLO cuando cambian los datos reales
    React.useEffect(() => {
        setData(currentData => {
            const newData = [...currentData];
            if (newData.length > 40) newData.shift(); // Mantener ventana de tiempo fija

            newData.push({
                index: Date.now(),
                value: opsPerMinute // Usar valor crudo, sin variación artificial
            });
            return newData;
        });
    }, [opsPerMinute]);

    return (
        <div className={`relative h-48 w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm ${className}`}>
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />

            {/* Header */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30 animate-pulse">
                    LIVE DATA
                </div>
                <span className="text-zinc-500 text-xs font-mono">{opsPerMinute.toLocaleString()} OPS/MIN</span>
            </div>

            <div className="absolute inset-0 top-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <YAxis hide domain={[0, 100]} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Scan line overlay */}
            <motion.div
                className="absolute inset-y-0 w-px bg-cyan-400/50 shadow-[0_0_15px_#22d3ee] z-20 pointer-events-none"
                animate={{ left: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

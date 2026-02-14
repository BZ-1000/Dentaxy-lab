
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Lock, Unlock } from 'lucide-react';

interface SecurityMatrixProps {
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const SecurityMatrix: React.FC<SecurityMatrixProps> = ({ threatLevel }) => {

    // Configuración basada en nivel de amenaza
    const config = {
        low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', status: 'SECURE' },
        medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', status: 'WARNING' },
        high: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', status: 'CRITICAL' },
        critical: { color: 'text-rose-600', bg: 'bg-rose-500/20', border: 'border-rose-500/50', status: 'BREACH' },
    }[threatLevel];

    // Celdas de la matriz (hexágonos simulados visualmente)
    const cells = Array.from({ length: 12 });

    return (
        <div className={`relative overflow-hidden rounded-xl border ${config.border} ${config.bg} p-4 backdrop-blur-md`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ShieldCheck className={`h-5 w-5 ${config.color}`} />
                    <span className="text-xs font-mono font-bold text-zinc-300">SECURITY MATRIX</span>
                </div>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${config.bg} ${config.color} border ${config.border} animate-pulse`}>
                    {config.status}
                </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {cells.map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                        className={`aspect-square rounded-sm border ${config.border} bg-white/5 relative group hover:bg-white/10 transition-colors`}
                    >
                        {/* Simular actividad aleatoria en celdas */}
                        {Math.random() > 0.7 && (
                            <div className={`absolute inset-0.5 ${config.bg} opacity-50`} />
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>ENCRYPTION: AES-256</span>
                <span>INTEGRITY: 100%</span>
            </div>
        </div>
    );
};

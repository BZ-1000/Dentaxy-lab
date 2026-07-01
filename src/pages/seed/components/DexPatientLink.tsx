import React from 'react';
import { X } from 'lucide-react';

export default function DexPatientLink({ 
  clinicId, 
  activePatientName,
  onClose
}: { 
  clinicId: string; 
  activePatientName?: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-[380px] rounded-3xl p-6 shadow-2xl relative flex flex-col items-center border animate-in zoom-in-95 duration-300 text-center"
        style={{
          background: 'var(--seed-card-bg, rgba(255, 255, 255, 0.85))',
          borderColor: 'var(--seed-card-border, rgba(0, 0, 0, 0.1))',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
        }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-500/10 text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
          Lobby Digital
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 px-4 leading-relaxed font-medium">
          [Lobby digital en rediseño para la clínica {clinicId}]
        </p>
      </div>
    </div>
  );
}

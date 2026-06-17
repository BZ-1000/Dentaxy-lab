import React, { useState } from 'react';
import { Users, Search, Filter, ShieldAlert, ChevronRight, Activity, Calendar } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function SeedPatientsListView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Sincronización de lista exitosa:', tokenResponse);
      setIsAuthenticated(true);
      setIsSyncing(false);
    },
    onError: () => {
      console.error('Error de autenticación Google');
      setIsSyncing(false);
    },
    scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly'
  });

  const handleSync = () => {
    setIsSyncing(true);
    login();
  };

  // Simulación de expedientes estructurados como notificaciones de iOS
  const mockPatients = [
    { id: 1, name: 'Ana María López Gómez', status: 'Urgencia', age: '34 años', lastVisit: 'Hoy, 10:30', color: 'bg-red-500', text: 'text-red-500' },
    { id: 2, name: 'Carlos Eduardo Ruiz', status: 'En Tratamiento', age: '45 años', lastVisit: 'Ayer', color: 'bg-emerald-500', text: 'text-emerald-500' },
    { id: 3, name: 'Valeria Sofía Martínez', status: 'Alta Médica', age: '28 años', lastVisit: '12 Jun, 2026', color: 'bg-blue-500', text: 'text-blue-500' },
  ];

  return (
    <div className="w-full max-w-5xl px-8 z-30 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
      
      {/* 1. CONTROLES SUPERIORES (Cápsulas independientes flotando en el fondo) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Widget del Título del Directorio */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#0c0c0f] border border-slate-100 dark:border-white/5 px-5 py-3 rounded-[20px] shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
            <Users size={16} className="text-slate-600 dark:text-white/60" />
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-white/90 font-semibold text-xs leading-none">Pacientes</h3>
            <span className="text-[9px] text-slate-400 dark:text-white/30 tracking-wider uppercase">Directorio Clínico</span>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Búsqueda */}
          <div className="relative flex-1 sm:flex-initial">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" />
            <input 
              type="text" 
              placeholder="Buscar expediente..." 
              className="w-full sm:w-64 h-10 bg-white dark:bg-[#0c0c0f] border border-slate-100 dark:border-white/5 rounded-full pl-10 pr-4 text-slate-800 dark:text-white text-xs focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 shadow-lg placeholder:text-slate-400 dark:placeholder:text-white/20" 
            />
          </div>
          {/* Filtro */}
          <button className="h-10 px-4 bg-white dark:bg-[#0c0c0f] border border-slate-100 dark:border-white/5 rounded-full flex items-center gap-2 text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5 transition shadow-lg cursor-pointer text-xs font-semibold">
            <Filter size={14} />
            <span>Filtros</span>
          </button>
        </div>

      </div>

      {/* 2. ÁREA PRINCIPAL DE CONTENIDO */}
      <div className="flex-1 flex flex-col justify-center items-center py-2">
        {isAuthenticated ? (
          /* Listado de expedientes al estilo Notificaciones iOS */
          <div className="w-full max-w-2xl space-y-3">
            <div className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest px-2 mb-2">Recientes</div>
            {mockPatients.map((patient) => (
              <div 
                key={patient.id}
                className="w-full bg-white dark:bg-[#0c0c0f] border border-slate-100 dark:border-white/5 rounded-[22px] p-4 shadow-md hover:shadow-xl dark:hover:border-white/10 hover:scale-[1.01] transition-all duration-300 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  {/* Status Indicator */}
                  <div className={`w-10 h-10 rounded-full ${patient.color}/10 flex items-center justify-center border border-${patient.color}/20`}>
                    <Activity size={18} className={patient.text} />
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white/90 font-bold text-sm leading-tight">{patient.name}</h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-slate-400 dark:text-white/40 font-medium flex items-center gap-1">
                        <Calendar size={10} />
                        Cita: {patient.lastVisit}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${patient.color}/10 ${patient.text}`}>
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 dark:text-white/30 font-medium">{patient.age}</span>
                  <ChevronRight size={16} className="text-slate-300 dark:text-white/20 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tarjeta de Autenticación estilo iOS / Apple Notification */
          <div className="w-full max-w-md bg-white dark:bg-[#0c0c0f] border border-slate-100 dark:border-white/5 rounded-[28px] p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-400 to-blue-500"></div>
            
            <div className="w-12 h-12 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center border border-blue-200 dark:border-blue-500/20 mb-4">
              <ShieldAlert size={22} className="text-blue-500 dark:text-blue-400" />
            </div>

            <h3 className="text-slate-800 dark:text-white font-bold text-sm">Autenticación de Drive Requerida</h3>
            <p className="text-slate-400 dark:text-white/50 text-[11px] mt-2 leading-relaxed max-w-[260px]">
              Sincroniza con Google Drive para recuperar los expedientes dentales guardados en tu espacio seguro.
            </p>

            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <img src="/logos/google-drive.png" alt="Drive" className="w-4 h-4 object-contain" />
              {isSyncing ? 'Conectando...' : 'Sincronizar con Drive'}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

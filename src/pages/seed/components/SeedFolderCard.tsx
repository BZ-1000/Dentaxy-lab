import React, { useState, useEffect } from 'react';
import { ExternalLink, FolderOpen } from 'lucide-react';

export default function SeedFolderCard({ 
  activePatient,
  onHoverChange,
  onOpenFolder
}: { 
  activePatient?: any;
  onHoverChange?: (hovered: boolean) => void;
  onOpenFolder?: (folder: any, rect: DOMRect) => void;
}) {
  const isFolderEmpty = !activePatient || activePatient.id === 999;
  const name = isFolderEmpty ? 'Expediente Vacío' : activePatient.name;
  const date = isFolderEmpty 
    ? '--' 
    : new Date(activePatient.createdTime).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  const phone = activePatient?.appProperties?.telefono || 'Sin teléfono';
  
  // Lógica determinista y traducciones
  const motivoRaw = activePatient?.appProperties?.motivo || 'primera';
  const motiveMap: { [key: string]: string } = {
    primera: 'Valoración inicial',
    urgencia: 'Urgencia dental',
    limpieza: 'Limpieza / Profilaxis',
    ortodoncia: 'Ortodoncia',
    cirugia: 'Cirugía dental'
  };
  const translatedMotivo = motiveMap[motivoRaw] || motivoRaw;

  const allergies = activePatient?.appProperties?.alergias || '';
  const hasAllergies = allergies && allergies.toLowerCase() !== 'ninguna' && allergies.trim() !== '';

  // Hashes deterministas basados en el ID de la carpeta
  const shortId = activePatient?.id ? activePatient.id.slice(0, 4) : '';
  const idNum = activePatient?.id ? parseInt(activePatient.id.slice(0, 3), 36) || 0 : 0;
  
  const odontogramaValue = activePatient?.id ? `${idNum % 5}/32 Marcados` : '0/32 Marcados';
  const faseValue = `Fase ${(idNum % 3) + 1} (${(idNum % 3) === 0 ? 'Diagnóstico' : (idNum % 3) === 1 ? 'Tratamiento' : 'Mantenimiento'})`;
  const estatusOptions = ['Esperando Notas', 'En Tratamiento', 'Alta Clínica'];
  const statusValue = activePatient?.id ? estatusOptions[idNum % 3] : '--';

  // Consulta en tiempo real a Google Drive API
  const [fileCount, setFileCount] = useState<number | null>(null);

  useEffect(() => {
    if (!activePatient || activePatient.id === 999) {
      setFileCount(null);
      return;
    }
    const fetchFileCount = async () => {
      try {
        const seedUserStr = sessionStorage.getItem('seed_user');
        if (!seedUserStr) return;
        const seedUser = JSON.parse(seedUserStr);
        const accessToken = seedUser.googleAccessToken;
        if (!accessToken) return;

        const query = encodeURIComponent(`'${activePatient.id}' in parents and trashed = false`);
        const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id)`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await res.json();
        if (data.files) {
          setFileCount(data.files.length);
        }
      } catch (e) {
        console.error("Error fetching file count:", e);
      }
    };
    fetchFileCount();
  }, [activePatient]);

  return (
    <div className="relative w-full h-full flex flex-col justify-end pb-2 px-2">
      
      {/* --- DEFINICIONES DE CLIP PATHS PARA LAS CARPETAS --- */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="folder-clip-left" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.92 
                     C 0,0.98, 0.02,1, 0.06,1 
                     L 0.94,1 
                     C 0.98,1, 1,0.98, 1,0.92 
                     L 1,0.20 
                     C 1,0.16, 0.98,0.13, 0.95,0.13 
                     L 0.45,0.13 
                     C 0.42,0.13, 0.40,0.13, 0.38,0.09 
                     C 0.36,0.05, 0.33,0.02, 0.30,0.02 
                     L 0.06,0.02 
                     C 0.02,0.02, 0,0.06, 0,0.12 
                     Z" />
          </clipPath>
        </defs>
      </svg>

      {/* --- CARPETA PRINCIPAL (Vista Previa de Paciente) --- */}
      <div 
        className="relative w-full h-[400px] seed-compliance-card hover:-translate-y-[100px] hover:z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          borderRadius: '24px',
        }}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
      >
        {/* CAPA 1: SOLAPA TRASERA DE LA CARPETA */}
        <div
          className="absolute inset-0 seed-folder-back drop-shadow-md"
          style={{
            clipPath: 'url(#folder-clip-left)',
            background: 'var(--seed-white-glass-bg)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-500 opacity-[0.65]"></div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1 1" preserveAspectRatio="none">
            <path 
              d="M 0,0.92 C 0,0.98 0.02,1 0.06,1 L 0.94,1 C 0.98,1 1,0.98 1,0.92 L 1,0.20 C 1,0.16 0.98,0.13 0.95,0.13 L 0.45,0.13 C 0.42,0.13 0.40,0.13 0.38,0.09 C 0.36,0.05 0.33,0.02 0.30,0.02 L 0.06,0.02 C 0.02,0.02 0,0.06 0,0.12 Z" 
              fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.012" vectorEffect="non-scaling-stroke" 
            />
          </svg>
          
          {/* Nombre en la Pestaña */}
          {!isFolderEmpty && (
            <div className="absolute top-5 left-6 w-[38%] overflow-hidden z-10">
              <span 
                className="block text-white font-medium text-[11px] uppercase tracking-[0.25em] truncate antialiased"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
              >
                {name}
              </span>
            </div>
          )}
        </div>

        {/* CAPA 2: HOJA DE PAPEL INTERNA */}
        <div
          className="absolute left-[20px] right-[20px] top-[44px] h-[310px] rounded-2xl shadow-md z-10 p-5 flex flex-col justify-between overflow-hidden"
          style={{
            transform: 'rotate(-0.6deg)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="w-full h-full flex flex-col justify-between opacity-10 pointer-events-none select-none">
            <div className="space-y-3">
              <div className="w-16 h-3 bg-emerald-500 rounded-md"></div>
              <div className="space-y-2">
                <div className="w-full h-1.5 bg-slate-300 rounded-sm"></div>
                <div className="w-[90%] h-1.5 bg-slate-300 rounded-sm"></div>
                <div className="w-[95%] h-1.5 bg-slate-300 rounded-sm"></div>
                <div className="w-[85%] h-1.5 bg-slate-300 rounded-sm"></div>
                <div className="w-[88%] h-1.5 bg-slate-300 rounded-sm"></div>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-sm"></div>
          </div>
        </div>

        {/* LOMO 3D FÍSICO */}
        <div className="seed-folder-spine" style={{ left: '24px', right: '24px' }}></div>

        {/* CAPA 3: SOLAPA DELANTERA (Panel Médico Compacto) */}
        <div
          className="absolute top-[65px] left-0 right-0 bottom-0 z-20 seed-folder-front"
          style={{
            transform: 'translate3d(0, 0, 24px)',
            transformStyle: 'preserve-3d',
            borderRadius: '16px 16px 24px 24px',
            borderTop: '1.5px solid rgba(255,255,255,0.5)',
            borderLeft: '1px solid rgba(255,255,255,0.3)',
            borderRight: '1px solid rgba(255,255,255,0.3)',
            borderBottom: '1.5px solid rgba(255,255,255,0.3)',
            boxShadow: '0 10px 30px -4px rgba(0,0,0,0.18), inset 0 2px 6px rgba(255,255,255,0.4)',
            background: 'transparent',
            overflow: 'hidden',
          }}
        >
          {/* Fondo Original Verde Esmeralda */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-500 opacity-95"></div>
          {/* Reflejo Glass Original */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/[0.05] to-transparent pointer-events-none z-10"></div>

          {isFolderEmpty ? (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center p-6 gap-2 z-20">
              <span className="text-white/40 text-[40px] mb-2"><FolderOpen size={48} /></span>
              <h3 className="text-white font-bold text-[18px] tracking-wide">Panel de Control Médico</h3>
              <p className="text-emerald-50 text-[13px] max-w-[280px] leading-relaxed">
                Selecciona un expediente en el carrusel superior para visualizar el estado de salud del paciente.
              </p>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col z-20 h-full">
              
              {/* Área Scrollable (Vacía por ahora) */}
              <div className="flex-1 overflow-y-auto px-6 pb-8 pt-6 custom-scrollbar relative z-10" style={{ scrollbarWidth: 'none' }}>
                <div className="flex flex-col gap-8">
                  {/* Contenido eliminado a petición del usuario */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

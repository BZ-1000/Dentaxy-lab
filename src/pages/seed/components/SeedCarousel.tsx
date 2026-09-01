import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  getPatientsFromSnapshot,
  loadDriveSnapshot,
  isSnapshotFresh,
  addPatientToSnapshot,
} from '../../../utils/driveSnapshot';
import { ArrowUpRight, FolderOpen, Plus } from 'lucide-react';

interface SeedCarouselProps {
  onOpenFolder?: (folder: any, rect: DOMRect) => void;
  onOpenAddPatient?: () => void;
  onActivePatientChange?: (patient: any) => void;
  onPatientsLoad?: (patients: any[]) => void;
  isExpedienteOpen?: boolean;
}

export default function SeedCarousel({ 
  onOpenFolder, 
  onOpenAddPatient, 
  onActivePatientChange,
  onPatientsLoad,
  isExpedienteOpen = false
}: SeedCarouselProps) {
  const onPatientsLoadRef = useRef(onPatientsLoad);
  
  useEffect(() => {
    onPatientsLoadRef.current = onPatientsLoad;
  }, [onPatientsLoad]);

  // Mapeamos una sola tarjeta especial para el expediente vacío que heredará las físicas 3D
  const EMPTY_CARD = {
    id: 999,
    label: 'Expediente Vacío',
    percent: 0,
    sub: 'Sin registros clínicos',
    colorClass: 'bg-gradient-to-br from-emerald-400 to-emerald-500'
  };

  const [activeIndex, setActiveIndex] = useState(0); 
  const isScrolling = useRef(false);
  const [patients, setPatients] = useState<any[]>([]);
  const patientsRef = useRef<any[]>([]);
  useEffect(() => {
    patientsRef.current = patients;
  }, [patients]);

  // Sincronizar pacientes con sessionStorage para Dex
  useEffect(() => {
    if (patients && patients.length > 0) {
      const simplified = patients.map(p => ({
        id: p.id,
        name: p.name
      }));
      sessionStorage.setItem('dentaxy_patients_list', JSON.stringify(simplified));
    }
  }, [patients]);
  
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Carga pacientes desde el snapshot local (localStorage).
   * Si el snapshot está vacío o expirado, dispara loadDriveSnapshot() para refrescarlo.
   * Esto garantiza que el carrusel aparezca en <5ms en la mayoría de los casos.
   */
  const fetchPatients = useCallback(async () => {
    try {
      // 1. Intentar leer desde snapshot local (retorno instantáneo)
      const cachedPatients = getPatientsFromSnapshot();
      if (cachedPatients && cachedPatients.length > 0 && isSnapshotFresh()) {
        setPatients(cachedPatients);
        onPatientsLoadRef.current?.(cachedPatients);
        setActiveIndex(0);
        setIsLoading(false);
        return;
      }

      // 2. Snapshot vacío o expirado → cargar desde Drive
      const seedUserStr = sessionStorage.getItem('seed_user');
      if (!seedUserStr) { setIsLoading(false); return; }
      const seedUser = JSON.parse(seedUserStr);
      const accessToken = seedUser?.googleAccessToken;
      if (!accessToken) { setIsLoading(false); return; }

      // Si hay datos cacheados aunque estén expirados, mostrarlos mientras se recarga
      if (cachedPatients && cachedPatients.length > 0) {
        setPatients(cachedPatients);
        onPatientsLoadRef.current?.(cachedPatients);
        setIsLoading(false);
      }

      // Refrescar snapshot en background
      const snapshot = await loadDriveSnapshot(accessToken);
      if (snapshot && snapshot.patients.length > 0) {
        setPatients(snapshot.patients);
        onPatientsLoadRef.current?.(snapshot.patients);
        setActiveIndex(0);
      }
    } catch (err) {
      console.error('[DentaxyCarousel] Error al cargar pacientes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
    const handlePatientCreated = () => fetchPatients();
    
    // Agregar paciente instantáneamente al carrusel sin esperar Drive
    const handleLocalPatient = (e: Event) => {
      const ev = e as CustomEvent;
      const { name, telefono } = ev.detail || {};
      if (!name) return;
      const newPatient = {
        id: `LOCAL-${Date.now()}`,
        name,
        appProperties: {
          telefono: telefono || '',
          motivo: 'Valoración inicial (DEX AI)',
          alergias: 'Ninguna'
        }
      };
      // Persistir en snapshot local para que no desaparezca al reabrir
      addPatientToSnapshot(newPatient);
      setPatients(prev => {
        const exists = prev.some(p => p.name === name);
        if (exists) return prev;
        return [newPatient, ...prev];
      });
      setActiveIndex(0);
      onPatientsLoadRef.current?.([newPatient]);
    };

    // ── DEX: navegar y enfocar paciente buscado ──────────────────────────
    const handleSearchCommand = (query: string) => {
      const val = query.trim().toLowerCase();
      const qStr = val.replace(/^(busca al paciente|buscar al paciente|busca al|buscar al|busca paciente|buscar paciente|busca a|buscar a|busca|buscar|quiero ver a|quiero ver|abre a|abrir a|abre|abrir|encuentra a|encuentra)\s+/i, '').trim();
      
      const pts = patientsRef.current;
      if (!qStr || pts.length === 0) return;

      const normalize = (s: string) => (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const nq = normalize(qStr);
      
      let matchIndex = pts.findIndex(p => normalize(p.name).includes(nq));
      
      if (matchIndex === -1) {
        const qTokens = nq.split(/\s+/);
        matchIndex = pts.findIndex(p => {
          const nTokens = normalize(p.name).split(/[,\s]+/);
          return qTokens.some(qt => nTokens.some(nt => nt.startsWith(qt) || qt.startsWith(nt)));
        });
      }

      if (matchIndex !== -1) {
        const logicalPosition = matchIndex === 0 ? 0 : (matchIndex % 2 !== 0 ? Math.ceil(matchIndex/2) : -Math.ceil(matchIndex/2));
        setActiveIndex(logicalPosition);
      }
    };

    const handleDexSearch = (e: Event) => {
      const ev = e as CustomEvent;
      handleSearchCommand(ev.detail?.query || '');
    };

    const handleTypingSearch = (e: Event) => {
      const ev = e as CustomEvent;
      handleSearchCommand(ev.detail?.query || '');
    };

    window.addEventListener('patientCreated', handlePatientCreated);
    window.addEventListener('createNewPatientLocal', handleLocalPatient);
    window.addEventListener('dex:searchPatient', handleDexSearch);
    window.addEventListener('dex:typingSearch', handleTypingSearch);
    return () => {
      window.removeEventListener('patientCreated', handlePatientCreated);
      window.removeEventListener('createNewPatientLocal', handleLocalPatient);
      window.removeEventListener('dex:searchPatient', handleDexSearch);
      window.removeEventListener('dex:typingSearch', handleTypingSearch);
    };
  }, [fetchPatients]);

  useEffect(() => {
    if (!onActivePatientChange) return;
    if (patients.length === 0) {
      onActivePatientChange(null);
      return;
    }
    
    const activePatient = patients.find((_, index) => {
      const logicalPosition = index === 0 ? 0 : (index % 2 !== 0 ? Math.ceil(index/2) : -Math.ceil(index/2));
      return logicalPosition === activeIndex;
    });
    onActivePatientChange(activePatient || null);
  }, [activeIndex, patients, onActivePatientChange]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isScrolling.current) return;
    if (Math.abs(e.deltaY) < 15 && Math.abs(e.deltaX) < 15) return;

    isScrolling.current = true;
    setTimeout(() => {
      isScrolling.current = false;
    }, 200);

    const len = patients.length;
    const maxPos = len > 0 ? Math.ceil((len - 1) / 2) : 0;
    const minPos = len > 0 ? -Math.floor((len - 1) / 2) : 0;

    if (e.deltaY > 0 || e.deltaX > 0) {
      setActiveIndex(prev => Math.min(prev + 1, maxPos));
    } else {
      setActiveIndex(prev => Math.max(prev - 1, minPos));
    }
  }, [patients]);

  const cardsToRender = patients.length > 0 ? patients : [EMPTY_CARD];

  let boxShadow = '0 10px 30px -4px rgba(0,0,0,0.18), inset 0 2px 6px rgba(255,255,255,0.4)';
  let borderLeft = '1px solid rgba(255,255,255,0.3)';
  let borderRight = '1px solid rgba(255,255,255,0.3)';

  return (
    <div 
      className="relative w-full h-[320px] flex items-center justify-center z-30"
      onWheel={handleWheel}
    >
      
      {/* Definiciones locales de clipPath para las capas de la carpeta central */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="folder-back-clip-central" clipPathUnits="userSpaceOnUse">
            <path d="M 0,176 L 0,16 A 16,16 0 0,1 16,0 L 90,0 A 16,16 0 0,1 104,8 L 114,20 A 16,16 0 0,0 126,26 L 304,26 A 16,16 0 0,1 320,42 L 320,176 A 24,24 0 0,1 296,200 L 24,200 A 24,24 0 0,1 0,176 Z" />
          </clipPath>
        </defs>
      </svg>

      <div 
        className="flex items-center justify-center relative w-full max-w-5xl h-full"
        style={{
          perspective: '1500px',
          transformStyle: 'preserve-3d',
        }}
      >
        {cardsToRender.map((card, index) => {
          const isEmptyCard = card.id === 999;
          const logicalPosition = isEmptyCard ? 0 : (index === 0 ? 0 : (index % 2 !== 0 ? Math.ceil(index/2) : -Math.ceil(index/2)));
          const currentDiff = logicalPosition - activeIndex;
          const isActive = currentDiff === 0;

          let translateX = 0;
          let translateZ = 0;
          let rotateY = 0;
          let scaleX = 1;

          if (isActive) {
            translateX = 0;
            translateZ = 60;
            rotateY = 0;
            scaleX = 1;
          } else if (currentDiff < 0) {
            rotateY = 12;
            translateX = currentDiff * 55 - 140;
            translateZ = -Math.abs(currentDiff) * 35;
            scaleX = 1;
          } else {
            rotateY = -12;
            translateX = currentDiff * 55 + 140;
            translateZ = -Math.abs(currentDiff) * 35;
            scaleX = -1;
          }

          const transform = `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scaleX(${scaleX})`;
          const colorClass = isEmptyCard ? card.colorClass : 'bg-gradient-to-br from-emerald-400 to-emerald-500';
          const title = isEmptyCard ? card.label : card.name;
          const subTitle = isEmptyCard 
            ? card.sub 
            : `Creado el ${new Date(card.createdTime).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}`;
          const percentage = isEmptyCard ? 0 : 0; // Se solicitó estático en 0% por ahora

          return (
            <div
              key={card.id || index}
              onClick={() => {
                if (isActive) {
                  if (isEmptyCard && onOpenAddPatient) {
                    onOpenAddPatient();
                  } else if (!isEmptyCard && onOpenFolder) {
                    // Si no está vacío, podríamos abrir el folder del paciente. (Pasa el div ref si se requiere pero omitimos para simplificar el fallback a onClick normal)
                    const el = document.getElementById(`folder-${card.id}`);
                    const rect = el?.getBoundingClientRect() || new DOMRect();
                    onOpenFolder(card, rect);
                  }
                } else {
                  setActiveIndex(logicalPosition);
                }
              }}
              id={`folder-${card.id}`}
              className={`absolute w-[320px] h-[200px] transition-[transform,opacity] duration-[280ms] ease-out cursor-pointer group ${isActive ? 'seed-carousel-active' : ''}`}
              style={{
                transform,
                borderRadius: '24px',
                transformStyle: 'preserve-3d',
                zIndex: 50 - Math.abs(currentDiff),
                opacity: Math.abs(currentDiff) > 4 ? 0 : 1,
                pointerEvents: Math.abs(currentDiff) > 4 ? 'none' : 'auto'
              }}
            >


              {/* Capa Trasera */}
              <div
                className="absolute inset-0 seed-folder-back drop-shadow-md"
                style={{
                  clipPath: 'url(#folder-back-clip-central)',
                  background: 'var(--seed-white-glass-bg)',
                }}
              >
                {isActive && (
                  <div className={`absolute inset-0 ${colorClass} opacity-[0.65]`}></div>
                )}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 200" preserveAspectRatio="none">
                  <path 
                    d="M 0,176 L 0,16 A 16,16 0 0,1 16,0 L 90,0 A 16,16 0 0,1 104,8 L 114,20 A 16,16 0 0,0 126,26 L 304,26 A 16,16 0 0,1 320,42 L 320,176 A 24,24 0 0,1 296,200 L 24,200 A 24,24 0 0,1 0,176 Z" 
                    fill="none" 
                    stroke="rgba(255, 255, 255, 0.4)" 
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* Capa Papel Interno */}
              <div
                className="absolute left-[16px] right-[16px] top-[42px] h-[148px] rounded-2xl shadow-md z-10 p-3.5 flex flex-col justify-between seed-folder-paper overflow-hidden select-none pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transform: 'translate3d(0, 0, 12px)',
                }}
              >
                {/* Hoja en blanco limpia con branding DENTAXY TECHNOLOGIES */}
                <div className={`w-full h-full flex flex-col justify-center p-2 ${
                  isActive 
                    ? 'items-center text-center' 
                    : 'items-start text-left pl-3 sm:pl-5'
                }`}>
                  <h3
                    className="text-[22px] sm:text-[26px] font-black text-slate-900 tracking-tighter leading-none uppercase select-none"
                    style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
                  >
                    DENTAXY
                  </h3>
                  <p
                    className="text-[10px] sm:text-[11.5px] tracking-[0.35em] uppercase text-slate-500 font-bold mt-1.5 select-none"
                    style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
                  >
                    TECHNOLOGIES
                  </p>
                </div>
              </div>

              {/* Lomo Físico */}
              <div className="seed-folder-spine" style={{ left: '24px', right: '24px' }}></div>

              {/* Capa Delantera (Verde Glassmorphism Optimizado) */}
              <div
                className="absolute top-[56px] left-0 right-0 bottom-0 z-20 seed-folder-front"
                style={{
                  transform: 'translate3d(0, 0, 24px)',
                  transformStyle: 'preserve-3d',
                  borderRadius: '16px 16px 24px 24px',
                  borderTop: '1.5px solid rgba(255,255,255,0.5)',
                  borderBottom: '1.5px solid rgba(255,255,255,0.3)',
                  borderLeft,
                  borderRight,
                  boxShadow,
                  background: isActive ? 'transparent' : 'var(--seed-white-glass-front)',
                }}
              >
                {isActive && (
                  <div className={`absolute inset-0 ${colorClass} opacity-90`} style={{ borderRadius: '16px 16px 24px 24px' }}></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/[0.08] to-white/[0.22] pointer-events-none z-10" style={{ borderRadius: '16px 16px 24px 24px' }}></div>

                {isActive && (
                  <div 
                    className="absolute top-0 inset-x-0 bottom-0 pt-3 px-5 pb-4 flex flex-col justify-between z-20 antialiased"
                    style={{ backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased', transform: 'translateZ(1px)' }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-[85%]">
                        <h3 className="text-white font-medium text-[14px] uppercase tracking-[0.2em] line-clamp-2 leading-snug drop-shadow-sm">
                          {title}
                        </h3>
                        <p className="text-white/90 text-[10px] mt-1 font-medium drop-shadow-sm">{subTitle}</p>
                      </div>
                      <ArrowUpRight size={15} className="text-white drop-shadow-sm transition shrink-0" />
                    </div>

                    <div className="flex justify-between items-end">
                      <span 
                        className="text-white text-[24px] leading-none drop-shadow-sm"
                        style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
                      >
                        {isEmptyCard ? 'AGREGAR' : 'ABRIR'}
                      </span>
                      {isEmptyCard ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-300 opacity-90 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]"></div>
                      ) : (
                        <span className="text-white/80 text-[11px] font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                          ID: {card.id.substring(0,4)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

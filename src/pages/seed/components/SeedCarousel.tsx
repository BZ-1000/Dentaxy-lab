import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowUpRight, FolderOpen, Plus } from 'lucide-react';

interface SeedCarouselProps {
  onOpenFolder?: (folder: any, rect: DOMRect) => void;
  onOpenAddPatient?: () => void;
  onActivePatientChange?: (patient: any) => void;
  onPatientsLoad?: (patients: any[]) => void;
}

export default function SeedCarousel({ 
  onOpenFolder, 
  onOpenAddPatient, 
  onActivePatientChange,
  onPatientsLoad 
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
  
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = useCallback(async () => {
    try {
      const seedUserStr = sessionStorage.getItem('seed_user');
      if (!seedUserStr) {
        setIsLoading(false);
        return;
      }
      const seedUser = JSON.parse(seedUserStr);
      const accessToken = seedUser.googleAccessToken;
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const queryRoot = encodeURIComponent("name = 'Dentaxy' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
      const resRoot = await fetch(`https://www.googleapis.com/drive/v3/files?q=${queryRoot}&fields=files(id)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const dataRoot = await resRoot.json();

      if (!dataRoot.files || dataRoot.files.length === 0) {
        setIsLoading(false);
        return;
      }

      const rootId = dataRoot.files[0].id;
      const queryPatients = encodeURIComponent(`'${rootId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
      const resPatients = await fetch(`https://www.googleapis.com/drive/v3/files?q=${queryPatients}&fields=files(id,name,createdTime,appProperties)&orderBy=createdTime desc`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const dataPatients = await resPatients.json();

      if (dataPatients.files) {
        setPatients(dataPatients.files);
        onPatientsLoadRef.current?.(dataPatients.files);
        // Cuando se recargan los pacientes (ej. uno nuevo), volvemos al centro para ver el más reciente
        setActiveIndex(0);
      }
    } catch (err) {
      console.error("Error fetching patients from Drive:", err);
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
                  setActiveIndex(index);
                }
              }}
              id={`folder-${card.id}`}
              className={`absolute w-[320px] h-[200px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer group ${isActive ? 'seed-carousel-active' : ''}`}
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
                className="absolute left-[16px] right-[16px] top-[42px] h-[146px] rounded-2xl shadow-md z-10 p-4 flex flex-col items-center justify-center text-center seed-folder-paper"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                  transform: 'translate3d(0, 0, 12px)',
                }}
              >
                {isEmptyCard ? (
                  <div className={`transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 border border-slate-100 shadow-sm mx-auto">
                      <FolderOpen size={18} className="text-slate-300 animate-bounce" />
                    </div>
                    <h3 className="text-slate-600 font-semibold text-[13px] tracking-wide">Expediente Vacío</h3>
                    <p className="text-slate-400 text-[10px] max-w-[180px] mt-0.5">Haz clic aquí para agregar un paciente nuevo</p>
                  </div>
                ) : (
                  <div className={`flex flex-col items-center w-full max-w-[200px] transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                    <h3 className="text-slate-700 font-bold text-[14px] tracking-wide mb-1 break-words line-clamp-2 leading-tight">
                      {title}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-bold tracking-wider mb-3">
                      {percentage}% COMPLETADO
                    </span>
                    
                    {/* Barra de progreso */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
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
                        <div className="w-2 h-2 rounded-full seed-green-dot animate-ping"></div>
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

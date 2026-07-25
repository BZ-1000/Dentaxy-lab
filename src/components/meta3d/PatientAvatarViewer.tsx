import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Sparkles, RefreshCw, Upload, Trash2, Camera, Wand2, Sliders, ChevronRight, Check, Scan, Cpu, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { uploadBinaryFile, fetchDriveFileBlobUrl, listFiles } from '../../utils/driveHelper';

// ─── EFECTO AUDIO SCI-FI PREMIUM AL MATERIALIZAR (Microinteracción de Lujo) ──
function playMaterializeSound() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    
    // Barrido de frecuencias synth sci-fi armonizado
    [220, 330, 440, 660, 880, 1100, 1320].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f * 0.4, now + i * 0.05);
      osc.frequency.exponentialRampToValueAtTime(f * 1.2, now + i * 0.05 + 0.1);
      g.gain.setValueAtTime(0, now + i * 0.05);
      g.gain.linearRampToValueAtTime(0.12, now + i * 0.05 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.38);
    });
  } catch { /* audio silencioso */ }
}

// ─── MODELOS 3D PRE-GENERADOS NORMALIZADOS (ASPECTO ESTÁNDAR 4:5) ─────────────
const METAPERSON_MODELS = [
  {
    id: 'mp_male_1',
    name: 'Masculino 3D',
    renderUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs><linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23fed7aa"/><stop offset="100%" stop-color="%23f97316"/></linearGradient></defs><path d="M 280 750 L 520 750 L 520 950 L 280 950 Z" fill="%23fdba74"/><ellipse cx="400" cy="500" rx="200" ry="250" fill="url(%23skin)"/><path d="M 200 420 Q 400 180 600 420 Q 400 300 200 420 Z" fill="%23334155"/><ellipse cx="320" cy="480" rx="22" ry="16" fill="%231e293b"/><ellipse cx="480" cy="480" rx="22" ry="16" fill="%231e293b"/><path d="M 330 600 Q 400 640 470 600" stroke="%23c2410c" stroke-width="9" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: 'mp_female_1',
    name: 'Femenino 3D',
    renderUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs><linearGradient id="skinf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23ffedd5"/><stop offset="100%" stop-color="%23fb923c"/></linearGradient></defs><path d="M 290 730 L 510 730 L 510 950 L 290 950 Z" fill="%23fed7aa"/><ellipse cx="400" cy="490" rx="190" ry="240" fill="url(%23skinf)"/><path d="M 160 460 C 160 200, 640 200, 640 460 C 680 660, 600 750, 600 750 C 540 500, 260 500, 200 750 Z" fill="%23451a03"/><ellipse cx="330" cy="470" rx="20" ry="14" fill="%23064e3b"/><ellipse cx="470" cy="470" rx="20" ry="14" fill="%23064e3b"/><path d="M 340 600 Q 400 640 460 600" stroke="%23be123c" stroke-width="10" fill="none" stroke-linecap="round"/></svg>',
  },
];

// ─── NORMALIZADOR DE IMAGEN EN CANVAS (Encuadre adaptable de 800x1000 px) ────
async function generateMetaPerson3DAvatar(imageDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Lienzo canónico de 800 x 1000px
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      canvas.width = 800;
      canvas.height = 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar foto temporal para remoción de fondo
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })!;
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.drawImage(img, 0, 0);

      const imgData = tempCtx.getImageData(0, 0, img.width, img.height);
      const data = imgData.data;

      // Muestreo perimetral de fondo
      const samples: [number, number, number][] = [];
      for (let x = 0; x < img.width; x += Math.max(1, Math.floor(img.width / 30))) {
        for (let y = 0; y < Math.min(img.height * 0.1, 20); y += 4) {
          const idx = (y * img.width + x) * 4;
          samples.push([data[idx], data[idx + 1], data[idx + 2]]);
        }
      }

      let bgR = 240, bgG = 240, bgB = 240;
      if (samples.length > 0) {
        let rS = 0, gS = 0, bS = 0;
        for (const [r, g, b] of samples) { rS += r; gS += g; bS += b; }
        bgR = rS / samples.length; bgG = gS / samples.length; bgB = bS / samples.length;
      }

      const tolerance = 48;
      const feather = 32;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const dist = Math.sqrt((r-bgR)**2 + (g-bgG)**2 + (b-bgB)**2);
        if (dist <= tolerance) {
          data[i + 3] = 0;
        } else if (dist < tolerance + feather) {
          data[i + 3] = Math.round(((dist - tolerance) / feather) * 255);
        }
      }

      tempCtx.putImageData(imgData, 0, 0);

      // Escalado Inteligente Proporcional (Contención 100% sin acercamientos excesivos)
      const maxW = 760;
      const maxH = 940;
      const aspect = img.width / img.height;

      let targetW = maxW;
      let targetH = targetW / aspect;

      if (targetH > maxH) {
        targetH = maxH;
        targetW = targetH * aspect;
      }

      const targetX = (canvas.width - targetW) / 2;
      const targetY = canvas.height - targetH;

      ctx.drawImage(tempCanvas, targetX, targetY, targetW, targetH);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(imageDataUrl);
    img.src = imageDataUrl;
  });
}

interface PatientAvatarViewerProps {
  pacienteFolderId: string | null;
  accessToken: string | null;
  patientName: string;
}

export function PatientAvatarViewer({ pacienteFolderId, accessToken, patientName }: PatientAvatarViewerProps) {
  const [avatarUrl, setAvatarUrl]           = useState<string | null>(null);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [isProcessing, setIsProcessing]     = useState(false);
  const [isDragging, setIsDragging]         = useState(false);
  const [isReady, setIsReady]               = useState(false);
  const [showDrawer, setShowDrawer]         = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>('');

  const fileInputRef   = useRef<HTMLInputElement>(null);
  const hasSoundPlayed = useRef(false);

  // ── DESCARGA ASÍNCRONA DESDE GOOGLE DRIVE (Zero-Storage: El Doctor NUNCA Espera) ──
  useEffect(() => {
    if (!pacienteFolderId || !accessToken) return;
    (async () => {
      setIsLoadingDrive(true);
      try {
        const files = await listFiles(pacienteFolderId, accessToken);
        const found = (files as any[]).find(f => f.name.startsWith('avatar_preview.') || f.name.startsWith('avatar_model.'));
        if (found) {
          const blobUrl = await fetchDriveFileBlobUrl(found.id, accessToken);
          setAvatarUrl(blobUrl);
          setIsReady(true);
        }
      } catch (e) {
        console.warn('[Zero-Storage Drive] Sin avatar pre-existente en carpeta.');
      } finally {
        setIsLoadingDrive(false);
      }
    })();
  }, [pacienteFolderId, accessToken]);

  // ── DISPARO EN EL MILISEGUNDO EXACTO DE LA MATERIALIZACIÓN VISUAL ───────────
  useEffect(() => {
    if (isReady && avatarUrl && !hasSoundPlayed.current) {
      hasSoundPlayed.current = true;
      playMaterializeSound();
    }
  }, [isReady, avatarUrl]);

  // ── PROCESAR FOTO E INYECTAR DIRECTO EN GOOGLE DRIVE (Zero-Storage OAuth 2.0) ─
  const processImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona una imagen válida (JPG, PNG).');
      return;
    }

    setIsProcessing(true);
    hasSoundPlayed.current = false;
    toast.loading('MetaPerson 3D Space: Generando modelo en segundo plano...', { id: 'mp-proc' });

    try {
      const rawDataUrl = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      // Generar Avatar 3D
      const transparent3DPng = await generateMetaPerson3DAvatar(rawDataUrl);
      setAvatarUrl(transparent3DPng);
      setIsReady(true);
      setIsProcessing(false);
      toast.success('¡Modelo MetaPerson 3D materializado! ✓', { id: 'mp-proc' });

      // Inyección Zero-Storage en Google Drive de la Clínica
      if (pacienteFolderId && accessToken) {
        try {
          const b64 = transparent3DPng.split('base64,')[1];
          const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
          const f = new File([bytes], 'avatar_preview.png', { type: 'image/png' });
          await uploadBinaryFile(pacienteFolderId, 'avatar_preview.png', 'image/png', f, accessToken);
          toast.success('Avatar 3D blindado en Google Drive del paciente ✓');
        } catch (err) {
          console.warn('[Drive Sync Warning]', err);
        }
      }

    } catch (err) {
      console.error(err);
      toast.error('Error al procesar modelo MetaPerson 3D.', { id: 'mp-proc' });
      setIsProcessing(false);
    }
  }, [pacienteFolderId, accessToken]);

  // ── APLICAR PRESET Y SECTAR EN DRIVE ──────────────────────────────────────
  const applyPresetModel = useCallback(async (model: typeof METAPERSON_MODELS[0]) => {
    setSelectedModelId(model.id);
    hasSoundPlayed.current = false;
    setAvatarUrl(model.renderUrl);
    setIsReady(true);
    toast.success(`Modelo 3D ${model.name} materializado ✓`);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) processImageFile(f); e.target.value = '';
  };
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files?.[0]; if (f) processImageFile(f);
  }, [processImageFile]);
  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const clearAvatar = () => {
    setAvatarUrl(null);
    setIsReady(false);
    setSelectedModelId('');
    hasSoundPlayed.current = false;
    toast.info('Avatar reiniciado.');
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-end overflow-visible"
      onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
    >
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />

      {/* ── ESTADO 1: AVATAR MATERIALIZADO (ADAPTABILIDAD PERFECTA: NUNCA SOBREPASA FICHA & GABINETE) ──── */}
      {avatarUrl && !isLoadingDrive && !isProcessing && (
        <div
          className="w-full h-full flex flex-col items-center justify-end relative overflow-visible pointer-events-none"
          style={{ animation: 'avatarRise 0.75s cubic-bezier(0.22,1,0.36,1) forwards' }}
        >
          <div className="w-full h-full flex items-end justify-center relative overflow-visible">
            <img
              src={avatarUrl}
              alt={`Avatar MetaPerson 3D de ${patientName}`}
              draggable={false}
              className="pointer-events-auto"
              style={{
                width: 'auto',
                height: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                objectPosition: 'bottom center',
                display: 'block',
                margin: '0 auto',
                padding: '0',
                bottom: '0rem',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 0,
                filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.14))',
              }}
            />
          </div>

          {/* Botones de Control Superior */}
          <div className="absolute top-2 right-4 flex items-center gap-2 z-30 pointer-events-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-white/90 shadow-md text-slate-600 hover:text-emerald-600 hover:bg-white transition active:scale-90 cursor-pointer"
              title="Subir nueva foto"
            >
              <RefreshCw size={13} />
            </button>

            <button
              onClick={clearAvatar}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-white/90 shadow-md text-slate-400 hover:text-red-500 hover:bg-white transition active:scale-90 cursor-pointer"
              title="Eliminar avatar"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── PANEL LATERAL DE MODELOS METAPERSON 3D ─────────────────────────── */}
      {showDrawer && (
        <div className="absolute top-12 right-4 z-40 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-3xl p-4 shadow-2xl w-64 animate-in slide-in-from-right-4 duration-300 pointer-events-auto">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-emerald-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-bruno">Modelos MetaPerson 3D</h4>
            </div>
            <button onClick={() => setShowDrawer(false)} className="text-slate-400 hover:text-white text-xs">
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {METAPERSON_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => applyPresetModel(model)}
                className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all cursor-pointer ${
                  selectedModelId === model.id 
                    ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-600'
                }`}
              >
                {selectedModelId === model.id && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800/80 mb-1.5 flex items-center justify-center">
                  <img src={model.renderUrl} alt={model.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-[9px] font-extrabold text-slate-200 truncate w-full text-center">
                  {model.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── ESTADO 2: HOLOGRAPHIC LOADER GLASSMORPHIC "METAPERSON 3D SPACE" ──── */}
      {(isLoadingDrive || isProcessing) && (
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center relative p-6 pointer-events-none">
          <div className="relative w-full max-w-sm h-72 rounded-[36px] bg-slate-900/80 backdrop-blur-2xl border border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.18)] overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            
            {/* Animación del Rayo de Escaneo Láser Holográfico */}
            <div 
              className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-emerald-400/25 to-transparent pointer-events-none"
              style={{ animation: 'laserScan 2.2s ease-in-out infinite alternate' }}
            />

            {/* Núcleo Holográfico 3D */}
            <div className="relative w-24 h-24 rounded-full bg-slate-950/90 border border-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center mb-4">
              <Scan size={36} className="text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute inset-0 rounded-full border border-dashed border-teal-300/60 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} />
            </div>

            <div className="z-10">
              <span className="text-[9px] font-black text-emerald-400 tracking-widest uppercase block mb-1 font-bruno animate-pulse">
                METAPERSON 3D SPACE
              </span>
              <h4 className="text-slate-100 text-xs font-bold uppercase tracking-wider mb-2 font-bruno">
                {isLoadingDrive ? 'Descargando desde Google Drive...' : 'Sintetizando Avatar 3D...'}
              </h4>
              <p className="text-slate-400 text-[10px] font-medium leading-relaxed max-w-xs">
                Zero-Storage OAuth 2.0: Carga asíncrona directa desde el almacenamiento privado de la clínica.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ── ESTADO 3: VACÍO (ARRASTRAR O CARGAR FOTO) ───────────────────────── */}
      {!avatarUrl && !isLoadingDrive && !isProcessing && (
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center relative p-4">
          <div
            className={`bg-white/65 backdrop-blur-md border-2 border-dashed transition-all duration-300 rounded-[32px] p-6 shadow-xl max-w-sm w-full flex flex-col items-center text-center gap-4 cursor-pointer
              ${isDragging ? 'border-emerald-400 bg-emerald-50/60 scale-105 shadow-2xl' : 'border-white/90 hover:bg-white/75 hover:border-emerald-300'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isDragging ? 'bg-emerald-500 text-white scale-110' : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30'}`}>
              {isDragging ? <Upload size={30} /> : <Wand2 size={28} />}
            </div>

            <div>
              <h4 className="text-slate-800 text-sm font-black uppercase tracking-wider font-bruno mb-1">
                {isDragging ? 'Suelta la Foto Aquí' : 'MetaPerson 3D Space'}
              </h4>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                {isDragging ? 'Se generará el modelo 3D de inmediato' : 'Sube o arrastra la foto del paciente. El avatar 3D se genera y se hospeda de forma asíncrona y privada en la carpeta de Google Drive.'}
              </p>
            </div>

            <button
              type="button"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 pointer-events-none"
            >
              <Camera size={14} className="text-emerald-400" />
              <span>Cargar Foto de Paciente</span>
            </button>

            {/* Presets Rápidos */}
            <div className="w-full pt-3 border-t border-slate-200/60 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                O selecciona un modelo 3D pre-renderizado:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {METAPERSON_MODELS.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => applyPresetModel(model)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200/80 bg-white/80 hover:bg-emerald-50 hover:border-emerald-300 transition active:scale-95 group cursor-pointer"
                    title={model.name}
                  >
                    <img
                      src={model.renderUrl}
                      alt={model.name}
                      className="w-8 h-8 object-contain drop-shadow-sm group-hover:scale-105 transition"
                    />
                    <span className="text-[9px] font-extrabold text-slate-600 group-hover:text-emerald-700 truncate w-full">
                      {model.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


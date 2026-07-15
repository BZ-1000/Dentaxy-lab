import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Settings, 
  Check, 
  Sparkles,
  Plus,
  ArrowLeft,
  Printer,
  Download,
  X,
  Link2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface SeedLobbyWidgetProps {
  clinicId?: string;
  theme?: 'dark' | 'light';
  onLinkPatient?: (patientName: string) => void;
  onActiveChange?: (active: boolean) => void;
  onOpenQR?: (code: string) => void;
  isOpenQR?: boolean;
  onOpenAddPatient?: () => void;
}

export default function SeedLobbyWidget({
  clinicId = 'DT-2026',
  theme = 'dark',
  onLinkPatient,
  onActiveChange,
  onOpenQR,
  isOpenQR = false,
  onOpenAddPatient
}: SeedLobbyWidgetProps) {
  const isDark = theme === 'dark';
  
  // Estados para configuración del QR / Sesión
  const [sessionCode, setSessionCode] = useState(clinicId);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [inputCode, setInputCode] = useState(clinicId);
  
  // Estado de simulación para Alerta de Entrada (Dex)
  const [simulateArrival, setSimulateArrival] = useState(false);
  const [patientName, setPatientName] = useState('Alejandro Zavala');
  const [isLinked, setIsLinked] = useState(false);

  // Estados del QR Integrado
  const [showQR, setShowQR] = useState(isOpenQR);
  const [isCopied, setIsCopied] = useState(false);
  const lobbyUrl = `${window.location.origin}/x/${sessionCode}`;

  useEffect(() => {
    setShowQR(isOpenQR);
  }, [isOpenQR]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(lobbyUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCloseQR = () => {
    setShowQR(false);
    onOpenQR?.('');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Lobby Digital - Dentaxy Technologies</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #ffffff;
              color: #0f172a;
              text-align: center;
            }
            .container {
              border: 1px solid #e2e8f0;
              padding: 40px;
              border-radius: 24px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
              max-width: 400px;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              letter-spacing: -0.03em;
              margin-bottom: 24px;
              color: #7c3aed;
            }
            .qr-placeholder {
              margin: 20px 0;
              padding: 20px;
              background: #f8fafc;
              border-radius: 16px;
              display: inline-block;
            }
            .instructions {
              font-size: 14px;
              color: #475569;
              margin-top: 16px;
              line-height: 1.5;
            }
            .url {
              font-family: monospace;
              font-size: 12px;
              background: #f1f5f9;
              padding: 6px 12px;
              border-radius: 6px;
              margin-top: 12px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">DENTAXY TECHNOLOGIES</div>
            <div class="qr-placeholder">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(lobbyUrl)}&color=0f172a&bgcolor=ffffff" width="220" height="220"/>
            </div>
            <div class="instructions">
              <strong>Escanea para iniciar tu experiencia digital con Dex.</strong><br>
              Tu expediente y consentimiento clínico se generarán de manera segura.
            </div>
            <div class="url">${window.location.host}/x/${sessionCode}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    handlePrint();
  };

  // Clases CSS adaptativas al tema
  const cardBgClass = isDark 
    ? 'bg-[#121115]/80 border-white/5 text-white' 
    : 'bg-white/90 border-slate-200 shadow-md text-slate-800';
  
  const textTitleClass = isDark ? 'text-white' : 'text-slate-850';
  const textMutedClass = isDark ? 'text-zinc-400' : 'text-slate-500';
  const inputBgClass = isDark ? 'bg-zinc-950/40 border-white/10' : 'bg-slate-50 border-slate-200';

  // Comunicar el estado de actividad al layout padre
  useEffect(() => {
    onActiveChange?.(simulateArrival || isOpenQR);
  }, [simulateArrival, isOpenQR, onActiveChange]);

  // Guardar nuevo código de sesión
  const handleSaveCode = () => {
    if (inputCode.trim() !== '') {
      setSessionCode(inputCode.trim());
      setIsEditingCode(false);
    }
  };

  // Simular el inicio del expediente autónomo
  const handleVincular = () => {
    setIsLinked(true);
    onLinkPatient?.(patientName);
    const event = new CustomEvent('patientLinked', { detail: { name: patientName, code: sessionCode } });
    window.dispatchEvent(event);
    setTimeout(() => {
      setSimulateArrival(false);
      setIsLinked(false);
    }, 4000);
  };

  return (
    <div className={`w-full h-full rounded-[24px] p-5 border flex flex-col justify-between backdrop-blur-xl relative overflow-hidden transition-all duration-300 ${cardBgClass}`}>
      
      {/* Controles de Configuración Rápidos / Barra Superior QR */}
      <div className="flex flex-row items-center justify-between">
        {showQR ? (
          <>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
              QR Quirúrgico
            </span>
            
            <div className="flex items-center gap-2">
              {/* Botón Imprimir */}
              <button 
                onClick={handlePrint}
                className="w-7 h-7 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/20 dark:border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer outline-none focus:outline-none"
                title="Imprimir cartel"
              >
                <Printer size={12} />
              </button>
              
              {/* Botón Descargar */}
              <button 
                onClick={handleDownload}
                className="w-7 h-7 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/20 dark:border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer outline-none focus:outline-none"
                title="Descargar cartel"
              >
                <Download size={12} />
              </button>

              {/* Botón Cerrar */}
              <button 
                onClick={handleCloseQR}
                className="w-7 h-7 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 flex items-center justify-center text-red-500 transition-all cursor-pointer ml-1 outline-none focus:outline-none"
              >
                <X size={12} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${simulateArrival ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`}></span>
              <h3 className={`text-[13px] font-black uppercase tracking-widest leading-none ${textTitleClass}`}>Lobby Digital</h3>
            </div>
            
            <button 
              onClick={() => setIsEditingCode(!isEditingCode)}
              className={`p-1.5 rounded-lg border transition-colors outline-none focus:outline-none cursor-pointer ${
                isDark ? 'border-white/5 hover:bg-white/5 text-zinc-400' : 'border-slate-200 hover:bg-slate-50 text-slate-500'
              }`}
              title="Configurar código"
            >
              <Settings size={13} />
            </button>
          </>
        )}
      </div>

      {/* Zona de Configuración / Contenido Central */}
      <div className="flex-1 flex flex-col justify-start pt-3 my-1">
        {isEditingCode ? (
          <div className="flex flex-col gap-2 p-3 bg-black/10 dark:bg-black/20 rounded-xl border border-white/5 animate-fade-in text-left">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Código de Sala</label>
            <div className="flex gap-1.5">
              <input 
                type="text" 
                value={inputCode} 
                onChange={(e) => setInputCode(e.target.value)}
                className={`flex-1 px-3 py-1 rounded-lg text-xs outline-none font-bold border ${inputBgClass}`}
              />
              <button 
                onClick={handleSaveCode}
                className="px-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-450 flex items-center justify-center cursor-pointer outline-none focus:outline-none"
              >
                <Check size={14} />
              </button>
            </div>
            <p className="text-[9px] text-zinc-500">Esto modificará el QR único del consultorio.</p>
          </div>
        ) : showQR ? (
          /* ── ESTADO C: Código QR de Sala Integrado ── */
          <div className="flex flex-col items-center justify-center gap-3 animate-fade-in text-center py-1">
            <div className="p-3 bg-white rounded-[24px] shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-slate-100/90 flex items-center justify-center">
              <QRCodeSVG
                value={lobbyUrl}
                size={180}
                level="H"
                bgColor="#ffffff"
                fgColor="#0c0b0e"
              />
            </div>
            
            <div className="text-center outline-none">
              <h4 className={`text-[15px] font-black tracking-wider ${textTitleClass}`}>{sessionCode}</h4>
              <p className="text-[10.5px] text-zinc-400 dark:text-zinc-500 mt-1 max-w-[220px]">
                Escanea para sincronizar y comenzar la historia clínica con Dex.
              </p>
            </div>

            {/* Base: URL Súper Corta */}
            <div className="pt-3 border-t border-zinc-800/10 dark:border-white/10 flex flex-col items-center w-full mt-1.5 select-none">
              <span className="text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                Acceso Alternativo
              </span>
              
              <button 
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 max-w-full truncate hover:scale-[1.02] active:scale-98 transition outline-none focus:outline-none cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/5 hover:bg-white/10 text-white' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Link2 size={11} className="text-zinc-500" />
                <span className="text-[10.5px] font-mono tracking-wider truncate">
                  {window.location.host}/x/{sessionCode}
                </span>
                {isCopied ? (
                  <Check size={11} className="text-emerald-500 ml-1" />
                ) : (
                  <span className="text-[8px] font-bold text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 ml-1">Copiar</span>
                )}
              </button>
            </div>
          </div>
        ) : simulateArrival ? (
          /* ── ESTADO B: Alerta de Entrada (Dex) ── */
          <div className="flex flex-col gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-fade-in text-left">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald-400" />
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">Dex Online</span>
            </div>
            <div className="leading-tight">
              <h4 className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{patientName}</h4>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Se ha registrado. ¿Deseas que Dex realice la historia clínica?</p>
            </div>
            
            <button 
              onClick={handleVincular}
              disabled={isLinked}
              className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-600/50 text-white font-bold text-[10.5px] rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-1.5 outline-none focus:outline-none"
            >
              {isLinked ? (
                <>
                  <Check size={12} className="animate-bounce" />
                  <span>Vinculando...</span>
                </>
              ) : (
                <span>Vincular</span>
              )}
            </button>
          </div>
        ) : (
          /* ── ESTADO A: Reposo (Flujos de Entrada) ── */
          <div className="flex flex-col items-center gap-3">
            
            {/* Píldora 1: QR de Sala (Escaneo digital) */}
            <button 
              onClick={() => {
                setShowQR(true);
                onOpenQR?.(sessionCode);
              }}
              className={`w-full flex items-center justify-center gap-3.5 px-8 py-2.5 rounded-full border transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-sm group outline-none focus:outline-none ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                  : 'bg-white border-slate-200/85 hover:bg-slate-100 shadow-slate-100/50'
              }`}
            >
              <div className={`transition-colors scale-x-[1.25] flex items-center outline-none ${
                isDark 
                  ? 'text-zinc-400 group-hover:text-white' 
                  : 'text-slate-500 group-hover:text-slate-900'
              }`}>
                <QrCode size={18} className="stroke-[2.2]" />
              </div>
              <span className={`text-[11.5px] font-black tracking-wider uppercase transition-colors outline-none ${
                isDark 
                  ? 'text-zinc-350 group-hover:text-white' 
                  : 'text-slate-650 group-hover:text-slate-900'
              }`}>
                Ver QR de Sala
              </span>
            </button>
            
            {/* Píldora 2: Registro Manual */}
            <button 
              onClick={onOpenAddPatient}
              className={`w-full flex items-center justify-center gap-2.5 px-8 py-2.5 rounded-full border transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-sm group outline-none focus:outline-none ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                  : 'bg-white border-slate-200/85 hover:bg-slate-100 shadow-slate-100/50'
              }`}
            >
              <div className={`transition-colors flex items-center outline-none ${
                isDark 
                  ? 'text-zinc-400 group-hover:text-white' 
                  : 'text-slate-500 group-hover:text-slate-900'
              }`}>
                <Plus size={15} className="stroke-[2.5]" />
              </div>
              <span className={`text-[11.5px] font-black tracking-wider uppercase transition-colors outline-none ${
                isDark 
                  ? 'text-zinc-350 group-hover:text-white' 
                  : 'text-slate-650 group-hover:text-slate-900'
              }`}>
                Agregar Paciente
              </span>
            </button>
            
            <p className="text-[10.5px] font-medium text-zinc-500 dark:text-zinc-400 max-w-[260px] text-center leading-normal mt-1.5">
              Escanea para sala de espera digital o agrega al paciente de forma manual en el expediente.
            </p>
          </div>
        )}
      </div>

      {/* Zona inferior de simulación de Lobby */}
      <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-white/5' : 'border-slate-200/60'}`}>
        <div className="text-left">
          <span className="text-[8px] font-bold text-zinc-500 uppercase block">Sala Actual</span>
          <span className={`text-[10px] font-bold ${textTitleClass}`}>{sessionCode}</span>
        </div>

        <button 
          onClick={() => {
            if (simulateArrival) {
              setSimulateArrival(false);
            } else {
              setSimulateArrival(true);
              setPatientName(Math.random() > 0.5 ? 'Alejandro Zavala' : 'Ana Uribe Sifuentes');
            }
          }}
          className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase transition outline-none focus:outline-none cursor-pointer ${
            simulateArrival
              ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
              : 'bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400'
          }`}
        >
          {simulateArrival ? 'Reset' : 'Simular Entrada'}
        </button>
      </div>

    </div>
  );
}

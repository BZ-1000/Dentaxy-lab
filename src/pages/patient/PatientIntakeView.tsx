import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, Check, Smartphone, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function PatientIntakeView() {
  const { clinicId, sessionId } = useParams();
  
  // Si no viene clinicId (legacy), usamos el sessionId como identificador
  const effectiveClinicId = clinicId || 'GZ-2026';
  const clinicName = effectiveClinicId.toUpperCase().includes('GZ') || effectiveClinicId === 'ZAVALA' 
    ? 'Clínica Dental Zavala' 
    : 'Tu Clínica Dental';

  // ID de sesión efímera para este paciente en particular
  const [patientSessionId] = useState(() => `temp-paciente-${Math.random().toString(36).substring(2, 10)}`);
  
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  
  const [lobbyChannel, setLobbyChannel] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  // 1. Suscribirse al canal del lobby de la clínica (WebSockets)
  useEffect(() => {
    const ch = supabase.channel(`clinic-lobby-${effectiveClinicId}`, {
      config: { broadcast: { self: true } }
    });
    
    ch.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Paciente conectado al lobby de la clínica: ${effectiveClinicId}`);
      }
    });

    setLobbyChannel(ch);

    return () => {
      ch.unsubscribe();
    };
  }, [effectiveClinicId]);

  // 2. Suscribirse al canal efímero del propio paciente para recibir el Handshake de aceptación
  useEffect(() => {
    if (step !== 5) return; // Sólo nos suscribimos cuando entramos en sala de espera

    const patientCh = supabase.channel(`patient-session-${patientSessionId}`, {
      config: { broadcast: { self: true } }
    });

    patientCh.on(
      'broadcast',
      { event: 'patient_accepted' },
      () => {
        console.log('¡Conexión aceptada por el doctor!');
        setStep(6); // Pasar a la pantalla de éxito final
      }
    ).subscribe();

    return () => {
      patientCh.unsubscribe();
    };
  }, [step, patientSessionId]);

  const handleStart = () => {
    setStep(2);
  };

  const handleIdentityNext = () => {
    if (!fullName.trim()) return;
    if (!nickname.trim()) {
      setNickname(fullName.split(' ')[0]); // Default al primer nombre
    }
    setStep(3);
  };

  const handleContactNext = () => {
    if (!whatsapp.trim() || !email.trim()) return;
    setStep(4);
  };

  const handleSendIntake = async () => {
    if (!reason.trim() || !lobbyChannel) return;
    
    setIsSending(true);
    
    // Transmitir todos los datos recopilados al dashboard del doctor
    lobbyChannel.send({
      type: 'broadcast',
      event: 'patient_submitted',
      payload: {
        patientSessionId,
        fullName: fullName.trim(),
        nickname: nickname.trim() || fullName.split(' ')[0],
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        reason: reason.trim()
      }
    });

    setIsSending(false);
    setStep(5); // Ir a la pantalla de sala de espera (efímera)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-sans">
      
      {/* Sombras de fondo cristal difuminadas oscuras (Toque VanGox) */}
      <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-slate-300/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-slate-400/25 rounded-full blur-[120px] pointer-events-none" />

      {/* Contenedor Móvil Transparente (Sin tarjeta blanca) */}
      <div className="z-10 w-full max-w-md flex flex-col items-center">
        
        {/* Marca de la Clínica (Estatus) */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
            {clinicName}
          </span>
        </div>

        {/* Dex Video Solo (Sin círculos por detrás, libre y más grande) */}
        <div className="flex flex-col items-center justify-center mb-10 relative">
          <div 
            className="w-56 h-56 rounded-full overflow-hidden flex items-center justify-center bg-transparent border-none mix-blend-multiply"
            style={{ mixBlendMode: 'multiply' }}
          >
            <video
              src="/logos/Dentaxy AI.mp4"
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-cover scale-[1.06] select-none pointer-events-none"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
        </div>

        {/* CONTENIDO CONVERSACIONAL DE DEX */}

        {/* Paso 1: Bienvenida */}
        {step === 1 && (
          <div className="w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-6 duration-500">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-4 leading-snug">
              Hola, soy Dex.
            </h2>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-8 font-medium">
              Bienvenido a <span className="font-semibold text-slate-800">{clinicName}</span>. Seré tu asistente digital hoy. Para que los doctores puedan brindarte la mejor atención sin hacerte esperar, te haré unas preguntas muy rápidas. Solo nos tomará un minuto.
            </p>
            
            <button
              onClick={handleStart}
              className="group flex items-center justify-between w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 px-6 rounded-full text-base font-semibold transition-all shadow-md active:scale-95"
            >
              Comenzar
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ArrowRight size={18} />
              </div>
            </button>
          </div>
        )}

        {/* Paso 2: Identidad */}
        {step === 2 && (
          <div className="w-full flex flex-col animate-in fade-in slide-in-from-right-6 duration-500">
            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight text-center leading-relaxed mb-8">
              Primero lo primero, ¿cuál es tu nombre completo y cómo te gusta que te llamemos?
            </h2>
            
            <div className="flex flex-col gap-5 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Alejandro Zavala"
                  className="w-full bg-white/30 backdrop-blur-md border border-white/60 focus:bg-white/50 focus:border-slate-300 text-slate-800 px-4 py-4 rounded-2xl outline-none transition-all font-medium text-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)]"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prefiero que me llamen...</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ej. Álex"
                  className="w-full bg-white/30 backdrop-blur-md border border-white/60 focus:bg-white/50 focus:border-slate-300 text-slate-800 px-4 py-4 rounded-2xl outline-none transition-all font-medium text-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)]"
                  onKeyDown={(e) => e.key === 'Enter' && handleIdentityNext()}
                />
              </div>
            </div>
            
            <button
              onClick={handleIdentityNext}
              disabled={!fullName.trim()}
              className="group flex items-center justify-between w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 px-6 rounded-full text-base font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md"
            >
              Siguiente
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ArrowRight size={18} />
              </div>
            </button>
          </div>
        )}

        {/* Paso 3: Contacto */}
        {step === 3 && (
          <div className="w-full flex flex-col animate-in fade-in slide-in-from-right-6 duration-500">
            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight text-center leading-relaxed mb-8">
              Perfecto, {nickname}. ¿A qué número de WhatsApp y correo podemos enviarte tus recetas de forma segura?
            </h2>
            
            <div className="flex flex-col gap-5 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Teléfono (WhatsApp)</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ej. 55 1234 5678"
                  className="w-full bg-white/30 backdrop-blur-md border border-white/60 focus:bg-white/50 focus:border-slate-300 text-slate-800 px-4 py-4 rounded-2xl outline-none transition-all font-medium text-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)]"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej. alex@ejemplo.com"
                  className="w-full bg-white/30 backdrop-blur-md border border-white/60 focus:bg-white/50 focus:border-slate-300 text-slate-800 px-4 py-4 rounded-2xl outline-none transition-all font-medium text-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)]"
                  onKeyDown={(e) => e.key === 'Enter' && handleContactNext()}
                />
              </div>
            </div>
            
            <button
              onClick={handleContactNext}
              disabled={!whatsapp.trim() || !email.trim()}
              className="group flex items-center justify-between w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 px-6 rounded-full text-base font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md"
            >
              Siguiente
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ArrowRight size={18} />
              </div>
            </button>
          </div>
        )}

        {/* Paso 4: Motivo */}
        {step === 4 && (
          <div className="w-full flex flex-col animate-in fade-in slide-in-from-right-6 duration-500">
            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight text-center leading-relaxed mb-8">
              Gracias. Ahora, cuéntame en tus propias palabras, ¿qué te trae hoy por aquí?
            </h2>
            
            <div className="flex flex-col gap-2 mb-8">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Motivo de tu visita</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej. Me duele una muela de abajo al tomar agua fría desde hace tres días..."
                rows={4}
                className="w-full bg-white/30 backdrop-blur-md border border-white/60 focus:bg-white/50 focus:border-slate-300 text-slate-800 px-4 py-4 rounded-2xl outline-none transition-all font-medium text-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)] resize-none"
                autoFocus
              />
            </div>
            
            <button
              onClick={handleSendIntake}
              disabled={!reason.trim() || isSending}
              className="group flex items-center justify-between w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 px-6 rounded-full text-base font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md"
            >
              {isSending ? 'Enviando...' : 'Enviar información'}
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                {isSending ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={18} />}
              </div>
            </button>
          </div>
        )}

        {/* Paso 5: Sala de Espera (Efímero) */}
        {step === 5 && (
          <div className="w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight text-center leading-relaxed mb-6">
              Expediente en tránsito...
            </h2>
            <div className="flex items-center gap-2 text-slate-500 font-medium mb-6">
              <Loader2 size={18} className="animate-spin text-slate-400" />
              <span>Enviando información confidencial al doctor</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed bg-white/20 backdrop-blur-md border border-white/50 rounded-2xl p-4 mb-4 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
              Hemos abierto una sesión efímera segura. Por favor, mantén esta pantalla abierta. En cuanto el doctor acepte los datos, tu teléfono se desconectará automáticamente por privacidad.
            </p>
          </div>
        )}

        {/* Paso 6: Handshake exitoso (Final) */}
        {step === 6 && (
          <div className="w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-emerald-500/5 rounded-full animate-ping opacity-60" />
              <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.3)] text-white">
                <Check size={28} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 leading-snug">
              ¡Todo listo, {nickname}!
            </h2>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-6 font-medium">
              He encriptado tu información y se la he entregado directamente al doctor de forma confidencial.
            </p>
            <p className="text-slate-800 font-semibold text-[15px] mb-8 bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4">
              Toma asiento, en un momento te pasamos.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Smartphone size={14} />
              <span>Por seguridad, puedes cerrar esta ventana ahora.</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

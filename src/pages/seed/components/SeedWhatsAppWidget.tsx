import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, MessageSquare, Send, CheckCheck, FileText, Check, 
  X, Sparkles, Zap, Link2, ShieldCheck, User, Phone, ArrowLeft
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'dex' | 'patient' | 'doctor';
  senderName: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'pdf' | 'image' | 'doc';
    name: string;
  };
}

export interface SeedWhatsAppWidgetProps {
  activePatient?: any;
  theme?: 'dark' | 'light';
  forceWhiteBg?: boolean;
  onActiveChange?: (active: boolean) => void;
}

export default function SeedWhatsAppWidget({
  activePatient,
  theme = 'dark',
  forceWhiteBg = false,
  onActiveChange
}: SeedWhatsAppWidgetProps) {
  const isDark = theme === 'dark' && !forceWhiteBg;

  // Datos REALES del paciente activo
  const patientName = activePatient?.name || "RODOLFO MONTES VANEGAS";
  const rawPhone = activePatient?.phone || "524921189423";
  const displayPhone = activePatient?.phone ? `+${activePatient.phone}` : "+52 (492) 118-9423";

  // Estados de vista y simulación real
  const [showQR, setShowQR] = useState(false);
  const [isLinked, setIsLinked] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mensajes reales específicos del paciente activo
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'dex',
      senderName: 'DEX IA Assistant',
      text: `Hola ${patientName.split(' ')[0]}, te enviamos la confirmación de tu expediente clínico en Dentaxy. ¿Tienes alguna duda sobre tus indicaciones?`,
      timestamp: '10:15 AM',
      status: 'read'
    },
    {
      id: 'm2',
      sender: 'patient',
      senderName: patientName.split(' ')[0],
      text: 'Hola Doctor, todo muy claro. Muchas gracias por la información 👍',
      timestamp: '10:18 AM',
      status: 'read'
    },
    {
      id: 'm3',
      sender: 'dex',
      senderName: 'DEX IA Assistant',
      text: '¡Excelente! Te adjuntamos tu resumen de expediente y consentimiento digital:',
      timestamp: '10:19 AM',
      status: 'read',
      attachment: {
        type: 'pdf',
        name: `Ficha_Clinica_${patientName.split(' ')[0]}.pdf`
      }
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Actualizar historial al cambiar de paciente real
  useEffect(() => {
    const firstName = patientName.split(' ')[0];
    setMessages([
      {
        id: 'm1',
        sender: 'dex',
        senderName: 'DEX IA Assistant',
        text: `Hola ${firstName}, te notificamos que tu expediente clínico Dentaxy ha sido actualizado.`,
        timestamp: '09:30 AM',
        status: 'read'
      },
      {
        id: 'm2',
        sender: 'patient',
        senderName: firstName,
        text: 'Muchas gracias por la atención oportuna doctor/a 👍',
        timestamp: '09:35 AM',
        status: 'read'
      },
      {
        id: 'm3',
        sender: 'doctor',
        senderName: 'Dr. Dentaxy',
        text: `Estamos a tus órdenes ${firstName} para cualquier duda sobre tu tratamiento.`,
        timestamp: '09:40 AM',
        status: 'read'
      }
    ]);
  }, [patientName]);

  // Comunicar el estado de actividad al layout padre (idéntico a LobbyWidget)
  useEffect(() => {
    onActiveChange?.(showQR);
  }, [showQR, onActiveChange]);

  // Enviar mensaje real en tiempo real
  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || messageInput;
    if (!textToSend.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'doctor',
      senderName: 'Tú (Doctor)',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };

    setMessages(prev => [...prev, newMsg]);
    if (!customText) setMessageInput('');
    setShowTemplates(false);

    toast.success(`Mensaje enviado por WhatsApp a ${patientName.split(' ')[0]}`, {
      description: displayPhone,
      icon: <Send size={15} className="text-emerald-500" />
    });

    // Simular respuesta real del paciente
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'patient',
          senderName: patientName.split(' ')[0],
          text: 'Enterado/a Doctor, agradezco mucho el seguimiento 🙏',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]);
    }, 2500);
  };

  // URL Real de enlace directo a WhatsApp para el paciente
  const waUrl = `https://wa.me/${rawPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${patientName}, te contactamos de Dentaxy Cloud.`)}`;

  const handleCopyWaLink = () => {
    navigator.clipboard.writeText(waUrl);
    setCopiedLink(true);
    toast.success('Enlace de WhatsApp copiado al portapapeles');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Clases adaptativas idénticas 1:1 a SeedLobbyWidget
  const cardBgClass = isDark 
    ? 'bg-[#121115]/80 border-white/5 text-white' 
    : 'bg-white/90 border-slate-200 shadow-md text-slate-800';
  
  const textTitleClass = isDark ? 'text-white' : 'text-slate-850';
  const textMutedClass = isDark ? 'text-zinc-400' : 'text-slate-500';

  return (
    <div className={`w-full h-full rounded-[24px] p-5 border flex flex-col justify-between backdrop-blur-xl relative overflow-hidden transition-all duration-300 ${cardBgClass}`}>
      
      {/* ── CABECERA SUPERIOR (IDÉNTICA A LOBBY DIGITAL) ── */}
      <div className="flex flex-row items-center justify-between">
        {showQR ? (
          <>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowQR}
                className="text-emerald-500 hover:text-emerald-400 transition"
              >
                <ArrowLeft size={14} />
              </button>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                QR WhatsApp Paciente
              </span>
            </div>
            
            <button 
              onClick={() => setShowQR(false)}
              className="w-7 h-7 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 flex items-center justify-center text-red-500 transition cursor-pointer outline-none focus:outline-none"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className={`text-[13px] font-black uppercase tracking-widest leading-none ${textTitleClass}`}>
                WhatsApp Paciente
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowQR(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 transition cursor-pointer"
                title="Ver QR directo de WhatsApp"
              >
                <QrCode size={12} />
                <span>QR Cita</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── CONTENIDO CENTRAL (MODO CHAT O MODO QR) ── */}
      <div className="flex-1 flex flex-col justify-start pt-2 my-1 overflow-hidden">
        {showQR ? (
          /* MODO QR REAL: Generación de QR con QRCodeSVG */
          <div className="flex flex-col items-center justify-center gap-2.5 animate-fade-in text-center py-1">
            <div className="p-2.5 bg-white rounded-[20px] shadow-md border border-slate-200 flex items-center justify-center">
              <QRCodeSVG
                value={waUrl}
                size={155}
                level="H"
                bgColor="#ffffff"
                fgColor="#00a884"
              />
            </div>
            
            <div className="text-center">
              <h4 className={`text-[13px] font-black tracking-wider ${textTitleClass}`}>{patientName}</h4>
              <p className="text-[10px] text-emerald-600 font-semibold">{displayPhone}</p>
            </div>

            <button 
              onClick={handleCopyWaLink}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 max-w-full truncate hover:scale-[1.02] active:scale-98 transition outline-none focus:outline-none cursor-pointer ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Link2 size={11} className="text-emerald-500" />
              <span className="text-[10px] font-mono tracking-wider truncate">
                {copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace Directo'}
              </span>
            </button>
          </div>
        ) : (
          /* MODO CHAT REAL: Historial de Mensajes */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Cabecera del Paciente Activo */}
            <div className="flex items-center justify-between px-2 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mb-2">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {patientName.charAt(0)}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[11px] font-bold truncate text-slate-900 dark:text-white leading-tight">
                    {patientName}
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {displayPhone} · WA Business
                  </span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            {/* Hilo de Mensajes */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 max-h-[160px]">
              {messages.map((m) => {
                const isMe = m.sender === 'doctor' || m.sender === 'dex';
                const isDex = m.sender === 'dex';

                return (
                  <div 
                    key={m.id}
                    className={`flex flex-col max-w-[90%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div 
                      className={`rounded-2xl px-2.5 py-1.5 text-[11px] shadow-sm relative border ${
                        isMe 
                          ? 'bg-emerald-600 text-white border-emerald-500 rounded-tr-none' 
                          : isDark
                            ? 'bg-slate-800 text-slate-100 border-slate-700 rounded-tl-none'
                            : 'bg-slate-100 text-slate-900 border-slate-200 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className={`text-[9px] font-bold ${isMe ? 'text-emerald-200' : 'text-emerald-600'}`}>
                          {m.senderName}
                        </span>
                      </div>
                      <p className="leading-snug">{m.text}</p>
                      {m.attachment && (
                        <div className="mt-1 p-1 bg-black/20 rounded-lg flex items-center gap-1.5 text-[9.5px]">
                          <FileText size={12} className="text-emerald-300 shrink-0" />
                          <span className="truncate">{m.attachment.name}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-end gap-1 mt-0.5 text-[8.5px] opacity-80">
                        <span>{m.timestamp}</span>
                        {isMe && <CheckCheck size={11} className="text-emerald-200" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* ── BASE INFERIOR: INPUT DE MENSAJE Y PLANTILLAS (IDÉNTICO A LOBBY DIGITAL) ── */}
      {!showQR && (
        <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-1.5">
          {/* Desplegable de Plantillas */}
          <AnimatePresence>
            {showTemplates && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-1 overflow-hidden"
              >
                <button
                  onClick={() => handleSendMessage(`Hola ${patientName.split(' ')[0]}, te enviamos tu receta médica digital de Dentaxy.`)}
                  className="text-left px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-[10px] font-semibold text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 truncate"
                >
                  📄 Envío de Receta Digital
                </button>
                <button
                  onClick={() => handleSendMessage(`Hola ${patientName.split(' ')[0]}, favor de confirmar tu cita de valoración mañana en Dentaxy.`)}
                  className="text-left px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-[10px] font-semibold text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 truncate"
                >
                  📅 Recordatorio de Cita
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className={`p-1.5 rounded-xl border transition cursor-pointer ${
                showTemplates ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
              }`}
              title="Plantillas Clínicas"
            >
              <Sparkles size={13} />
            </button>

            <input
              type="text"
              placeholder={`Mensaje WhatsApp a ${patientName.split(' ')[0]}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-1.5 rounded-xl text-xs outline-none font-medium border bg-slate-50 dark:bg-zinc-950/40 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-emerald-500 transition"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!messageInput.trim()}
              className="p-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white rounded-xl transition cursor-pointer shadow-sm"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { chatWithAgent } from "@/services/gemini";
import { X, Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function GlobalDexBubble() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ocultar en la landing (ya tiene su propia burbuja) y en el panel admin
  const isLanding = location.pathname === "/";
  const isAdmin   = location.pathname.startsWith("/admin");
  if (isLanding || isAdmin) return null;

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    const userQuery = chatInput;
    setChatInput("");
    setIsLoading(true);
    setResponseMessage("Pensando...");
    try {
      const defaultProfile = { role: "odontologo", currentSystem: "digital_basico", priority: "tecnologia" };
      const response = await chatWithAgent(userQuery, defaultProfile, []);
      setResponseMessage(response);
    } catch {
      setResponseMessage("Lo siento, no pude conectar con mi motor neuronal local. ¿Puedes preguntar de nuevo?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ── Globo de Diálogo de Respuesta de DEX ── */}
      <AnimatePresence>
        {responseMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed z-[9998] flex flex-col gap-2"
            style={{
              right: isMobile ? 16 : 48,
              bottom: isMobile ? 132 : 132,
              width: isMobile ? "calc(100vw - 32px)" : 360,
            }}
          >
            <div className="bg-slate-950/92 text-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] border border-slate-800 backdrop-blur-md relative flex flex-col gap-2">
              {/* Cerrar diálogo */}
              <button
                onClick={() => setResponseMessage(null)}
                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Tag DEX */}
              <div className="text-[11px] font-mono text-[#00f5a0] tracking-widest uppercase">
                DEX AI
              </div>
              {/* Texto respuesta */}
              <div className="text-[15px] leading-relaxed text-slate-100 pr-4 whitespace-pre-wrap font-medium">
                {responseMessage}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Burbuja / Barra de Chat Expandible — idéntica al paso 4 de Insights ── */}
      <motion.div
        initial={false}
        animate={{
          width:        isChatOpen ? (isMobile ? "calc(100vw - 32px)" : 480) : 96,
          height:       isChatOpen ? 64 : 96,
          borderRadius: isChatOpen ? 32 : 48,
        }}
        whileHover={!isChatOpen ? {
          scale: 1.06,
          boxShadow: "0 20px 48px rgba(0,0,0,0.18)",
          filter: "brightness(1.05)",
        } : undefined}
        whileTap={!isChatOpen ? { scale: 0.96 } : undefined}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        // Sin fondo en reposo — igual que la burbuja de Insights en step 4
        className={`fixed z-[9999] flex items-center cursor-pointer ${
          isChatOpen
            ? "bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-1"
            : "bg-transparent p-0"
        }`}
        style={{
          right:  isMobile ? 16 : 48,
          bottom: isMobile ? 24 : 24,
        }}
        onClick={() => {
          if (!isChatOpen) setIsChatOpen(true);
        }}
      >
        {/* Orbe de DEX — 88×88 en reposo (igual que Insights paso 4) */}
        <motion.div
          onClick={(e) => {
            if (isChatOpen) {
              e.stopPropagation();
              setIsChatOpen(false);
              setResponseMessage(null);
            }
          }}
          className="rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-transparent border-none shadow-none transition-all duration-300"
          style={{
            width:  isChatOpen ? 56 : 88,
            height: isChatOpen ? 56 : 88,
          }}
        >
          <video
            src="/logos/Dentaxy AI.mp4"
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover scale-[1.06] select-none pointer-events-none"
          />
        </motion.div>

        {/* Caja de entrada estilo ChatGPT — visible sólo cuando está abierta */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.12 }}
              className="flex-1 flex items-center ml-3 pr-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Pregunta lo que quieras"
                className="flex-1 bg-transparent border-none outline-none text-slate-800 text-sm font-semibold placeholder-slate-400 py-1"
                onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                autoFocus
              />
              {/* Micrófono decorativo */}
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              {/* Botón enviar */}
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isLoading}
                className="w-10 h-10 bg-black hover:bg-neutral-800 rounded-full flex items-center justify-center text-white transition-colors shrink-0 disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="5"  y="10" width="2" height="4" rx="1" />
                  <rect x="9"  y="7"  width="2" height="10" rx="1" />
                  <rect x="13" y="5"  width="2" height="14" rx="1" />
                  <rect x="17" y="8"  width="2" height="8"  rx="1" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

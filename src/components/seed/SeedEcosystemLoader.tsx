/**
 * SeedEcosystemLoader.tsx — Dentaxy Seed V2
 * Splash screen de 15 segundos — Fondo blanco total, centrado perfecto.
 *
 * Acto 1 (0-3s):   Dentaxy × Google — partnership visual sobre blanco
 * Acto 2 (3-11s):  Íconos orbitando y siendo absorbidos por el logo Dentaxy que crece
 * Acto 3 (11-15s): Logo solo, respirando, mensaje final → onComplete()
 */
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface Props {
  onComplete: () => void;
  userName?: string;
}

// ── Frases de confianza rotativas ─────────────────────────────────────────────
const TRUST_PHRASES = [
  { icon: '🔒', text: 'Tus expedientes viven en tu Google Drive personal — solo tú tienes acceso' },
  { icon: '📅', text: 'Tu calendario de pacientes sincronizado con Google Calendar automáticamente' },
  { icon: '📊', text: 'Reportes clínicos exportados a Google Sheets en tiempo real' },
  { icon: '📄', text: 'Historias clínicas guardadas como Docs en tu cuenta de Google' },
  { icon: '🛡️', text: 'Dentaxy nunca almacena datos médicos en nuestros servidores' },
];

// ── Íconos Google reales desde el directorio public ──────────────────────────
const GOOGLE_ICONS = [
  { id: 'drive',    label: 'Drive',    imgSrc: '/logos/google-drive.png',    delay: 0    },
  { id: 'calendar', label: 'Calendar', imgSrc: '/logos/google-calendar.png', delay: 1.1  },
  { id: 'docs',     label: 'Docs',     imgSrc: '/logos/google-docs.png',     delay: 2.2  },
  { id: 'sheets',   label: 'Sheets',   imgSrc: '/logos/google-sheets.png',   delay: 3.3  },
  { id: 'slides',   label: 'Slides',   imgSrc: '/logos/google-slides.png',   delay: 4.4  },
  { id: 'gmail',    label: 'Gmail',    imgSrc: '/logos/gmail.png',           delay: 5.5  },
];

// Posiciones radiales fijas alrededor del centro
const POSITIONS = [
  { x: 0,    y: -155 },  // arriba
  { x: 134,  y: -77  },  // arriba-der
  { x: 134,  y: 77   },  // abajo-der
  { x: 0,    y: 155  },  // abajo
  { x: -134, y: 77   },  // abajo-izq
  { x: -134, y: -77  },  // arriba-izq
];

const GoogleLogo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ── Componente principal ──────────────────────────────────────────────────────
export default function SeedEcosystemLoader({ onComplete, userName }: Props) {
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [absorbedCount, setAbsorbedCount] = useState(0);
  const [logoSize, setLogoSize] = useState(100);  // tamaño del logo en px
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);

  // ── Temporizadores ───────────────────────────────────────────────────────
  useEffect(() => {
    const t1 = setTimeout(() => setAct(2), 3000);
    const t2 = setTimeout(() => setAct(3), 11000);
    const t3 = setTimeout(() => onComplete(), 15000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  // ── Absorción secuencial (Acto 2) ────────────────────────────────────────
  useEffect(() => {
    if (act !== 2) return;
    let count = 0;
    const interval = setInterval(() => {
      if (count >= GOOGLE_ICONS.length) { clearInterval(interval); return; }
      count++;
      setAbsorbedCount(count);
      // Cada absorción → logo crece ~8px y aumenta el glow
      setLogoSize(s => Math.min(s + 14, 180));
      setGlowIntensity(g => Math.min(g + 15, 80));
    }, 1100);
    return () => clearInterval(interval);
  }, [act]);

  // ── Rotación frases ──────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(p => (p + 1) % TRUST_PHRASES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >

      {/* ══════════════════ ACTO 1: Partnership ══════════════════ */}
      <AnimatePresence mode="wait">
        {act === 1 && (
          <motion.div
            key="act1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-10 select-none"
          >
            {/* Logos */}
            <div className="flex items-center gap-8">
              {/* Dentaxy */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20">
                  <img
                    src="/logos/Dentaxy icon.svg"
                    alt="Dentaxy"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Dentaxy</span>
              </motion.div>

              {/* × */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="text-4xl font-extralight text-gray-200"
              >
                ×
              </motion.div>

              {/* Google */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <GoogleLogo size={56} />
                </div>
                <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Google</span>
              </motion.div>
            </div>

            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="text-center space-y-2"
            >
              <p className="text-gray-800 text-xl font-semibold">
                Tu consultorio, en tu ecosistema Google
              </p>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Dentaxy organiza. Google protege. Tú controlas.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════ ACTO 2 + 3: Absorción ══════════════════ */}
      <AnimatePresence mode="wait">
        {(act === 2 || act === 3) && (
          <motion.div
            key="act2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative flex items-center justify-center"
            style={{ width: 420, height: 420 }}
          >

            {/* Íconos que orbitan y se absorben */}
            {act === 2 && GOOGLE_ICONS.map((icon, i) => {
              const pos = POSITIONS[i];
              const isAbsorbed = i < absorbedCount;

              return (
                <motion.div
                  key={icon.id}
                  initial={{ x: pos.x, y: pos.y, opacity: 0, scale: 0 }}
                  animate={
                    isAbsorbed
                      ? {
                          x: 0,
                          y: 0,
                          opacity: 0,
                          scale: 0,
                          transition: { duration: 0.5, ease: [0.4, 0, 1, 1] }
                        }
                      : {
                          x: pos.x,
                          y: pos.y,
                          opacity: 1,
                          scale: 1,
                          transition: { delay: i * 0.12, duration: 0.55, type: 'spring', stiffness: 140 }
                        }
                  }
                  className="absolute flex flex-col items-center gap-1 transform-gpu will-change-transform"
                  style={{ left: '50%', top: '50%', marginLeft: -28, marginTop: -28 }}
                >
                  <div className="w-14 h-14">
                    <img src={icon.imgSrc} alt={icon.label} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{icon.label}</span>
                </motion.div>
              );
            })}

            {/* Líneas de conexión sutiles hacia el centro (solo cuando no está absorbido) */}
            {act === 2 && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={420}
                height={420}
                style={{ overflow: 'visible' }}
              >
                {GOOGLE_ICONS.map((icon, i) => {
                  const pos = POSITIONS[i];
                  const isAbsorbed = i < absorbedCount;
                  if (isAbsorbed) return null;
                  return (
                    <motion.line
                      key={icon.id}
                      x1={210}
                      y1={210}
                      x2={210 + pos.x}
                      y2={210 + pos.y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: i * 0.12 + 0.3 }}
                    />
                  );
                })}
              </svg>
            )}

            {/* Anillo de glow alrededor del logo */}
            <motion.div
              className="absolute rounded-full transform-gpu will-change-[width,height,margin-left,margin-top]"
              style={{
                width: logoSize + 40,
                height: logoSize + 40,
                marginLeft: -(logoSize + 40) / 2,
                marginTop: -(logoSize + 40) / 2,
                left: '50%',
                top: '50%',
                background: `radial-gradient(circle, rgba(66,133,244,${glowIntensity / 400}) 0%, transparent 70%)`,
              }}
              animate={{
                width: logoSize + 40,
                height: logoSize + 40,
                marginLeft: -(logoSize + 40) / 2,
                marginTop: -(logoSize + 40) / 2,
              }}
              transition={{ type: 'spring', stiffness: 60, damping: 12 }}
            />

            {/* Logo Dentaxy — crece al absorber */}
            <motion.div
              className="absolute z-10 transform-gpu will-change-[width,height,margin-left,margin-top]"
              style={{ left: '50%', top: '50%' }}
              animate={{
                width: logoSize,
                height: logoSize,
                marginLeft: -logoSize / 2,
                marginTop: -logoSize / 2,
              }}
              transition={{ type: 'spring', stiffness: 80, damping: 14 }}
            >
              <img
                src="/logos/Dentaxy icon.svg"
                alt="Dentaxy"
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Pulso en Acto 3 */}
            {act === 3 && (
              <>
                <motion.div
                  className="absolute rounded-full border border-blue-200/60 transform-gpu will-change-[width,height,margin-left,margin-top,opacity]"
                  style={{ left: '50%', top: '50%' }}
                  animate={{
                    width: [logoSize + 20, logoSize + 70, logoSize + 20],
                    height: [logoSize + 20, logoSize + 70, logoSize + 20],
                    marginLeft: [-(logoSize + 20) / 2, -(logoSize + 70) / 2, -(logoSize + 20) / 2],
                    marginTop: [-(logoSize + 20) / 2, -(logoSize + 70) / 2, -(logoSize + 20) / 2],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute rounded-full border border-blue-100/40 transform-gpu will-change-[width,height,margin-left,margin-top,opacity]"
                  style={{ left: '50%', top: '50%' }}
                  animate={{
                    width: [logoSize + 40, logoSize + 100, logoSize + 40],
                    height: [logoSize + 40, logoSize + 100, logoSize + 40],
                    marginLeft: [-(logoSize + 40) / 2, -(logoSize + 100) / 2, -(logoSize + 40) / 2],
                    marginTop: [-(logoSize + 40) / 2, -(logoSize + 100) / 2, -(logoSize + 40) / 2],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════ ACTO 3: Mensaje final ══════════════════ */}
      <AnimatePresence>
        {act === 3 && (
          <motion.div
            key="act3-msg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mt-6 space-y-1"
          >
            <p className="text-gray-900 text-xl font-semibold">
              {userName
                ? `¡Todo listo, ${userName.split(' ')[0]}!`
                : 'Tu consultorio está listo.'}
            </p>
            <p className="text-gray-400 text-sm">
              Tu ecosistema Google ya está sincronizado con Dentaxy Seed
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════ FOOTER: Frases de confianza ══════════════════ */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4 px-6">
        {/* Divisor */}
        <div className="w-32 h-px bg-gray-100" />

        {/* Frase rotativa */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhrase}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-2 text-center"
            >
              <span className="text-base">{TRUST_PHRASES[currentPhrase].icon}</span>
              <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                {TRUST_PHRASES[currentPhrase].text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mini íconos del ecosistema */}
        <div className="flex items-center gap-4">
          {GOOGLE_ICONS.map((icon) => (
            <img key={icon.id} src={icon.imgSrc} alt={icon.label} className="w-5 h-5 opacity-25 object-contain" />
          ))}
        </div>
      </div>
    </div>
  );
}

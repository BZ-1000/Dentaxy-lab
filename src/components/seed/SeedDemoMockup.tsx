import React from 'react';
import { AnalysisModeProvider } from '@/contexts/AnalysisModeContext';
import { DentaxyFormPanel } from '@/components/academico/DentaxyFormPanel';

/**
 * SeedDemoMockup — Sección 2 de la Landing de DentaXy Seed
 * 
 * Muestra el motor de redacción clínica (DentaxyFormPanel) emergiendo
 * de un resplandor neón verde intenso sobre fondo negro.
 * Incluye el badge "POWERED BY Google" con colores oficiales.
 */
export const SeedDemoMockup: React.FC = () => {
  return (
    <section
      className="seed-section"
      style={{
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '5vh',
      }}
    >
      {/* ── "POWERED BY Google" Badge de Alto Contraste y Vibrancia ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '32px',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "var(--s-font-display, 'Orbitron', sans-serif)",
            fontSize: 'clamp(11px, 1.4vw, 16px)',
            fontWeight: 600,
            color: 'rgba(200, 205, 220, 0.95)', /* Aumentado el contraste para legibilidad */
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          POWERED BY
        </span>
        <span style={{
          fontFamily: "var(--s-font-display, 'Orbitron', sans-serif)",
          fontSize: "clamp(13px, 1.6vw, 18px)",
          letterSpacing: "0.05em",
          display: "inline-flex",
          gap: "2px"
        }}>
          <span style={{ color: "#4285F4", fontWeight: 900, textShadow: "0 0 8px rgba(66, 133, 244, 0.4)" }}>G</span>
          <span style={{ color: "#EA4335", fontWeight: 900, textShadow: "0 0 8px rgba(234, 67, 53, 0.4)" }}>o</span>
          <span style={{ color: "#FBBC05", fontWeight: 900, textShadow: "0 0 8px rgba(251, 188, 5, 0.4)" }}>o</span>
          <span style={{ color: "#4285F4", fontWeight: 900, textShadow: "0 0 8px rgba(66, 133, 244, 0.4)" }}>g</span>
          <span style={{ color: "#34A853", fontWeight: 900, textShadow: "0 0 8px rgba(52, 168, 83, 0.4)" }}>l</span>
          <span style={{ color: "#EA4335", fontWeight: 900, textShadow: "0 0 8px rgba(234, 67, 53, 0.4)" }}>e</span>
        </span>
      </div>

      {/* ── Contenedor del Demo con Glow Neón ── */}
      <div
        style={{
          position: 'relative',
          width: '92%',
          maxWidth: '1300px',
          flex: 1,
          minHeight: 0,
          zIndex: 5,
        }}
      >
        {/* ── GLOW NEÓN — Capa 1: Resplandor amplio difuminado ── */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120%',
            height: '300px',
            background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0.08) 40%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* ── GLOW NEÓN — Capa 2: Núcleo intenso ── */}
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '180px',
            background: 'radial-gradient(ellipse at center, rgba(52, 211, 153, 0.7) 0%, rgba(16, 185, 129, 0.2) 35%, transparent 65%)',
            filter: 'blur(25px)',
            pointerEvents: 'none',
            zIndex: 2,
            animation: 'glowPulseNeon 4s ease-in-out infinite alternate',
          }}
        />

        {/* ── GLOW NEÓN — Capa 3: Línea de borde superior brillante ── */}
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            left: '10%',
            width: '80%',
            height: '4px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(52, 211, 153, 0.9) 30%, rgba(16, 185, 129, 1) 50%, rgba(52, 211, 153, 0.9) 70%, transparent 100%)',
            borderRadius: '4px',
            filter: 'blur(1px)',
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.8), 0 0 60px rgba(16, 185, 129, 0.4), 0 0 120px rgba(16, 185, 129, 0.2)',
          }}
        />

        {/* ── Panel del Demo ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            width: '100%',
            height: '100%',
            borderRadius: '24px 24px 0 0',
            overflow: 'hidden',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            borderBottom: 'none',
            boxShadow: `
              0 -8px 40px rgba(16, 185, 129, 0.25),
              0 -2px 80px rgba(16, 185, 129, 0.15),
              0 0 200px rgba(16, 185, 129, 0.08),
              inset 0 1px 0 rgba(52, 211, 153, 0.3)
            `,
          }}
        >
          <AnalysisModeProvider>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--background, #ffffff)',
              }}
            >
              <DentaxyFormPanel />
            </div>
          </AnalysisModeProvider>
        </div>
      </div>

      {/* ── Keyframe para el pulso del glow ── */}
      <style>{`
        @keyframes glowPulseNeon {
          0% {
            opacity: 0.7;
            transform: translateX(-50%) scaleX(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) scaleX(1.05);
          }
        }
      `}</style>
    </section>
  );
};

export default SeedDemoMockup;

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES DEL DOCUMENTO
// ─────────────────────────────────────────────────────────────────────────────
const VALID_TOKEN = 'DX-UAO-2026-AUTH-TOKEN-NFC';
const DOCUMENT_ID = 'DX-UAO-2026-AUTH';

// Mensaje semántico que representa el contenido del documento para el hash
const DOCUMENT_PAYLOAD =
  'DENTAXY:TECHNOLOGIES:UAO-SYNC:LOI:2026:UAZ:ODONTOLOGIA:BRAULIO-ZAVALA:INMUTABLE';

// ─────────────────────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────────────────────

/** Genera un SHA-256 hex del string dado usando la Web Crypto API nativa del browser. */
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Formatea un Date al estilo "25 mar 2026 — 10:04:17 CST". */
function formatTimestamp(date: Date): string {
  const meses = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
  ];
  const d = date.getDate().toString().padStart(2, '0');
  const m = meses[date.getMonth()];
  const y = date.getFullYear();
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${d} ${m} ${y} — ${h}:${min}:${s} CST`;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

const NFCVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('auth_token');

  const isAuthorized = token === VALID_TOKEN;

  const [hash, setHash] = useState<string | null>(null);
  const [timestamp] = useState<string>(() => formatTimestamp(new Date()));
  const [visible, setVisible] = useState(false);

  // Calcular hash SHA-256 al montar (solo si autorizado)
  useEffect(() => {
    if (isAuthorized) {
      sha256(DOCUMENT_PAYLOAD).then((h) => {
        setHash(h);
        // Pequeño delay para la animación de entrada
        setTimeout(() => setVisible(true), 80);
      });
    } else {
      setVisible(true);
    }
  }, [isAuthorized]);

  return (
    <>
      {/* Inyectamos el meta noindex directamente en el head imperativo */}
      <MetaNoIndex />

      <main
        style={{
          minHeight: '100svh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2255 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          fontFamily: "'Inter', 'M PLUS 1p', sans-serif",
        }}
      >
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            width: '100%',
            maxWidth: '420px',
          }}
        >
          {isAuthorized ? (
            <VerifiedCard hash={hash} timestamp={timestamp} />
          ) : (
            <UnauthorizedCard />
          )}
        </div>
      </main>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Meta noindex (imperativo pero seguro)
// ─────────────────────────────────────────────────────────────────────────────
const MetaNoIndex: React.FC = () => {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Tarjeta de verificación exitosa
// ─────────────────────────────────────────────────────────────────────────────
const VerifiedCard: React.FC<{ hash: string | null; timestamp: string }> = ({
  hash,
  timestamp,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={cardStyle}>
      {/* Header con logo */}
      <div style={cardHeaderStyle}>
        <img
          src="/brand/dentaxy-icon-solid.webp"
          alt="Dentaxy"
          style={{ width: 40, height: 40, objectFit: 'contain' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              '/lovable-uploads/7898fc25-0e62-40e1-a139-6582324afb27.png';
          }}
        />
        <span style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Dentaxy Technologies
        </span>
      </div>

      {/* Ícono de estado */}
      <div style={{ textAlign: 'center', margin: '24px 0 20px' }}>
        <div style={shieldIconWrapper}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
        <h1 style={verifiedTitleStyle}>Documento Auténtico</h1>
        <p style={verifiedSubtitleStyle}>Copia original verificada por<br /><strong style={{ color: '#fff' }}>Dentaxy Technologies</strong></p>
      </div>

      <hr style={dividerStyle} />

      {/* Datos de verificación */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <DataRow label="ESTADO">
          <span style={badgeSuccessStyle}>✓ VERIFICADO</span>
        </DataRow>

        <DataRow label="ID DE REGISTRO">
          <code style={codeStyle}>{DOCUMENT_ID}</code>
        </DataRow>

        <DataRow label="MARCA DE TIEMPO">
          <span style={dataValueStyle}>{timestamp}</span>
        </DataRow>

        <div>
          <div style={labelStyle}>HASH DE INTEGRIDAD (SHA-256)</div>
          <div
            onClick={handleCopyHash}
            title="Click para copiar"
            style={{
              ...codeHashStyle,
              cursor: hash ? 'pointer' : 'default',
              borderColor: copied ? '#10B981' : 'rgba(255,255,255,0.08)',
              transition: 'border-color 0.2s',
            }}
          >
            {hash ? (
              <>
                <span style={{ wordBreak: 'break-all', lineHeight: 1.6 }}>{hash}</span>
                <span style={{ fontSize: '10px', color: copied ? '#10B981' : '#475569', marginTop: '4px', display: 'block' }}>
                  {copied ? '✓ Copiado al portapapeles' : 'Toca para copiar'}
                </span>
              </>
            ) : (
              <span style={{ color: '#475569', fontStyle: 'italic' }}>Calculando…</span>
            )}
          </div>
        </div>
      </div>

      <hr style={dividerStyle} />

      <p style={footerNoteStyle}>
        Este código QR / etiqueta NFC está vinculado de forma permanente e inmutable al documento de Carta de Intención UAO SYNC 2026. El hash SHA-256 es la firma digital del contenido original.
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Tarjeta de error 401
// ─────────────────────────────────────────────────────────────────────────────
const UnauthorizedCard: React.FC = () => (
  <div style={cardStyle}>
    <div style={cardHeaderStyle}>
      <img
        src="/brand/dentaxy-icon-solid.webp"
        alt="Dentaxy"
        style={{ width: 40, height: 40, objectFit: 'contain' }}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            '/lovable-uploads/7898fc25-0e62-40e1-a139-6582324afb27.png';
        }}
      />
      <span style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Dentaxy Technologies
      </span>
    </div>

    <div style={{ textAlign: 'center', margin: '24px 0 20px' }}>
      <div style={{ ...shieldIconWrapper, background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 style={{ ...verifiedTitleStyle, color: '#EF4444' }}>Acceso No Autorizado</h1>
      <p style={verifiedSubtitleStyle}>La verificación ha fallado.</p>
    </div>

    <div
      style={{
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: '10px',
        padding: '16px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '28px', fontWeight: 700, color: '#EF4444', letterSpacing: '-0.02em' }}>401</div>
      <div style={{ fontSize: '13px', color: '#fca5a5', marginTop: '4px' }}>Unauthorized</div>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '12px', marginBottom: 0, lineHeight: 1.5 }}>
        Este enlace no contiene un token de autenticación válido. Escanea la etiqueta NFC oficial del documento para acceder a la verificación.
      </p>
    </div>

    <hr style={dividerStyle} />
    <p style={footerNoteStyle}>
      Sistema de verificación de integridad — Dentaxy Technologies. El acceso a esta página está restringido a etiquetas NFC autorizadas.
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: fila de dato genérico
// ─────────────────────────────────────────────────────────────────────────────
const DataRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <div style={labelStyle}>{label}</div>
    <div>{children}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.85)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  padding: '28px 24px',
  boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
  color: '#e2e8f0',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
};

const shieldIconWrapper: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 72,
  height: 72,
  borderRadius: '50%',
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16,185,129,0.25)',
  marginBottom: '16px',
};

const verifiedTitleStyle: React.CSSProperties = {
  fontFamily: "'M PLUS 1p', 'Inter', sans-serif",
  fontWeight: 700,
  fontSize: '22px',
  color: '#f8fafc',
  margin: '0 0 8px',
  letterSpacing: '-0.02em',
};

const verifiedSubtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#94a3b8',
  margin: 0,
  lineHeight: 1.6,
};

const dividerStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid rgba(255,255,255,0.07)',
  margin: '20px 0',
};

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: '#64748b',
  fontWeight: 600,
};

const dataValueStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#cbd5e1',
};

const badgeSuccessStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  background: 'rgba(16, 185, 129, 0.15)',
  color: '#10B981',
  border: '1px solid rgba(16,185,129,0.3)',
  borderRadius: '9999px',
  padding: '3px 12px',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.05em',
};

const codeStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '13px',
  color: '#2563EB',
  background: 'rgba(37,99,235,0.1)',
  border: '1px solid rgba(37,99,235,0.2)',
  borderRadius: '6px',
  padding: '4px 8px',
};

const codeHashStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '11px',
  color: '#94a3b8',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '10px 12px',
  marginTop: '4px',
  userSelect: 'all' as const,
  lineHeight: 1.5,
};

const footerNoteStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#475569',
  lineHeight: 1.6,
  textAlign: 'center',
  margin: 0,
};

export default NFCVerify;

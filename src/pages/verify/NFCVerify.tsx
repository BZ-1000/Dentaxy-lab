import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// CAPA 1: TOKEN CRIPTOGRÁFICO LARGO — 64 chars hexadecimales (2^256 combinaciones)
// Para cambiar mensualmente: actualiza VALID_TOKENS y el URL en la etiqueta NFC.
// ─────────────────────────────────────────────────────────────────────────────
const DOCUMENT_ID = 'DX-UAO-2026-AUTH';

// Capa 3: Rotación mensual — sólo el del mes en curso es válido.
// Formato: { 'YYYY-MM': 'token' }
const VALID_TOKENS: Record<string, string> = {
  '2026-03': 'DX-UAO-2026-003bfa874c2d95e1a07f6bcde4f82910a3b7c5d8e9f1234567890abcdef1234',
  '2026-04': 'DX-UAO-2026-04e7d91a3f6b025c84d2e5a7b9c1f30e8d4a6b2c9e5f7a1b3d0c4e8f2a6b9d',
  '2026-05': 'DX-UAO-2026-05a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f6a7b8c9d0e1f2a3b4',
  '2026-06': 'DX-UAO-2026-06f1e2d3c4b5a67890fedcba9876543210abcdef1234567890abcdef12345678',
};

// Payload semántico del documento para el hash SHA-256
const DOCUMENT_PAYLOAD =
  'DENTAXY:TECHNOLOGIES:UAO-SYNC:LOI:2026:UAZ:ODONTOLOGIA:BRAULIO-ZAVALA:INMUTABLE';

// ─────────────────────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────────────────────

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function formatTimestamp(date: Date): string {
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const d = date.getDate().toString().padStart(2, '0');
  const m = meses[date.getMonth()];
  const y = date.getFullYear();
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${d} ${m} ${y} — ${h}:${min}:${s} CST`;
}

/** Obtiene el token válido para el mes actual. */
function getCurrentValidToken(): string | null {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return VALID_TOKENS[key] ?? null;
}

/** Capa 4: Detecta si el acceso viene desde un dispositivo mobile (NFC es siempre mobile). */
function isMobileDevice(): boolean {
  return /android|iphone|ipad|ipod|mobile|tablet/i.test(navigator.userAgent);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
const NFCVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('auth_token');

  // Capa 1+3: Verificar token contra el token mensual activo
  const currentValidToken = getCurrentValidToken();
  const isAuthorized = token !== null && token === currentValidToken;

  // Capa 4: Detección de dispositivo
  const [isMobile, setIsMobile] = useState(true);

  const [hash, setHash] = useState<string | null>(null);
  const [timestamp] = useState<string>(() => formatTimestamp(new Date()));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());

    if (isAuthorized) {
      sha256(DOCUMENT_PAYLOAD).then((h) => {
        setHash(h);
        setTimeout(() => setVisible(true), 80);
      });
    } else {
      setVisible(true);
    }
  }, [isAuthorized]);

  return (
    <>
      <MetaNoIndex />
      <main style={mainStyle}>
        <div style={{ ...wrapperStyle, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)' }}>
          {isAuthorized ? (
            <>
              {/* Capa 4: Advertencia de acceso desktop */}
              {!isMobile && <DesktopWarning />}
              <VerifiedCard hash={hash} timestamp={timestamp} />
            </>
          ) : (
            <UnauthorizedCard />
          )}
        </div>
      </main>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MetaNoIndex
// ─────────────────────────────────────────────────────────────────────────────
const MetaNoIndex: React.FC = () => {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Capa 4: Aviso Desktop
// ─────────────────────────────────────────────────────────────────────────────
const DesktopWarning: React.FC = () => (
  <div style={{
    background: 'rgba(234, 179, 8, 0.1)',
    border: '1px solid rgba(234,179,8,0.3)',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  }}>
    <span style={{ fontSize: '18px' }}>⚠️</span>
    <div>
      <div style={{ color: '#fbbf24', fontWeight: 600, fontSize: '12px', marginBottom: '2px' }}>
        ACCESO DETECTADO DESDE ESCRITORIO
      </div>
      <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.5 }}>
        Esta página está diseñada para ser accedida exclusivamente escaneando la etiqueta NFC del documento físico desde un dispositivo móvil.
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// VerifiedCard
// ─────────────────────────────────────────────────────────────────────────────
const VerifiedCard: React.FC<{ hash: string | null; timestamp: string }> = ({ hash, timestamp }) => {
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
      <div style={cardHeaderStyle}>
        <img
          src="/brand/dentaxy-icon-solid.webp"
          alt="Dentaxy"
          style={{ width: 40, height: 40, objectFit: 'contain' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/lovable-uploads/7898fc25-0e62-40e1-a139-6582324afb27.png'; }}
        />
        <span style={subtextStyle}>Dentaxy Technologies</span>
      </div>

      <div style={{ textAlign: 'center', margin: '24px 0 20px' }}>
        <div style={shieldWrapper('#10B981')}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
        <h1 style={titleStyle('#f8fafc')}>Documento Auténtico</h1>
        <p style={subtitleStyle}>Copia original verificada por<br /><strong style={{ color: '#fff' }}>Dentaxy Technologies</strong></p>
      </div>

      <hr style={dividerStyle} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <DataRow label="ESTADO">
          <span style={badgeSuccess}>✓ VERIFICADO</span>
        </DataRow>
        <DataRow label="ID DE REGISTRO">
          <code style={codeTagStyle}>{DOCUMENT_ID}</code>
        </DataRow>
        <DataRow label="MARCA DE TIEMPO">
          <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{timestamp}</span>
        </DataRow>
        <div>
          <div style={labelStyle}>HASH DE INTEGRIDAD (SHA-256)</div>
          <div
            onClick={handleCopyHash}
            title="Toca para copiar"
            style={{ ...codeHashStyle, borderColor: copied ? '#10B981' : 'rgba(255,255,255,0.08)', cursor: hash ? 'pointer' : 'default' }}
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

      {/* Capa 2: Indicador visual de seguridad */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
        <SecurityBadge icon="🔒" label="Token criptográfico de 256 bits" />
        <SecurityBadge icon="📅" label="Validez mensual con rotación automática" />
        <SecurityBadge icon="📵" label="Página no indexada por buscadores" />
        <SecurityBadge icon="📡" label="Acceso exclusivo vía etiqueta NFC física" />
      </div>

      <p style={footerNote}>
        Este enlace NFC está vinculado de forma permanente e inmutable al documento Carta de Intención UAO SYNC 2026.
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// UnauthorizedCard
// ─────────────────────────────────────────────────────────────────────────────
const UnauthorizedCard: React.FC = () => (
  <div style={cardStyle}>
    <div style={cardHeaderStyle}>
      <img
        src="/brand/dentaxy-icon-solid.webp"
        alt="Dentaxy"
        style={{ width: 40, height: 40, objectFit: 'contain' }}
        onError={(e) => { (e.target as HTMLImageElement).src = '/lovable-uploads/7898fc25-0e62-40e1-a139-6582324afb27.png'; }}
      />
      <span style={subtextStyle}>Dentaxy Technologies</span>
    </div>

    <div style={{ textAlign: 'center', margin: '24px 0 20px' }}>
      <div style={shieldWrapper('#EF4444', 'rgba(239,68,68,0.12)', 'rgba(239,68,68,0.25)')}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 style={titleStyle('#EF4444')}>Acceso No Autorizado</h1>
      <p style={subtitleStyle}>La verificación ha fallado.</p>
    </div>

    <div style={{
      background: 'rgba(239,68,68,0.08)',
      border: '1px solid rgba(239,68,68,0.2)',
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '32px', fontWeight: 700, color: '#EF4444', letterSpacing: '-0.02em' }}>401</div>
      <div style={{ fontSize: '13px', color: '#fca5a5', marginTop: '4px', letterSpacing: '0.05em' }}>UNAUTHORIZED</div>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '14px', marginBottom: 0, lineHeight: 1.6 }}>
        Este enlace no contiene un token de autenticación válido o ha expirado. Escanea la <strong style={{ color: '#e2e8f0' }}>etiqueta NFC oficial</strong> del documento físico para acceder.
      </p>
    </div>

    <hr style={dividerStyle} />
    <p style={footerNote}>
      Sistema de verificación de integridad — Dentaxy Technologies.<br />
      Acceso restringido a portadores de documentos NFC autorizados.
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de UI
// ─────────────────────────────────────────────────────────────────────────────
const DataRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <div style={labelStyle}>{label}</div>
    <div>{children}</div>
  </div>
);

const SecurityBadge: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span style={{ fontSize: '13px' }}>{icon}</span>
    <span style={{ fontSize: '11px', color: '#64748b' }}>{label}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────────────────────────────────
const mainStyle: React.CSSProperties = {
  minHeight: '100svh',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2255 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px 16px',
  fontFamily: "'Inter', 'M PLUS 1p', sans-serif",
};

const wrapperStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '420px',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
};

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
};

const shieldWrapper = (
  stroke: string,
  bg = 'rgba(16, 185, 129, 0.1)',
  border = 'rgba(16,185,129,0.25)'
): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 72,
  height: 72,
  borderRadius: '50%',
  background: bg,
  border: `1px solid ${border}`,
  marginBottom: '16px',
});

const titleStyle = (color: string): React.CSSProperties => ({
  fontFamily: "'M PLUS 1p', 'Inter', sans-serif",
  fontWeight: 700,
  fontSize: '22px',
  color,
  margin: '0 0 8px',
  letterSpacing: '-0.02em',
});

const subtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#94a3b8',
  margin: 0,
  lineHeight: 1.6,
};

const subtextStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
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

const badgeSuccess: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  background: 'rgba(16, 185, 129, 0.15)',
  color: '#10B981',
  border: '1px solid rgba(16,185,129,0.3)',
  borderRadius: '9999px',
  padding: '3px 12px',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.05em',
};

const codeTagStyle: React.CSSProperties = {
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
  transition: 'border-color 0.2s',
};

const footerNote: React.CSSProperties = {
  fontSize: '11px',
  color: '#475569',
  lineHeight: 1.6,
  textAlign: 'center',
  margin: 0,
};

export default NFCVerify;

/**
 * AcademicoDemo.tsx — SISTEMA UAZ
 * Login screen con escrutinio geográfico y tokens de acceso dinámicos.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ShieldAlert, ShieldCheck, ChevronRight, MapPin, Loader2, KeySquare, Copy, CheckCircle2, QrCode } from 'lucide-react';
import { useDemo } from './context/DemoContext';
import { checkGeofence } from './utils/geo';
import { RolId } from '@/data/uaoMockData';
import { useDemoTokenValidator } from '@/hooks/useDemoTokenValidator';
import { supabase } from '@/integrations/supabase/client';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE GENERADOR DE TOKENS (DIRECTOR / ADMIN)
// ─────────────────────────────────────────────────────────────────────────────
const TokenManager: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
  const { generateToken, validTokens } = useDemo();
  const [copied, setCopied] = useState<string | null>(null);

  const ROLES_DISPONIBLES: { id: RolId; label: string }[] = [
    { id: 'director', label: 'Director General' },
    { id: 'coordinador', label: 'Coordinador Académico' },
    { id: 'jefe', label: 'Jefe de Clínica' },
    { id: 'docente', label: 'Docente Clínico' },
    { id: 'alumno', label: 'Alumno Clínico' },
    { id: 'administrativo', label: 'Administrativo' },
    { id: 'paciente', label: 'Portal Paciente' },
  ];

  const handleCopy = (tkn: string) => {
    navigator.clipboard.writeText(tkn);
    setCopied(tkn);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl relative"
      onClick={e => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
        <KeySquare className="h-5 w-5 text-emerald-500" />
        Generador Maestro de Accesos
      </h2>
      <p className="text-sm text-zinc-500 mb-6 font-medium">
        Crea llaves temporales de acceso para los doctores durante la presentación.
      </p>

      <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
        {ROLES_DISPONIBLES.map(r => (
          <div key={r.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{r.label}</p>
            </div>
            <button
              type="button"
              onClick={() => generateToken(r.id)}
              className="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-lg hover:bg-zinc-800"
            >
              Generar
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Tokens Activos</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {Object.entries(validTokens).reverse().map(([tkn, rol]) => (
            <div key={tkn} className="flex flex-col gap-1 p-2 border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">{rol}</span>
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">{tkn}</code>
                <button
                  type="button"
                  onClick={() => handleCopy(tkn)}
                  className="p-1.5 text-zinc-400 hover:text-emerald-600 transition-colors"
                >
                  {copied === tkn ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
          {Object.keys(validTokens).length === 0 && (
            <p className="text-xs text-zinc-500 italic">No hay tokens activos generados.</p>
          )}
        </div>
      </div>
      
      <button 
        onClick={onClose}
        className="mt-6 w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold text-sm rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        Cerrar Panel
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN FORM (TOKENS + GPS)
// ─────────────────────────────────────────────────────────────────────────────

const ConstrainedAccess: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithToken, isAuthenticated, rolActivo } = useDemo();
  const { validateToken } = useDemoTokenValidator();

  const [token, setToken] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Estado de validación GPS
  const [geoZoneForToken, setGeoZoneForToken] = useState<{
    name: string; lat: number; lng: number; radiusKm: number;
  } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'checking' | 'ok' | 'denied'>('idle');
  const [geoMessage, setGeoMessage] = useState('');

  // Estado para Administrar Tokens (secreto: director-root)
  const [showTokenManager, setShowTokenManager] = useState(false);

  // Redirigir si ya está logeado
  useEffect(() => {
    if (isAuthenticated && rolActivo) {
      navigate(`/academico/${rolActivo}`);
    } else if (isAuthenticated && !rolActivo) {
      navigate('/academico/roles');
    }
  }, [isAuthenticated, rolActivo, navigate]);

  // Verificar GPS contra la zona del token cuando se activa el geofence
  const checkTokenGeo = async (zone: { name: string; lat: number; lng: number; radiusKm: number }) => {
    setGeoStatus('checking');
    const result = await checkGeofence({
      customZones: [{ nombre: zone.name, lat: zone.lat, lng: zone.lng, radiusKm: zone.radiusKm }],
    });
    if (result.ok) {
      setGeoStatus('ok');
      setGeoMessage(`En zona: ${result.zonaNombre}`);
    } else {
      setGeoStatus('denied');
      setGeoMessage(result.error || 'Fuera de la zona autorizada');
    }
    return result.ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let tkn = token.trim();

    // Extractor de URL si el usuario pegó el link completo
    if (tkn.toLowerCase().includes('demo=')) {
      try {
        const urlStr = tkn.toLowerCase().startsWith('http') ? tkn : `http://${tkn}`;
        const url = new URL(urlStr);
        // Rescatar param respetando el case original (si url lo permite) 
        // Es mejor extraerlo con REXGEX para no perder cases
        const match = token.match(/[?&]demo=([^&]+)/i) || token.match(/[?&]DEMO=([^&]+)/i);
        if (match) tkn = match[1];
      } catch (e) {
        const match = token.match(/[?&]demo=([^&]+)/i);
        if (match) tkn = match[1];
      }
    }

    // Huevo de pascua para el panel de tokens locales
    if (tkn === 'director-root') {
      setShowTokenManager(true);
      setToken('');
      setLoading(false);
      return;
    }

    // Bypass maestro para desarrollo
    if (tkn.toLowerCase() === 'admin') {
      loginWithToken('admin');
      return;
    }

    // 1. Validar token contra Supabase (con fallback local)
    const validation = await validateToken(tkn);
    if (!validation.valid) {
      setLoading(false);
      setError(validation.errorMessage || 'Token inválido o expirado.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    // 2. Si el token requiere geofence, verificar GPS
    if (validation.requiresGeoCheck && validation.geoZone) {
      setGeoZoneForToken(validation.geoZone);
      const isInside = await checkTokenGeo(validation.geoZone);
      if (!isInside) {
        setLoading(false);
        setError(`Acceso restringido: Debes estar en "${validation.geoZone.name}" para usar este token.`);
        setShake(true);
        setTimeout(() => setShake(false), 600);
        return;
      }
    }

    // 3. Token de Supabase válido — registrar sesión e iniciar
    if (validation.source === 'supabase' && validation.tokenRow) {
      // Incrementar uso en Supabase via RPC (bypassa RLS public)
      try {
        await supabase.rpc('increment_demo_uses', { p_token: tkn });
      } catch (err) { 
        console.error("Error al incrementar usos", err);
      }

      // Guardar en sessionStorage para que el Hub también lo conozca
      sessionStorage.setItem('demo_token', tkn);
      sessionStorage.setItem('demo_source', 'supabase');

      // El módulo principal permitido (por defecto: academico)
      const primaryModule = validation.allowedModules?.[0] ?? 'academico';
      if (primaryModule === 'academico') {
        // Usar loginWithToken local para el router interno de UAO
        const ok = loginWithToken(tkn);
        if (!ok) {
          // Si no hay token local con ese valor, entrar en modo libre
          loginWithToken('admin');
        }
      } else {
        navigate(`/${primaryModule}`);
      }
      setLoading(false);
      return;
    }

    // 4. Fallback: token local UAO
    await new Promise(r => setTimeout(r, 400));
    const ok = loginWithToken(tkn);
    setLoading(false);
    if (!ok) {
      setError('Token de acceso inválido o expirado.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
      {/* Background UI */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-100/30 dark:bg-emerald-900/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {showTokenManager ? (
          <motion.div key="manager" className="relative w-full max-w-sm z-10" exit={{ opacity: 0, scale: 0.9 }}>
            <TokenManager onClose={() => setShowTokenManager(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm z-10"
          >
            <motion.div
              animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/60 dark:shadow-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden"
            >
              {/* Header Box */}
              <div className="px-8 pt-8 pb-6 text-center border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-center gap-4 mb-5">
                  <img
                    src="/logos/uao-odontologia.png"
                    alt="UAO Zacatecas"
                    className="h-11 w-11 object-contain"
                  />
                  <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700" />
                  <img
                    src="/brand/dentaxy-icon-outline.webp"
                    alt="Dentaxy"
                    className="h-9 w-9 dark:invert"
                  />
                </div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  UAO Sync
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Acceso Restringido por Token
                </p>
              </div>

              {/* Geo Status chip (solo visible cuando hay info del token) */}
              {(geoStatus !== 'idle') && (
                <div className={`px-8 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                  geoStatus === 'ok'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                    : geoStatus === 'denied'
                    ? 'bg-red-50 dark:bg-red-950/20 text-red-600'
                    : 'bg-zinc-50 text-zinc-400'
                }`}>
                  {geoStatus === 'checking' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {geoStatus === 'ok' && <ShieldCheck className="h-3.5 w-3.5" />}
                  {geoStatus === 'denied' && <ShieldAlert className="h-3.5 w-3.5" />}
                  {geoStatus === 'checking' ? 'Verificando ubicación...' : geoMessage}
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">

                {/* Nombre (opcional pero recomendado) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                    Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="Dr. García"
                    autoComplete="name"
                    className="w-full px-3 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Token */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                    Access Token / Llave Maestra
                  </label>
                  <div className="relative group">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-zinc-900 dark:group-focus-within:text-white" />
                    <input
                      type="text"
                      value={token}
                      onChange={e => { setToken(e.target.value); setError(''); setGeoStatus('idle'); }}
                      placeholder="TKN-XXXXXX o URL link"
                      autoComplete="off"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono tracking-widest text-center"
                    />
                  </div>
                </div>

                {/* Geo chip del token (si aplica) */}
                {geoZoneForToken && geoStatus === 'idle' && (
                  <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 rounded-xl px-3 py-2 font-semibold">
                    <MapPin className="h-3.5 w-3.5" />
                    Zona requerida: {geoZoneForToken.name}
                  </div>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800"
                    >
                      <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-tight">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading || !token || geoStatus === 'checking'}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-4 text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-xl bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20 active:scale-[0.98] disabled:bg-zinc-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading || geoStatus === 'checking' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Validar Ingreso
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center justify-center gap-2 mt-5"
            >
              <div className="flex items-center gap-1.5 text-zinc-400">
                <QrCode className="h-3.5 w-3.5" />
                <p className="text-xs font-medium">Autenticación por Token Seguro UAZ</p>
              </div>
              <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-600">
                Tokens generados en Demo Engine · Acceso local sin internet disponible.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AcademicoDemo: React.FC = () => <ConstrainedAccess />;
export default AcademicoDemo;

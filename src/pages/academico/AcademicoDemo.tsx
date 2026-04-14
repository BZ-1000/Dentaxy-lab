/**
 * AcademicoDemo.tsx — FASE 1
 * Login screen del sistema DentaXy UAO Sync
 * Acceso: usuario "admin" · contraseña "admin"
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, User, AlertCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { useDemo } from './context/DemoContext';

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN FORM
// ─────────────────────────────────────────────────────────────────────────────

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, rolActivo } = useDemo();

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Si ya está autenticado, redirige
  useEffect(() => {
    if (isAuthenticated) {
      navigate(rolActivo ? `/academico/${rolActivo}` : '/academico/roles');
    }
  }, [isAuthenticated, rolActivo, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular latencia de red (realismo)
    await new Promise(r => setTimeout(r, 700));

    const ok = login(usuario, password);
    setLoading(false);

    if (!ok) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    // Si es ok, el useEffect de isAuthenticated se activa
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
      {/* Textura de fondo sutil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-100/40 dark:bg-blue-900/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-100/40 dark:bg-emerald-900/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Card principal */}
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/60 dark:shadow-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden"
        >
          {/* Header de la card */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-zinc-100 dark:border-zinc-800">
            {/* Logos */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <img
                src="/logos/uao-uaz-logo.svg"
                alt="UAO UAZ"
                className="h-10 w-10"
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
              Sistema Operativo Académico · UAZ
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
            {/* Usuario */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                Usuario institucional
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  value={usuario}
                  onChange={e => { setUsuario(e.target.value); setError(''); }}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800"
                >
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón de acceso */}
            <button
              type="submit"
              disabled={loading || !usuario || !password}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98] transition-all duration-150 shadow-sm"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/40 dark:border-zinc-900/40 border-t-white dark:border-t-zinc-900 rounded-full animate-spin" />
              ) : (
                <>
                  Acceder al Sistema
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Badge de seguridad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-5"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
          <p className="text-xs text-zinc-400">
            Datos cifrados · Sesión encriptada AES-256
          </p>
        </motion.div>

        {/* Créditos / versión */}
        <p className="text-center text-[11px] text-zinc-300 dark:text-zinc-600 mt-3">
          DentaXy UAO Sync · Demo v1.0 — UAZ Zacatecas
        </p>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS — El DemoProvider vive en App.tsx, aquí solo exportamos el form
// ─────────────────────────────────────────────────────────────────────────────

export const AcademicoDemo: React.FC = () => <LoginForm />;

export default AcademicoDemo;

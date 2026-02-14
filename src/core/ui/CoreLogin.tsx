"use client";

import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, User, Loader2 } from 'lucide-react';

interface CoreLoginProps {
    onLogin: () => void;
}

// Credenciales fijas de administrador
const ADMIN_USER = 'BZ.1000';
const ADMIN_PASS = 'Singularidad.1000';

export const CoreLogin: React.FC<CoreLoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shake, setShake] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Simular breve delay de verificación
        await new Promise(resolve => setTimeout(resolve, 800));

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            onLogin();
        } else {
            setError('Credenciales incorrectas');
            setShake(true);
            setTimeout(() => setShake(false), 600);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            {/* Fondo con efecto de gradiente sutil */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)' }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)' }}
                />
            </div>

            {/* Card principal glassmorphism */}
            <div
                className={`
                    relative w-full max-w-[360px] p-7 overflow-hidden
                    bg-white/80 backdrop-blur-xl 
                    rounded-[2rem] shadow-2xl 
                    border border-white/50
                    transition-transform duration-300
                    ${shake ? 'animate-shake' : ''}
                `}
                style={{
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                    color: 'rgb(17, 24, 39)',
                }}
            >
                {/* Decoración sutil de fondo dentro de la card */}
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-200/30 to-emerald-200/20 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-tr from-slate-200/40 to-indigo-100/20 blur-2xl pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 mb-6 text-center">
                    <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-emerald-500/10 flex items-center justify-center border border-indigo-200/30 shadow-sm">
                        <Shield className="w-7 h-7 text-indigo-500/80" />
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                        Admin
                    </h2>
                    <p className="mt-1.5 text-[13px] text-gray-400 font-medium leading-snug">
                        Acceso reservado para administración
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                    {/* Campo Usuario */}
                    <div className="space-y-1.5">
                        <label htmlFor="core-admin-user" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                            Usuario
                        </label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                id="core-admin-user"
                                type="text"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                                placeholder="BZ.1000"
                                autoComplete="username"
                                className="
                                    w-full pl-10 pr-4 py-3 
                                    bg-white/60 backdrop-blur-sm
                                    border border-gray-200/60 
                                    rounded-xl text-[15px] text-gray-900
                                    placeholder:text-gray-300
                                    outline-none
                                    focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100
                                    transition-all duration-200
                                "
                            />
                        </div>
                    </div>

                    {/* Campo Contraseña */}
                    <div className="space-y-1.5">
                        <label htmlFor="core-admin-pass" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                            Contraseña
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                id="core-admin-pass"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                placeholder="••••••••••••"
                                autoComplete="current-password"
                                className="
                                    w-full pl-10 pr-11 py-3 
                                    bg-white/60 backdrop-blur-sm
                                    border border-gray-200/60 
                                    rounded-xl text-[15px] text-gray-900
                                    placeholder:text-gray-300
                                    outline-none
                                    focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100
                                    transition-all duration-200
                                "
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50/80 border border-red-100/60 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-red-400 shrink-0 animate-pulse" />
                            <p className="text-[12px] text-red-500 font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Botón Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !username.trim() || !password.trim()}
                        className="
                            w-full py-3.5 mt-2
                            bg-gradient-to-r from-gray-900 to-gray-800
                            text-white text-[13px] font-bold tracking-wide
                            rounded-xl
                            shadow-lg shadow-gray-900/15
                            hover:from-gray-800 hover:to-gray-700
                            active:scale-[0.98]
                            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                            transition-all duration-200
                            flex items-center justify-center gap-2
                        "
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Verificando...</span>
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                <span>Acceder</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer de seguridad */}
                <div className="relative z-10 mt-5 pt-4 border-t border-gray-100/60">
                    <p className="text-center text-[10px] text-gray-300 font-medium leading-relaxed">
                        🔒 Conexión protegida · Dentaxy Core
                    </p>
                </div>
            </div>

            {/* Animación de shake para errores */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

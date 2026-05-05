/**
 * ShopAdminPreview.tsx
 * Componente aislado para previsualizar el Admin Login del Shop dentro de Dentaxy Studio.
 * Incluye la popup card de autenticación sin dependencias de navegación ni autenticación real.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

type ModalState = 'none' | 'admin' | 'presale' | 'waitlist';

export default function ShopAdminPreview() {
    const [openModal, setOpenModal] = useState<ModalState>('none');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [presaleCode, setPresaleCode] = useState('');
    const [presaleError, setPresaleError] = useState('');
    const [presaleSubmitting, setPresaleSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);
    const [waitlistCount] = useState(127);

    const handleAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        setAuthError('Credenciales no reconocidas. (Vista previa)');
        setIsSubmitting(false);
    };

    const handlePresaleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPresaleError('');
        setPresaleSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPresaleError('Código inválido o expirado. (Vista previa)');
        setPresaleSubmitting(false);
    };

    const handleWaitlistSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setWaitlistSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setWaitlistSubmitting(false);
        setWaitlistSuccess(true);
    };

    return (
        <div className="min-h-[600px] w-full relative bg-white overflow-hidden font-sans selection:bg-emerald-500/20 selection:text-emerald-900">

            {/* Main Content */}
            <main className="relative z-10 min-h-[600px] w-full flex flex-col items-center justify-center p-6">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center text-center space-y-10 max-w-3xl"
                >
                    {/* Hero Section */}
                    <div className="space-y-6 flex flex-col items-center">

                        {/* Animated Counter Pill */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-full shadow-sm"
                        >
                            <div className="flex -space-x-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center overflow-hidden">
                                        <User className="w-3 h-3 text-neutral-400" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <p className="text-sm font-medium text-neutral-600">
                                    <span className="text-neutral-900 font-bold">{waitlistCount}</span> en espera
                                </p>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-900 font-sans leading-tight">
                            Dentaxy<span className="text-emerald-500">.Shop</span>
                        </h1>

                        <p className="text-base md:text-lg text-neutral-500 font-light max-w-lg mx-auto leading-relaxed">
                            Suministros inteligentes para la odontología moderna.
                        </p>
                    </div>

                    {/* Action Cards */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
                        <button
                            onClick={() => setOpenModal('admin')}
                            className="flex-1 group relative bg-white border border-neutral-100 p-5 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowRight className="w-5 h-5 text-neutral-500 -rotate-45" />
                            </div>
                            <div className="bg-neutral-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                                <Lock className="w-6 h-6 text-neutral-900" />
                            </div>
                            <div className="space-y-1 relative z-10">
                                <h3 className="font-bold text-neutral-900 text-lg">Admin</h3>
                                <p className="text-sm text-neutral-500">Acceso reservado</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setOpenModal('presale')}
                            className="flex-1 group relative bg-white border border-neutral-100 p-5 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowRight className="w-5 h-5 text-emerald-500 -rotate-45" />
                            </div>
                            <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="space-y-1 relative z-10">
                                <h3 className="font-bold text-neutral-900 text-lg group-hover:text-emerald-700 transition-colors">Tengo Código</h3>
                                <p className="text-sm text-neutral-500">Acceso anticipado</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setOpenModal('waitlist')}
                            className="flex-1 group relative bg-white border border-neutral-100 p-5 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowRight className="w-5 h-5 text-blue-500 -rotate-45" />
                            </div>
                            <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                                <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="space-y-1 relative z-10">
                                <h3 className="font-bold text-neutral-900 text-lg group-hover:text-blue-700 transition-colors">Lista de Espera</h3>
                                <p className="text-sm text-neutral-500">Notificar lanzamiento</p>
                            </div>
                        </button>
                    </div>

                </motion.div>
            </main>

            {/* MODALS */}
            <AnimatePresence>
                {openModal !== 'none' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-neutral-900/20 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setOpenModal('none')}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/80 backdrop-blur-xl w-full max-w-[360px] p-7 rounded-[2rem] shadow-2xl border border-white/50 relative overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenModal('none')}
                                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                            >
                                <X className="w-4 h-4 text-neutral-600" />
                            </button>

                            {/* Admin Modal */}
                            {openModal === 'admin' && (
                                <div className="space-y-5">
                                    <div className="text-center space-y-2">
                                        <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Lock className="w-6 h-6 text-neutral-900" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-neutral-900">Admin</h2>
                                        <p className="text-neutral-500 text-sm">Acceso reservado para administración</p>
                                    </div>

                                    <form onSubmit={handleAdminSubmit} className="space-y-3">
                                        <div className="space-y-3">
                                            <input
                                                placeholder="ID de Usuario"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full h-12 rounded-xl bg-white/50 border border-neutral-200 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Contraseña"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full h-12 rounded-xl bg-white/50 border border-neutral-200 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                            />
                                        </div>

                                        {authError && (
                                            <p className="text-xs text-red-500 text-center font-medium bg-red-50 py-2 rounded-lg">
                                                {authError}
                                            </p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm transition-colors disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Verificando...' : 'Acceder'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Presale Modal */}
                            {openModal === 'presale' && (
                                <div className="space-y-5">
                                    <div className="text-center space-y-2">
                                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-neutral-900">Preventa</h2>
                                        <p className="text-neutral-500 text-sm">Introduce tu código de invitación</p>
                                    </div>

                                    <form onSubmit={handlePresaleSubmit} className="space-y-3">
                                        <input
                                            placeholder="XXXX-XXXX-XXXX"
                                            className="w-full h-14 text-center text-lg font-mono tracking-widest uppercase rounded-xl bg-white/50 border border-neutral-200 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                            value={presaleCode}
                                            onChange={(e) => setPresaleCode(e.target.value)}
                                        />

                                        {presaleError && (
                                            <p className="text-xs text-amber-600 text-center bg-amber-50 py-2 rounded-lg font-medium">
                                                {presaleError}
                                            </p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={presaleSubmitting}
                                            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-lg shadow-emerald-200 transition-colors disabled:opacity-50"
                                        >
                                            {presaleSubmitting ? 'Validando...' : 'Canjear Código'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Waitlist Modal */}
                            {openModal === 'waitlist' && (
                                <div className="space-y-5">
                                    {!waitlistSuccess ? (
                                        <>
                                            <div className="text-center space-y-2">
                                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <Mail className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-neutral-900">Lista de Espera</h2>
                                                <p className="text-neutral-500 text-sm">Recibe noticias exclusivas</p>
                                            </div>

                                            <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                                                <input
                                                    type="email"
                                                    placeholder="tu@email.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full h-12 rounded-xl bg-white/50 border border-neutral-200 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                    required
                                                />

                                                <button
                                                    type="submit"
                                                    disabled={waitlistSubmitting}
                                                    className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-lg shadow-blue-200 transition-colors disabled:opacity-50"
                                                >
                                                    {waitlistSubmitting ? 'Registrando...' : 'Unirme'}
                                                </button>
                                            </form>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ArrowRight className="w-8 h-8 text-green-600" />
                                            </div>
                                            <h3 className="text-xl font-bold text-neutral-900">¡Suscrito!</h3>
                                            <p className="text-neutral-500 mt-2 text-sm">Te mantendremos informado.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, User, ShieldCheck, Mail, Lock, Upload, Loader2, CheckCircle2, AlertCircle, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OrganicShopFrame from '@/components/shop/OrganicShopFrame';
import "./Seed.css";
import { useP2P } from '@/hooks/useP2P';
import { leadsService } from '@/services/leads';
import { toast } from 'sonner';

type ModalState = 'none' | 'admin' | 'presale' | 'waitlist';

// Animation Variants (Reuse standard ones)
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

export default function SeedLogin() {
    const [openModal, setOpenModal] = useState<ModalState>('none');
    const navigate = useNavigate();

    // Login State (Admin)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Presale State (Code)
    const [presaleCode, setPresaleCode] = useState('');
    const [presaleError, setPresaleError] = useState('');
    const [presaleSubmitting, setPresaleSubmitting] = useState(false);

    // Waitlist State (DENTAXY Nexus - P2P)
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);
    const [p2pError, setP2pError] = useState('');

    // P2P Hook (modo emisor)
    const { initializePeer, sendLeadData } = useP2P();

    // Simulated count (Maybe different for Seed?)
    const [waitlistCount] = useState(843);

    const handleAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setIsSubmitting(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));

        // Mock login logic
        if (username === 'admin' && password === 'admin') {
            navigate('/seed/overview', { replace: true });
        } else {
            setAuthError('Credenciales no reconocidas.');
            setIsSubmitting(false);
        }
    };

    const handlePresaleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPresaleError('');
        setPresaleSubmitting(true);
        // Simulate code validation
        if (presaleCode === 'SEED-2024') {
            await new Promise(resolve => setTimeout(resolve, 800));
            navigate('/seed/overview', { replace: true });
        } else {
            await new Promise(resolve => setTimeout(resolve, 800));
            setPresaleError('Código inválido o expirado.');
            setPresaleSubmitting(false);
        }
    };

    const handleWaitlistSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setWaitlistSubmitting(true);
        setP2pError('');

        try {
            // 1. Leer el PeerID del receptor (DENTAXY Nexus) desde Supabase
            const receiverPeerId = await leadsService.getReceiverPeerId();

            // 2. Inicializar el peer emisor
            const peer = await initializePeer();

            // 3. Preparar datos del lead
            const leadData = {
                full_name: fullName,
                phone: `+52 ${phone}`,
                source: 'Seed' as const,
                email,
            };

            // 4. Si DENTAXY Nexus está abierto, enviar vía P2P (con archivo si existe)
            if (receiverPeerId) {
                try {
                    await sendLeadData(receiverPeerId, leadData, file || undefined);
                    toast.success('📡 Historia enviada a DENTAXY Nexus');
                } catch (p2pErr) {
                    console.warn('[Seed] P2P no disponible:', p2pErr);
                    toast.info('DENTAXY Nexus no está disponible · Guardando en base de datos');
                }
            } else {
                toast.info('DENTAXY Nexus offline · Guardando en base de datos');
            }

            // 5. Guardar metadatos en Supabase (siempre, el archivo va por P2P)
            await leadsService.createLead({
                full_name: fullName,
                phone: `+52 ${phone}`,
                source: 'Seed',
                peer_id: peer.id || '',
                email,
            });

            setWaitlistSuccess(true);
        } catch (error) {
            console.error('[Seed] Error enviando lead:', error);
            setP2pError('Hubo un error al enviar tus datos. Inténtalo de nuevo.');
        } finally {
            setWaitlistSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="seed-theme min-h-screen w-full relative bg-white overflow-hidden font-sans selection:bg-blue-500/20 selection:text-blue-900">

            {/* Background - Pure White */}
            <div className="absolute inset-0 bg-white pointer-events-none" />

            {/* Reusing OrganicShopFrame but we might want to override onAdminClick color eventually via CSS or tailored component if needed. 
          For now, it provides the structure requested: "identico en volver a inicio, admin access".
      */}
            <OrganicShopFrame
                onHomeClick={() => navigate('/')}
                onAdminClick={() => setOpenModal('admin')}
                waitlistCount={waitlistCount}
            />

            {/* Main Content */}
            <main className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center p-6">

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex flex-col items-center text-center space-y-12 max-w-4xl"
                >
                    {/* Hero Section */}
                    <div className="space-y-8 flex flex-col items-center">

                        {/* Animated Counter Pill - Using Seed Blue Logic */}
                        <motion.div
                            variants={fadeUp}
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
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                <p className="text-sm font-medium text-neutral-600">
                                    <span className="text-neutral-900 font-bold">{waitlistCount}</span> en espera
                                </p>
                            </div>
                        </motion.div>

                        {/* Massive Title */}
                        <motion.h1
                            variants={fadeUp}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
                        >
                            <span className="text-gray-900">Dentaxy</span>{" "}
                            <span className="seed-text">Seed</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            variants={fadeUp}
                            className="text-xl md:text-2xl seed-text font-medium mb-4"
                        >
                            La semilla inteligente de tu consultorio
                        </motion.p>

                        {/* Description */}
                        <motion.p
                            variants={fadeUp}
                            className="text-lg text-gray-500 max-w-2xl mx-auto mb-12"
                        >
                            Transforma tu historia clínica en un sistema inteligente, privado y
                            seguro que escribe, organiza y protege tu práctica clínica.
                        </motion.p>
                    </div>

                    {/* Action Interface - Rich Cards */}
                    <motion.div
                        variants={staggerContainer}
                        className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mt-8"
                    >
                        {/* Card 1: Tengo Código */}
                        <motion.button
                            variants={scaleIn}
                            onClick={() => setOpenModal('presale')}
                            className="flex-1 group relative bg-white border border-neutral-100 p-6 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowRight className="w-5 h-5 text-blue-500 -rotate-45" />
                            </div>

                            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="w-7 h-7 text-blue-600" />
                            </div>

                            <div className="space-y-1 relative z-10">
                                <h3 className="font-bold text-neutral-900 text-xl group-hover:text-blue-700 transition-colors">Tengo Código</h3>
                                <p className="text-sm text-neutral-500">Acceso anticipado a preventa</p>
                            </div>
                        </motion.button>

                        {/* Card 2: Lista de Espera */}
                        <motion.button
                            variants={scaleIn}
                            onClick={() => setOpenModal('waitlist')}
                            className="flex-1 group relative bg-white border border-neutral-100 p-6 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(99,102,241,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowRight className="w-5 h-5 text-indigo-500 -rotate-45" />
                            </div>

                            <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                <Mail className="w-7 h-7 text-indigo-600" />
                            </div>

                            <div className="space-y-1 relative z-10">
                                <h3 className="font-bold text-neutral-900 text-xl group-hover:text-indigo-700 transition-colors">Lista de Espera</h3>
                                <p className="text-sm text-neutral-500">Notificar lanzamiento oficial</p>
                            </div>
                        </motion.button>
                    </motion.div>

                </motion.div>
            </main>

            {/* MODALS (Identical Logic) */}
            <AnimatePresence>
                {openModal !== 'none' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-neutral-900/20 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => {
                            if (!waitlistSuccess) setOpenModal('none');
                            else setOpenModal('none');
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/80 backdrop-blur-xl w-full max-w-[400px] p-8 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenModal('none')}
                                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                            >
                                <X className="w-4 h-4 text-neutral-600" />
                            </button>

                            {/* Modal Content Switcher */}
                            {openModal === 'admin' && (
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Lock className="w-6 h-6 text-neutral-900" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-neutral-900">Admin Seed</h2>
                                        <p className="text-neutral-500 text-sm">Acceso reservado para administración</p>
                                    </div>

                                    <form onSubmit={handleAdminSubmit} className="space-y-4">
                                        <div className="space-y-3">
                                            <Input
                                                placeholder="ID de Usuario"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="h-12 rounded-xl bg-white/50 border-neutral-200 focus:ring-blue-500/20"
                                            />
                                            <Input
                                                type="password"
                                                placeholder="Contraseña"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="h-12 rounded-xl bg-white/50 border-neutral-200 focus:ring-blue-500/20"
                                            />
                                        </div>

                                        {authError && (
                                            <p className="text-xs text-red-500 text-center font-medium bg-red-50 py-2 rounded-lg">
                                                {authError}
                                            </p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium"
                                        >
                                            {isSubmitting ? 'Verificando...' : 'Acceder'}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {openModal === 'presale' && (
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-neutral-900">Preventa Seed</h2>
                                        <p className="text-neutral-500 text-sm">Introduce tu código de invitación</p>
                                    </div>

                                    <form onSubmit={handlePresaleSubmit} className="space-y-4">
                                        <Input
                                            placeholder="SEED-XXXX-XXXX"
                                            className="h-14 text-center text-lg font-mono tracking-widest uppercase rounded-xl bg-white/50 border-neutral-200"
                                            value={presaleCode}
                                            onChange={(e) => setPresaleCode(e.target.value)}
                                        />

                                        {presaleError && (
                                            <p className="text-xs text-amber-600 text-center bg-amber-50 py-2 rounded-lg font-medium">
                                                {presaleError}
                                            </p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={presaleSubmitting}
                                            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-200"
                                        >
                                            {presaleSubmitting ? 'Validando...' : 'Canjear Código'}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {openModal === 'waitlist' && (
                                <div className="space-y-6">
                                    {!waitlistSuccess ? (
                                        <>
                                            <div className="text-center space-y-2">
                                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <Mail className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-neutral-900">Lista de Espera</h2>
                                                <p className="text-neutral-500 text-sm">Recibe noticias exclusivas de Seed</p>
                                            </div>

                                            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                                                <div className="space-y-3">
                                                    <Input
                                                        type="text"
                                                        placeholder="Nombre Completo"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        className="h-11 rounded-xl bg-white/50 border-neutral-200"
                                                        required
                                                    />

                                                    <Input
                                                        type="email"
                                                        placeholder="correo@ejemplo.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="h-11 rounded-xl bg-white/50 border-neutral-200"
                                                        required
                                                    />

                                                    {/* Teléfono con bandea MX + formato automático */}
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm flex items-center gap-1 pointer-events-none">
                                                            🇲🇽 +52
                                                        </span>
                                                        <Input
                                                            type="tel"
                                                            placeholder="123 456 7890"
                                                            value={phone}
                                                            onChange={(e) => {
                                                                let input = e.target.value.replace(/\D/g, '');
                                                                if (input.length > 10) input = input.slice(0, 10);
                                                                let res = '';
                                                                if (input.length > 0) res += input.substring(0, 3);
                                                                if (input.length >= 4) res += ' ' + input.substring(3, 6);
                                                                if (input.length >= 7) res += ' ' + input.substring(6, 10);
                                                                setPhone(res);
                                                            }}
                                                            className="h-11 rounded-xl bg-white/50 border-neutral-200 pl-20"
                                                            required
                                                        />
                                                    </div>

                                                    {/* File Upload Field */}
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            id="file-upload-seed"
                                                            className="hidden"
                                                            accept=".pdf,application/pdf"
                                                            onChange={handleFileChange}
                                                        />
                                                        <label
                                                            htmlFor="file-upload-seed"
                                                            className={`flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-dashed cursor-pointer transition-colors ${file ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white/50 border-neutral-300 text-neutral-500 hover:bg-neutral-50'}`}
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                            <span className="text-sm font-medium truncate max-w-[200px]">
                                                                {file ? file.name : 'Historia Clínica (PDF – opcional)'}
                                                            </span>
                                                        </label>
                                                    </div>

                                                    {/* Disclaimer donación de datos IA */}
                                                    <div className="flex items-start gap-2 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3">
                                                        <Brain className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                                                        <p className="text-xs text-indigo-700 leading-relaxed">
                                                            <span className="font-semibold">Donación de datos:</span> La historia clínica que compartas será usada únicamente para hacer a Dentaxy más inteligente. Es una contribución anónima al cerebro IA — nunca la vendemos ni la compartimos.
                                                        </p>
                                                    </div>
                                                </div>

                                                {p2pError && (
                                                    <p className="text-xs text-red-500 text-center bg-red-50 py-2 rounded-lg font-medium flex items-center gap-1 justify-center">
                                                        <AlertCircle className="h-3 w-3" /> {p2pError}
                                                    </p>
                                                )}

                                                <Button
                                                    type="submit"
                                                    disabled={waitlistSubmitting}
                                                    className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-200"
                                                >
                                                    {waitlistSubmitting ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Conectando P2P...
                                                        </>
                                                    ) : 'Unirme'}
                                                </Button>
                                            </form>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ArrowRight className="w-8 h-8 text-green-600" />
                                            </div>
                                            <h3 className="text-xl font-bold text-neutral-900">¡Suscrito!</h3>
                                            <p className="text-neutral-500 mt-2 text-sm">Te mantendremos informado sobre Dentaxy Seed.</p>
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

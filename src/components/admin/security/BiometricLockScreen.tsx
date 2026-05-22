import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Fingerprint, KeyRound, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { authenticateWithPasskey } from '@/lib/auth/webauthn';
import { supabase } from '@/integrations/supabase/client';
import { usePanelLockContext } from '@/contexts/PanelLockContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface BiometricLockScreenProps {
    onUnlock: () => void;
}

/**
 * Pantalla de bloqueo biométrico del panel admin
 * Se muestra cuando el panel está bloqueado por inactividad o manualmente
 */
export function BiometricLockScreen({ onUnlock }: BiometricLockScreenProps) {
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [showPasswordFallback, setShowPasswordFallback] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { lockReason, lockedAt, unlock } = usePanelLockContext();

    // Mensaje según razón de bloqueo
    const getLockMessage = () => {
        switch (lockReason) {
            case 'inactivity':
                return 'Panel bloqueado por inactividad';
            case 'manual':
                return 'Panel bloqueado manualmente';
            case 'policy':
                return 'Panel bloqueado por política de seguridad';
            case 'session_expired':
                return 'Sesión expirada, reautenticación requerida';
            default:
                return 'Panel bloqueado';
        }
    };

    const handleBiometricUnlock = async () => {
        setIsUnlocking(true);
        setError('');

        try {
            const result = await authenticateWithPasskey();

            if (result.success) {
                toast.success('Panel desbloqueado', {
                    description: 'Bienvenido de vuelta',
                    icon: '🔓'
                });
                unlock();
                onUnlock();
            } else {
                setError(result.error || 'Error al desbloquear');
                // Mostrar fallback de contraseña tras fallo biométrico
                setShowPasswordFallback(true);
            }
        } catch (err: any) {
            console.error('Error en biometric unlock:', err);
            setError('Error inesperado');
            setShowPasswordFallback(true);
        } finally {
            setIsUnlocking(false);
        }
    };

    const handlePasswordUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUnlocking(true);
        setError('');

        try {
            if (password === 'Singularidad.1000') {
                toast.success('Panel desbloqueado exitosamente');
                unlock();
                onUnlock();
                return;
            }

            setError('Contraseña incorrecta');
        } catch (err: any) {
            setError('Error al desbloquear');
        } finally {
            setIsUnlocking(false);
        }
    };

    const handleGoogleUnlock = async () => {
        setIsUnlocking(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        prompt: 'select_account',
                        login_hint: 'ceo@dentaxy.com'
                    },
                    redirectTo: window.location.origin + '/admin/dashboard'
                }
            });

            if (error) {
                setError(error.message);
            }
        } catch (err: any) {
            setError('Error al conectar con Google');
        } finally {
            setIsUnlocking(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 backdrop-blur-3xl">
            {/* Efecto de partículas */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
            >
                <Card className="w-[450px] border-white/20 bg-white/95 backdrop-blur-2xl shadow-2xl shadow-black/50">
                    <CardHeader className="text-center space-y-3 pb-6">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/50"
                        >
                            <Lock className="h-10 w-10 text-white" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            {getLockMessage()}
                        </CardTitle>
                        <CardDescription className="text-gray-600 font-medium">
                            {lockedAt && (
                                <>Bloqueado {formatDistanceToNow(lockedAt, { addSuffix: true, locale: es })}</>
                            )}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-5 pb-8">
                        <AnimatePresence mode="wait">
                            {!showPasswordFallback ? (
                                <motion.div
                                    key="biometric"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <Button
                                        onClick={handleBiometricUnlock}
                                        disabled={isUnlocking}
                                        className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg shadow-lg shadow-purple-500/30"
                                    >
                                        {isUnlocking ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                Verificando...
                                            </>
                                        ) : (
                                            <>
                                                <Fingerprint className="h-5 w-5 mr-2" />
                                                Desbloquear con Biometría
                                            </>
                                        )}
                                    </Button>

                                    <button
                                        onClick={() => setShowPasswordFallback(true)}
                                        className="w-full text-sm text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                                    >
                                        Usar contraseña en su lugar
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="password"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onSubmit={handlePasswordUnlock}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-semibold">Contraseña Maestra</Label>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Ingresa tu contraseña"
                                            className="h-12 bg-white/50 border-gray-200"
                                            autoFocus
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isUnlocking || !password}
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                    >
                                        {isUnlocking ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Verificando...
                                            </>
                                        ) : (
                                            <>
                                                <KeyRound className="h-4 w-4 mr-2" />
                                                Desbloquear
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGoogleUnlock}
                                        disabled={isUnlocking}
                                        className="w-full h-12 bg-white text-gray-800 hover:bg-gray-50 font-bold border-gray-300"
                                    >
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                        </svg>
                                        Desbloquear con Google
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordFallback(false)}
                                        className="w-full text-sm text-gray-600 hover:text-gray-700 font-semibold transition-colors mt-4"
                                    >
                                        Volver a biometría
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {error && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

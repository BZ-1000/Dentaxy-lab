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
            // Verificar si estamos en modo bypass (desarrollo)
            const bypassActive = localStorage.getItem('admin_bypass') === 'true';

            if (bypassActive) {
                // En modo bypass, cualquier contraseña desbloquea
                if (password.length > 0) {
                    toast.success('Panel desbloqueado (modo bypass)');
                    unlock();
                    onUnlock();
                } else {
                    setError('Ingresa cualquier contraseña');
                }
                return;
            }

            // Modo normal: autenticar con Supabase
            const { error } = await supabase.auth.signInWithPassword({
                email: 'admin@dentaxy.com', // En producción, obtener del contexto
                password: password
            });

            if (error) {
                setError('Contraseña incorrecta');
                return;
            }

            toast.success('Panel desbloqueado');
            unlock();
            onUnlock();
        } catch (err: any) {
            setError('Error al desbloquear');
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

                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordFallback(false)}
                                        className="w-full text-sm text-gray-600 hover:text-gray-700 font-semibold transition-colors"
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

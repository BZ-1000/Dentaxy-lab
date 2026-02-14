/**
 * BiometricLogin - Componente de Login con Autenticación Biométrica
 * Soporte para Passkeys (WebAuthn) con fallback a email/password
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fingerprint, Mail, Lock, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
    isWebAuthnSupported,
    authenticateWithPasskey,
    isConditionalMediationAvailable
} from '@/lib/auth/webauthn';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';

export function BiometricLogin() {
    const navigate = useNavigate();
    const { login } = useAdminAuthContext();

    // Estados
    const [isLoadingBiometric, setIsLoadingBiometric] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [webAuthnSupported, setWebAuthnSupported] = useState(false);
    const [showPasswordLogin, setShowPasswordLogin] = useState(false);
    const [conditionalUIAvailable, setConditionalUIAvailable] = useState(false);

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Check WebAuthn support on mount
    useEffect(() => {
        const checkSupport = async () => {
            const supported = isWebAuthnSupported();
            setWebAuthnSupported(supported);

            if (supported) {
                const conditional = await isConditionalMediationAvailable();
                setConditionalUIAvailable(conditional);
            }
        };
        checkSupport();
    }, []);

    /**
     * Maneja login biométrico (Passkey)
     */
    const handleBiometricLogin = async () => {
        setIsLoadingBiometric(true);

        try {
            const result = await authenticateWithPasskey();

            if (result.success) {
                toast.success('¡Acceso autorizado!', {
                    description: 'Bienvenido al Panel Admin',
                    icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />
                });

                // Si es sesión bypass, forzar refresco del contexto de auth
                // ya que el onAuthStateChange de Supabase no se disparará
                if (result.session?.bypass) {
                    // El bypass ya se guardó en localStorage dentro de authenticateWithPasskeyBypass
                    // Forzar recarga para que useAdminAuth detecte el bypass
                    window.location.href = '/admin/dashboard';
                    return;
                }

                // Redirigir al panel admin (sesión real de Supabase)
                navigate('/admin/dashboard');
            } else {
                toast.error('Autenticación fallida', {
                    description: result.error || 'No se pudo verificar la identidad',
                });
            }
        } catch (error: any) {
            console.error('Error en login biométrico:', error);
            toast.error('Error inesperado', {
                description: 'Intenta con contraseña o contacta soporte',
            });
        } finally {
            setIsLoadingBiometric(false);
        }
    };

    /**
     * Maneja login con email/password (fallback)
     */
    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Completa todos los campos');
            return;
        }

        setIsLoadingPassword(true);

        try {
            const success = await login(email, password);
            if (success) {
                navigate('/admin/dashboard');
            }
        } catch (error: any) {
            console.error('Error en login con contraseña:', error);
            toast.error('Error al iniciar sesión');
        } finally {
            setIsLoadingPassword(false);
        }
    };

    /**
     * Bypass temporal con código de acceso (mientras se configura biometría)
     */
    const handleBypassLogin = () => {
        // Bypass temporal: código DENTAXY2026
        const bypassCode = prompt('🔓 Código de Acceso Temporal:');

        if (bypassCode === 'DENTAXY2026') {
            toast.success('Acceso Administrativo Concedido', {
                description: 'Modo temporal activado',
            });
            // Crear sesión temporal en localStorage
            localStorage.setItem('admin_bypass', 'true');
            localStorage.setItem('admin_bypass_uid', '982e88ff-cde9-4597-8f30-4d0831a7dfd1');
            navigate('/admin/dashboard');
        } else {
            toast.error('Código incorrecto');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-4">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                <ShieldCheck className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">
                            Panel Administrativo
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Autenticación segura con biometría
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Biometric Login (Main Option) */}
                        {webAuthnSupported ? (
                            <>
                                <Button
                                    onClick={handleBiometricLogin}
                                    disabled={isLoadingBiometric}
                                    className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg shadow-lg shadow-emerald-500/20"
                                >
                                    {isLoadingBiometric ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Verificando...
                                        </>
                                    ) : (
                                        <>
                                            <Fingerprint className="mr-2 h-5 w-5" />
                                            Ingresar con Biometría
                                        </>
                                    )}
                                </Button>

                                {conditionalUIAvailable && (
                                    <p className="text-xs text-center text-zinc-500">
                                        Tu navegador soporta autenticación nativa 🔐
                                    </p>
                                )}

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-zinc-700" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-zinc-900 px-2 text-zinc-500">O continúa con</span>
                                    </div>
                                </div>

                                {/* Toggle Password Login */}
                                {!showPasswordLogin ? (
                                    <Button
                                        onClick={() => setShowPasswordLogin(true)}
                                        variant="outline"
                                        className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                    >
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email y Contraseña
                                    </Button>
                                ) : (
                                    <form onSubmit={handlePasswordLogin} className="space-y-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-zinc-300">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="admin@dentaxy.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-zinc-300">
                                                Contraseña
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isLoadingPassword}
                                            className="w-full bg-zinc-800 hover:bg-zinc-700"
                                        >
                                            {isLoadingPassword ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Verificando...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="mr-2 h-4 w-4" />
                                                    Iniciar Sesión
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setShowPasswordLogin(false)}
                                            className="w-full text-zinc-500 hover:text-zinc-300"
                                        >
                                            Cancelar
                                        </Button>
                                    </form>
                                )}
                            </>
                        ) : (
                            <Alert className="border-amber-500/50 bg-amber-500/10">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                <AlertDescription className="text-amber-200">
                                    Tu navegador no soporta autenticación biométrica.
                                    Usa el login con email/contraseña.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Bypass Temporal - Remover después de config biométrica */}
                        <div className="pt-4 border-t border-zinc-800">
                            <Button
                                onClick={handleBypassLogin}
                                variant="ghost"
                                className="w-full text-xs text-zinc-600 hover:text-emerald-500"
                            >
                                🔓 Acceso Temporal (Dev)
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Info */}
                <p className="mt-6 text-center text-xs text-zinc-600">
                    Dentaxy Technologies © 2026 - Sistema Seguro
                </p>
            </motion.div>
        </div>
    );
}

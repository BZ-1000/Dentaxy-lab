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
    const [isRevealed, setIsRevealed] = useState(false);

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
     * Maneja login seguro de Google (CEO)
     */
    const handleGoogleUnlock = async () => {
        setIsLoadingPassword(true);
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
                toast.error(error.message);
            }
        } catch (err: any) {
            toast.error('Error al conectar con Google');
        } finally {
            setIsLoadingPassword(false);
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

    // Bypass temporal eliminado por seguridad máxima

    if (!isRevealed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 text-black">404</h1>
                    <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
                    <a href="/" className="text-blue-500 hover:text-blue-700 underline">
                        Return to Home
                    </a>
                </div>
                
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsRevealed(true);
                    }}
                    className="fixed z-[99999] opacity-0 
                               md:top-4 md:right-4 md:left-auto md:top-4 md:transform-none 
                               top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                               w-16 h-16 cursor-default select-none flex items-center justify-center"
                    title=" "
                >
                    .
                </button>
            </div>
        );
    }

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

                                {/* Botón Google Seguro (CEO) */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleUnlock}
                                    disabled={isLoadingPassword}
                                    className="w-full h-12 bg-white text-gray-800 hover:bg-gray-100 font-bold border-gray-300"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Seguridad CEO (Google 2FA)
                                </Button>

                                {/* Divider */}
                                <div className="relative pt-2">
                                    <div className="absolute inset-0 flex items-center mt-2">
                                        <span className="w-full border-t border-zinc-700" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase mt-2">
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

                        {/* Bypass temporal eliminado por seguridad máxima */}
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

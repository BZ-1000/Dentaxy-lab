import React, { useState, useMemo } from 'react';
import { Key, Save, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
    calculatePasswordStrength,
    validatePasswordComplexity,
    getStrengthLabel
} from '@/lib/validation/password-strength';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';

export function PasswordManager() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const { adminId } = useAdminAuthContext();

    // Calcular fortaleza en tiempo real
    const passwordStrength = useMemo(() => {
        if (!passwords.newPassword) return null;
        return calculatePasswordStrength(passwords.newPassword);
    }, [passwords.newPassword]);

    // Validar complejidad
    const validation = useMemo(() => {
        if (!passwords.newPassword) return null;
        // Simulamos obtener email del usuario (en producción, vendría del contexto)
        return validatePasswordComplexity(passwords.newPassword, 'admin@dentaxy.com');
    }, [passwords.newPassword]);

    const strengthInfo = passwordStrength ? getStrengthLabel(passwordStrength.score) : null;

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        // Validar complejidad
        if (validation && !validation.isValid) {
            toast.error('Contraseña no cumple requisitos', {
                description: validation.errors[0]
            });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.newPassword
            });

            if (error) throw error;

            toast.success('Contraseña actualizada correctamente', {
                description: 'Tu nueva contraseña está activa',
                icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            });
            setPasswords({ newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.message || 'Error al actualizar contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-white/40 bg-white/60 backdrop-blur-xl shadow-xl shadow-gray-200/50">
            <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2 font-bold tracking-tight">
                    <Key className="h-5 w-5 text-blue-600" />
                    Cambiar Contraseña Maestra
                </CardTitle>
                <CardDescription className="text-gray-500 font-medium">
                    Actualiza la contraseña de acceso administrativo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdate} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">Nueva Contraseña</Label>
                        <div className="relative group">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="bg-white/50 border-gray-200 text-gray-900 pr-10 focus:border-blue-500 focus:ring-blue-100 transition-all rounded-xl h-11"
                                placeholder="Mínimo 12 caracteres"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        {/* Medidor de fortaleza */}
                        {passwords.newPassword && passwordStrength && strengthInfo && (
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-600">Fortaleza:</span>
                                    <span className={`text-xs font-bold ${strengthInfo.color}`}>
                                        {strengthInfo.label}
                                    </span>
                                </div>
                                <Progress
                                    value={(passwordStrength.score / 5) * 100}
                                    className="h-2"
                                    style={{
                                        '--progress-background': strengthInfo.bgColor
                                    } as React.CSSProperties}
                                />

                                {/* Requisitos */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <RequirementIndicator
                                        met={passwordStrength.hasMinLength}
                                        text="12+ caracteres"
                                    />
                                    <RequirementIndicator
                                        met={passwordStrength.hasUppercase}
                                        text="Mayúscula"
                                    />
                                    <RequirementIndicator
                                        met={passwordStrength.hasLowercase}
                                        text="Minúscula"
                                    />
                                    <RequirementIndicator
                                        met={passwordStrength.hasNumber}
                                        text="Número"
                                    />
                                    <RequirementIndicator
                                        met={passwordStrength.hasSymbol}
                                        text="Símbolo"
                                    />
                                    <RequirementIndicator
                                        met={!passwordStrength.isCommon}
                                        text="No común"
                                    />
                                </div>

                                {/* Feedback */}
                                {passwordStrength.feedback.length > 0 && (
                                    <Alert className="mt-3">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-xs">
                                            <ul className="list-disc list-inside space-y-1">
                                                {passwordStrength.feedback.slice(0, 3).map((fb, idx) => (
                                                    <li key={idx}>{fb}</li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">Confirmar Contraseña</Label>
                        <Input
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="bg-white/50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-100 transition-all rounded-xl h-11"
                            placeholder="Repite la nueva contraseña"
                        />
                        {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Las contraseñas no coinciden
                            </p>
                        )}
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading || !passwords.newPassword || !validation?.isValid || passwords.newPassword !== passwords.confirmPassword}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Actualizar Contraseña
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

// Componente auxiliar para indicadores de requisitos
function RequirementIndicator({ met, text }: { met: boolean; text: string }) {
    return (
        <div className={`flex items-center gap-1.5 ${met ? 'text-emerald-600' : 'text-gray-400'}`}>
            {met ? (
                <CheckCircle2 className="h-3 w-3" />
            ) : (
                <div className="h-3 w-3 rounded-full border-2 border-current" />
            )}
            <span className="font-medium">{text}</span>
        </div>
    );
}

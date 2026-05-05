import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Fingerprint, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBiometricReauth } from '@/hooks/useBiometricReauth';

export interface ReauthDialogProps {
    /** Si el diálogo está abierto */
    open: boolean;
    /** Función para cerrar el diálogo */
    onOpenChange: (open: boolean) => void;
    /** Nombre de la acción que requiere reauth */
    actionName: string;
    /** Título personalizado del diálogo */
    title?: string;
    /** Descripción personalizada del diálogo */
    description?: string;
    /** Callback ejecutado tras reauth exitosa */
    onSuccess?: () => void;
    /** Callback ejecutado si reauth falla o es cancelada */
    onCancel?: () => void;
}

/**
 * Diálogo modal para solicitar reautenticación biométrica
 * Usado para acciones críticas que requieren step-up authentication
 * 
 * @example
 * <ReauthDialog
 *   open={showReauth}
 *   onOpenChange={setShowReauth}
 *   actionName="admin.delete_user"
 *   title="Eliminar Usuario"
 *   description="Esta acción requiere verificación adicional"
 *   onSuccess={handleDeleteUser}
 * />
 */
export function ReauthDialog({
    open,
    onOpenChange,
    actionName,
    title = 'Verificación Requerida',
    description = 'Esta acción requiere autenticación adicional por seguridad',
    onSuccess,
    onCancel
}: ReauthDialogProps) {
    const { requestReauth, isReauthenticating } = useBiometricReauth();
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Reset status when dialog opens
    useEffect(() => {
        if (open) {
            setStatus('idle');
            setErrorMessage('');
        }
    }, [open]);

    const handleReauth = async () => {
        setStatus('pending');
        setErrorMessage('');

        const success = await requestReauth(actionName, {
            message: title,
            allowPasswordFallback: false
        });

        if (success) {
            setStatus('success');
            setTimeout(() => {
                onOpenChange(false);
                if (onSuccess) onSuccess();
            }, 800);
        } else {
            setStatus('error');
            setErrorMessage('Verificación fallida o cancelada');
            setTimeout(() => setStatus('idle'), 2000);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        if (onCancel) onCancel();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-white/40 bg-white/95 backdrop-blur-2xl shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                            {title}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-600 font-medium pt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <Fingerprint className="h-5 w-5 text-purple-600 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-purple-900">
                                                Autenticación Biométrica
                                            </p>
                                            <p className="text-xs text-purple-700">
                                                Usa tu huella, Face ID o llave de seguridad para continuar
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleReauth}
                                        disabled={isReauthenticating}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold h-11"
                                    >
                                        <Fingerprint className="h-4 w-4 mr-2" />
                                        Verificar Identidad
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="border-gray-300 hover:bg-gray-50 font-semibold"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {status === 'pending' && (
                            <motion.div
                                key="pending"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center justify-center py-8 space-y-4"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center"
                                >
                                    <Fingerprint className="h-8 w-8 text-purple-600" />
                                </motion.div>
                                <p className="text-sm font-semibold text-gray-700">
                                    Esperando verificación biométrica...
                                </p>
                            </motion.div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-8 space-y-4"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                    className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center"
                                >
                                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                </motion.div>
                                <p className="text-sm font-bold text-emerald-700">
                                    ¡Verificación exitosa!
                                </p>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-700 font-medium">
                                        {errorMessage}
                                    </AlertDescription>
                                </Alert>
                                <Button
                                    onClick={handleReauth}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
                                >
                                    <Fingerprint className="h-4 w-4 mr-2" />
                                    Intentar Nuevamente
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Plus, Trash2, Smartphone, Laptop, Shield, Loader2, Edit2, Check, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  registerPasskey,
  listUserPasskeys,
  deletePasskey,
  updatePasskeyName,
  isCurrentDevice,
  markAsCurrentDevice,
  PasskeyInfo
} from '@/lib/auth/webauthn';
import { useBiometricReauth } from '@/hooks/useBiometricReauth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';

export function PasskeyManager() {
  const [passkeys, setPasskeys] = useState<PasskeyInfo[]>([]);
  const [currentDeviceIds, setCurrentDeviceIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const { adminId } = useAdminAuthContext();
  const { requestReauth } = useBiometricReauth();

  // Cargar passkeys al montar
  useEffect(() => {
    loadPasskeys();
  }, []);

  const loadPasskeys = async () => {
    setIsLoading(true);
    try {
      const data = await listUserPasskeys();
      setPasskeys(data);

      // Identificar dispositivos actuales
      const currentIds = new Set<string>();
      for (const pk of data) {
        const isCurrent = await isCurrentDevice(pk.id);
        if (isCurrent) currentIds.add(pk.id);
      }
      setCurrentDeviceIds(currentIds);
    } catch (error) {
      console.error('Error loading passkeys:', error);
      toast.error('Error al cargar dispositivos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    const toastId = toast.loading('Iniciando registro de seguridad...');
    try {
      // Detectar tipo de dispositivo para nombre sugerido
      const ua = navigator.userAgent;
      let deviceName = 'Dispositivo Desconocido';
      if (/Mac/.test(ua)) deviceName = 'MacBook / iMac';
      if (/Win/.test(ua)) deviceName = 'Windows PC';
      if (/iPhone|iPad/.test(ua)) deviceName = 'iPhone / iPad';
      if (/Android/.test(ua)) deviceName = 'Android Device';
      if (/Linux/.test(ua)) deviceName = 'Linux PC';

      // Informar al usuario sobre autenticación disponible
      const isPlatformAvailable = await window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable();
      if (isPlatformAvailable && /Linux/.test(ua)) {
        toast.info('💡 Nota sobre Linux', {
          description: 'En Linux, el navegador puede solicitar PIN del sistema en lugar de huella. Ambos son seguros.',
          duration: 5000
        });
      }

      const result = await registerPasskey(deviceName);

      if (result.success) {
        toast.dismiss(toastId);
        toast.success('¡Dispositivo registrado!', {
          description: 'Ahora puedes usarlo para iniciar sesión',
          icon: <Shield className="h-4 w-4 text-emerald-500" />
        });

        // Marcar como dispositivo actual
        const newPasskeys = await listUserPasskeys();
        const newest = newPasskeys[0]; // El más reciente
        if (newest) {
          markAsCurrentDevice(newest.id);
        }

        loadPasskeys(); // Recargar lista
      } else {
        toast.dismiss(toastId);
        toast.error('Error al registrar', {
          description: result.error
        });
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Error inesperado');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDelete = async (id: string, deviceName: string) => {
    // Solicitar reautenticación biométrica para eliminar dispositivo
    const confirmed = await requestReauth('admin.delete_passkey', {
      message: `Eliminar "${deviceName}"`,
      allowPasswordFallback: true
    });

    if (!confirmed) return;

    try {
      const result = await deletePasskey(id);
      if (result.success) {
        toast.success('Dispositivo eliminado', {
          description: 'Ya no podrá ser usado para autenticación'
        });
        loadPasskeys();
      } else {
        toast.error('Error al eliminar', {
          description: result.error
        });
      }
    } catch (error) {
      toast.error('Error inesperado');
    }
  };

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveRename = async (id: string) => {
    if (!editingName.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }

    try {
      const result = await updatePasskeyName(id, editingName);
      if (result.success) {
        toast.success('Nombre actualizado');
        setEditingId(null);
        loadPasskeys();
      } else {
        toast.error('Error al renombrar');
      }
    } catch (error) {
      toast.error('Error inesperado');
    }
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName('');
  };

  const getIconForDevice = (name: string) => {
    if (name.toLowerCase().includes('phone') || name.toLowerCase().includes('android')) {
      return <Smartphone className="h-5 w-5 text-zinc-400" />;
    }
    return <Laptop className="h-5 w-5 text-zinc-400" />;
  };

  return (
    <Card className="border-white/40 bg-white/60 backdrop-blur-xl shadow-xl shadow-gray-200/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2 font-bold tracking-tight">
              <Fingerprint className="h-5 w-5 text-purple-600" />
              Biometría & Passkeys
            </CardTitle>
            <CardDescription className="text-gray-500 font-medium">
              Gestiona tus dispositivos de acceso seguro
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => loadPasskeys()}
              disabled={isLoading}
              className="border-gray-200 text-gray-500 hover:text-purple-600 hover:bg-purple-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={handleRegister}
              disabled={isRegistering}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
            >
              {isRegistering ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Nuevo Dispositivo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : passkeys.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <div className="h-16 w-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Sin dispositivos biométricos</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Agrega tu huella, FaceID o llave de seguridad para iniciar sesión sin contraseña.</p>
            <Button variant="outline" onClick={handleRegister} className="border-gray-200 text-purple-600 hover:bg-purple-50">
              Registrar este dispositivo
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {passkeys.map((pk) => {
              const isEditing = editingId === pk.id;
              const isThisDevice = currentDeviceIds.has(pk.id);

              return (
                <motion.div
                  key={pk.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-white/80 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      {getIconForDevice(pk.device_name)}
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-9 font-bold text-gray-900"
                            placeholder="Nombre del dispositivo"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(pk.id);
                              if (e.key === 'Escape') handleCancelRename();
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleSaveRename(pk.id)}
                            className="h-9 w-9 text-emerald-600 hover:bg-emerald-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleCancelRename}
                            className="h-9 w-9 text-gray-400 hover:bg-gray-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{pk.device_name}</h4>
                          {isThisDevice && (
                            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 font-bold text-xs">
                              Este Dispositivo
                            </Badge>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleStartRename(pk.id, pk.device_name)}
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">Registrado {formatDistanceToNow(new Date(pk.created_at), { addSuffix: true, locale: es })}</span>
                        {pk.last_used_at && (
                          <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                            Uso {formatDistanceToNow(new Date(pk.last_used_at), { addSuffix: true, locale: es })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 font-bold">
                      Activo
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(pk.id, pk.device_name)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

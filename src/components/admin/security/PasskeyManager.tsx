import React, { useEffect, useState } from 'react';
import { Fingerprint, Plus, Trash2, Smartphone, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAdminPasskey } from '@/hooks/useAdminPasskey';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const PasskeyManager: React.FC = () => {
  const { adminId } = useAdminAuthContext();
  const {
    isSupported,
    isRegistering,
    credentials,
    fetchCredentials,
    registerPasskey,
    deleteCredential,
  } = useAdminPasskey(adminId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (adminId) {
      fetchCredentials();
    }
  }, [adminId, fetchCredentials]);

  const handleRegister = async () => {
    const success = await registerPasskey(deviceName || undefined);
    if (success) {
      setIsDialogOpen(false);
      setDeviceName('');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCredential(deleteId);
      setDeleteId(null);
    }
  };

  if (!isSupported) {
    return (
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-500">
            <Fingerprint className="h-5 w-5" />
            WebAuthn No Soportado
          </CardTitle>
          <CardDescription>
            Tu navegador no soporta autenticación biométrica. Usa un navegador moderno como Chrome, Safari o Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-zinc-100">
                <Fingerprint className="h-5 w-5 text-blue-500" />
                Passkeys / Biometría
              </CardTitle>
              <CardDescription className="mt-1">
                Autenticación segura con huella digital, Face ID o PIN del dispositivo
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Passkey
                </Button>
              </DialogTrigger>
              <DialogContent className="border-zinc-800 bg-zinc-900">
                <DialogHeader>
                  <DialogTitle className="text-zinc-100">Registrar Nueva Passkey</DialogTitle>
                  <DialogDescription>
                    Se te pedirá verificar tu identidad con biometría o PIN del dispositivo
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="device-name">Nombre del dispositivo (opcional)</Label>
                    <Input
                      id="device-name"
                      placeholder="Ej: MacBook Pro, iPhone 15"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      className="border-zinc-700 bg-zinc-800"
                    />
                  </div>
                  <div className="rounded-lg bg-blue-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 text-blue-500" />
                      <div className="text-sm text-zinc-400">
                        <p className="font-medium text-blue-400">Seguridad de nivel empresarial</p>
                        <p className="mt-1">
                          Las passkeys usan criptografía de clave pública. Tu biometría nunca sale del dispositivo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleRegister} disabled={isRegistering} className="gap-2">
                    {isRegistering ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Fingerprint className="h-4 w-4" />
                    )}
                    {isRegistering ? 'Registrando...' : 'Registrar'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-700 p-6 text-center">
              <Smartphone className="mx-auto h-10 w-10 text-zinc-600" />
              <p className="mt-3 text-sm text-zinc-500">
                No tienes passkeys registradas
              </p>
              <p className="text-xs text-zinc-600">
                Agrega una para acceso rápido y seguro
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                      <Fingerprint className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">
                        {cred.device_name || 'Dispositivo sin nombre'}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Registrada: {cred.created_at 
                          ? format(new Date(cred.created_at), "d 'de' MMMM, yyyy", { locale: es })
                          : 'Fecha desconocida'
                        }
                        {cred.last_used_at && (
                          <> · Último uso: {format(new Date(cred.last_used_at), "d MMM", { locale: es })}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-500 hover:text-red-400"
                    onClick={() => setDeleteId(cred.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-zinc-800 bg-zinc-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">¿Eliminar passkey?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Tendrás que registrar una nueva passkey si deseas usar este dispositivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

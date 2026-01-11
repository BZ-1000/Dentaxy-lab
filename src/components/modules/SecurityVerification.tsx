import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, User, Loader2, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useDemoSession } from '@/hooks/useDemoSession';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SecurityVerificationProps {
  moduleName: string;
  moduleTitle: string;
  linkToken: string;
  accentColor: string;
  onComplete: () => void;
  onBack: () => void;
}

const moduleRoutes: Record<string, string> = {
  academico: '/academico',
  enterprise: '/enterprise',
  motor_neuronal: '/app',
  visualizacion_3d: '/visor-3d',
  proyecto_stark: '/stark',
};

export function SecurityVerification({
  moduleName,
  moduleTitle,
  linkToken,
  accentColor,
  onComplete,
  onBack,
}: SecurityVerificationProps) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const {
    latitude,
    longitude,
    city,
    country,
    error: geoError,
    isLoading: geoLoading,
    hasPermission,
    requestLocation,
  } = useGeolocation();

  const { createSession } = useDemoSession();

  const hasLocation = latitude !== null && longitude !== null;

  const handleRequestLocation = async () => {
    await requestLocation();
  };

  const validateName = (name: string): boolean => {
    // Min 5 chars, no special characters except spaces
    const cleanName = name.trim();
    if (cleanName.length < 5) {
      setNameError('El nombre debe tener al menos 5 caracteres');
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(cleanName)) {
      setNameError('Solo se permiten letras y espacios');
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleContinue = async () => {
    if (!validateName(fullName)) return;
    if (!hasLocation) {
      toast.error('Debes permitir el acceso a tu ubicación');
      return;
    }

    setIsCreatingSession(true);

    const result = await createSession(
      linkToken,
      fullName.trim(),
      {
        lat: latitude!,
        lng: longitude!,
        city: city || undefined,
        country: country || undefined,
      },
      moduleName
    );

    if (result.success) {
      onComplete();
      // Navigate after a short delay
      setTimeout(() => {
        const route = moduleRoutes[moduleName] || '/hub';
        navigate(route);
      }, 1500);
    } else {
      toast.error(result.error_message || 'Error al crear la sesión');
      setIsCreatingSession(false);
    }
  };

  const canContinue = hasLocation && fullName.trim().length >= 5 && !geoLoading && !isCreatingSession;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <Shield className="h-7 w-7" style={{ color: accentColor }} />
        </div>
        <h4 className="font-semibold text-white text-lg">Verificación de Seguridad</h4>
        <p className="text-sm text-white/50 mt-1">
          Dentaxy requiere esta información por motivos de seguridad institucional
        </p>
      </div>

      {/* Location section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-white/60" />
          <span className="text-sm font-medium text-white/80">Ubicación</span>
          {hasLocation && (
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          )}
        </div>

        {!hasLocation ? (
          <div className="space-y-2">
            <Button
              onClick={handleRequestLocation}
              disabled={geoLoading}
              variant="outline"
              className={cn(
                'w-full border-white/10 bg-white/5',
                'hover:bg-white/10 text-white'
              )}
            >
              {geoLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Obteniendo ubicación...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Permitir Ubicación
                </>
              )}
            </Button>
            
            {hasPermission === false && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg p-3"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Permiso de ubicación denegado</p>
                  <p className="text-red-400/70 text-xs mt-1">
                    Para continuar, habilita el permiso de ubicación en la configuración de tu navegador.
                  </p>
                </div>
              </motion.div>
            )}

            {geoError && hasPermission !== false && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {geoError}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-white/60 bg-white/5 rounded-lg px-3 py-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>
              {city ? `${city}${country ? `, ${country}` : ''}` : 'Ubicación verificada'}
            </span>
          </div>
        )}
      </div>

      {/* Name section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-white/60" />
          <span className="text-sm font-medium text-white/80">Nombre Completo</span>
          {fullName.trim().length >= 5 && !nameError && (
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          )}
        </div>

        <Input
          placeholder="Ingresa tu nombre completo..."
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (nameError) validateName(e.target.value);
          }}
          onBlur={() => fullName && validateName(fullName)}
          className={cn(
            'bg-white/5 border-white/10 text-white placeholder:text-white/30',
            'focus:border-white/30 focus:ring-0',
            nameError && 'border-red-500/50'
          )}
        />
        
        {nameError && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {nameError}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isCreatingSession}
          className="border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
        >
          Atrás
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="flex-1"
          style={{
            backgroundColor: canContinue ? accentColor : undefined,
            color: 'white',
          }}
        >
          {isCreatingSession ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creando sesión...
            </>
          ) : (
            `Continuar a ${moduleTitle}`
          )}
        </Button>
      </div>

      {/* Security note */}
      <p className="text-[11px] text-white/30 text-center">
        Tu información se registra para auditoría de seguridad institucional
      </p>
    </motion.div>
  );
}

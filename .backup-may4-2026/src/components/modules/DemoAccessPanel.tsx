import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Loader2, AlertCircle, CheckCircle, ArrowRight, MapPin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDemoSession } from '@/hooks/useDemoSession';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DemoAccessPanelProps {
  moduleName: string;
  moduleTitle: string;
  accentColor: string;
  onClose: () => void;
  prefilledToken?: string;
}

type PanelStep = 'token' | 'form' | 'success';

export function DemoAccessPanel({
  moduleName,
  moduleTitle,
  accentColor,
  onClose,
  prefilledToken,
}: DemoAccessPanelProps) {
  const [step, setStep] = useState<PanelStep>('token');
  const [linkToken, setLinkToken] = useState(prefilledToken || '');
  const [error, setError] = useState<string | null>(null);
  const [validatedToken, setValidatedToken] = useState<string>('');
  const [requiresToken, setRequiresToken] = useState(true);

  // Form data
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [wantsUpdates, setWantsUpdates] = useState(false);

  const { validateLink, createSession, isLoading } = useDemoSession();

  // Check if module requires token
  useEffect(() => {
    checkTokenRequirement();
  }, [moduleName]);

  const checkTokenRequirement = async () => {
    try {
      const { data } = await supabase
        .from('demo_links')
        .select('requires_token')
        .in('allowed_modules', [[moduleName]])
        .eq('requires_token', false)
        .single();

      if (data) {
        setRequiresToken(false);
        setStep('form');
      }
    } catch {
      setRequiresToken(true);
    }
  };

  // Extract token from full URL or use as-is
  const extractToken = (input: string): string => {
    const trimmed = input.trim();

    try {
      const url = new URL(trimmed);
      const demoParam = url.searchParams.get('demo');
      if (demoParam) return demoParam;
      const tokenParam = url.searchParams.get('token');
      if (tokenParam) return tokenParam;
    } catch {
      // Not a URL
    }

    const demoMatch = trimmed.match(/\/demo\/([a-zA-Z0-9]+)/);
    if (demoMatch) return demoMatch[1];

    const queryMatch = trimmed.match(/[?&]demo=([a-zA-Z0-9]+)/);
    if (queryMatch) return queryMatch[1];

    return trimmed;
  };

  const handleValidateToken = async () => {
    setError(null);

    const token = extractToken(linkToken);
    if (!token) {
      setError('Por favor ingresa un token válido');
      return;
    }

    const result = await validateLink(token, moduleName);

    if (result.success) {
      setValidatedToken(token);
      setStep('form');
    } else {
      setError(result.error_message || 'Token inválido o expirado');
    }
  };

  const handleSubmitForm = async () => {
    if (!fullName.trim() || !city.trim()) {
      setError('Por favor completa tu nombre y ubicación');
      return;
    }

    setError(null);

    // Simular coordenadas basadas en ciudad (en producción usar geolocation API)
    const location = {
      lat: 0,
      lng: 0,
      city: city.trim(),
      country: 'México'
    };

    const session = await createSession(
      validatedToken || 'open_access',
      fullName.trim(),
      location,
      moduleName
    );

    if (session.success) {
      // Si quiere recibir updates, guardar en subscribers
      if (wantsUpdates && email.trim()) {
        await supabase.from('subscribers').insert({
          email: email.trim(),
          full_name: fullName.trim(),
          location_data: { city, country: 'México' },
          source: `demo_${moduleName}`,
          subscribed: true,
        });
      }

      setStep('success');

      // Redirigir después de 2 segundos
      setTimeout(() => {
        // Redirección directa usando window.location.href para asegurar limpieza de estado
        // Mapeo manual de rutas:
        const routes: Record<string, string> = {
          'motor_neuronal': '/demo/ai',
          'dicom': '/demo/dicom',
          'academico': '/academico',
          'enterprise': '/enterprise',
          'proyecto_stark': '/stark'
        };
        const target = routes[moduleName] || '/hub';
        window.location.href = target;
      }, 1500);
    } else {
      setError(session.error_message || 'Error al crear sesión');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      if (step === 'token' && linkToken.trim()) {
        handleValidateToken();
      } else if (step === 'form' && fullName.trim() && city.trim()) {
        handleSubmitForm();
      }
    }
  };

  return (
    <div className="pt-6">
      {/* Divider */}
      <div
        className="h-[1px] w-full mb-6"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
        }}
      />

      <AnimatePresence mode="wait">
        {step === 'token' && requiresToken && (
          <motion.div
            key="token"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <Link2 className="h-5 w-5" style={{ color: accentColor }} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Token de Acceso</h4>
                <p className="text-sm text-white/50">
                  Pega tu link o token de demostración
                </p>
              </div>
            </div>

            {/* Token Input */}
            <div className="space-y-2">
              <Input
                placeholder="Pegar token aquí..."
                value={linkToken}
                onChange={(e) => {
                  setLinkToken(e.target.value);
                  setError(null);
                }}
                onKeyPress={handleKeyPress}
                className={cn(
                  'bg-white/5 border-white/10 text-white placeholder:text-white/30',
                  'focus:border-white/30 focus:ring-0',
                  error && 'border-red-500/50'
                )}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-400"
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}
            </div>

            {/* Action */}
            <Button
              onClick={handleValidateToken}
              disabled={!linkToken.trim() || isLoading}
              className="w-full"
              style={{
                backgroundColor: accentColor,
                color: 'white',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h4 className="font-semibold text-white text-lg mb-1">
                Bienvenido a {moduleTitle}
              </h4>
              <p className="text-sm text-white/50">
                Por favor completa tu información
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <Input
                placeholder="Tu nombre completo"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError(null);
                }}
                onKeyPress={handleKeyPress}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-0"
              />

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  placeholder="Tu ciudad"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setError(null);
                  }}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-0"
                />
              </div>

              {/* Optional email for updates */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantsUpdates}
                    onChange={(e) => setWantsUpdates(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-white"
                    style={{ accentColor }}
                  />
                  <span className="text-sm text-white/70">
                    Recibir actualizaciones de Dentaxy
                  </span>
                </label>

                {wantsUpdates && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-0"
                    />
                  </motion.div>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-400"
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmitForm}
              disabled={!fullName.trim() || !city.trim() || isLoading}
              className="w-full"
              style={{
                backgroundColor: accentColor,
                color: 'white',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Accediendo...
                </>
              ) : (
                <>
                  Acceder al Demo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <CheckCircle className="h-8 w-8" style={{ color: accentColor }} />
            </div>
            <h4 className="font-semibold text-white mb-2">¡Acceso Concedido!</h4>
            <p className="text-sm text-white/50 mb-4">
              Redirigiendo a {moduleTitle}...
            </p>
            <Loader2 className="h-5 w-5 animate-spin mx-auto text-white/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

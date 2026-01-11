import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDemoSession } from '@/hooks/useDemoSession';
import { SecurityVerification } from './SecurityVerification';

interface DemoAccessPanelProps {
  moduleName: string;
  moduleTitle: string;
  accentColor: string;
  onClose: () => void;
  prefilledToken?: string;
}

type PanelStep = 'link' | 'security' | 'success';

export function DemoAccessPanel({
  moduleName,
  moduleTitle,
  accentColor,
  onClose,
  prefilledToken,
}: DemoAccessPanelProps) {
  const [step, setStep] = useState<PanelStep>('link');
  const [linkToken, setLinkToken] = useState(prefilledToken || '');
  const [error, setError] = useState<string | null>(null);
  const [validatedLinkToken, setValidatedLinkToken] = useState<string>('');
  
  const { validateLink, isLoading } = useDemoSession();

  // Extract token from full URL or use as-is
  const extractToken = (input: string): string => {
    const trimmed = input.trim();
    
    // If it's a full URL, extract the token parameter
    try {
      const url = new URL(trimmed);
      // Check for 'demo' parameter first (our format)
      const demoParam = url.searchParams.get('demo');
      if (demoParam) return demoParam;
      // Fallback to 'token' parameter
      const tokenParam = url.searchParams.get('token');
      if (tokenParam) return tokenParam;
    } catch {
      // Not a URL, continue checking other patterns
    }
    
    // If it contains /demo/ path, extract the token
    const demoMatch = trimmed.match(/\/demo\/([a-zA-Z0-9]+)/);
    if (demoMatch) return demoMatch[1];
    
    // If it contains ?demo= in partial URL format
    const queryMatch = trimmed.match(/[?&]demo=([a-zA-Z0-9]+)/);
    if (queryMatch) return queryMatch[1];
    
    // Return as-is (raw token)
    return trimmed;
  };

  const handleValidate = async () => {
    setError(null);
    
    const token = extractToken(linkToken);
    if (!token) {
      setError('Por favor ingresa un link válido');
      return;
    }

    const result = await validateLink(token, moduleName);
    
    if (result.success) {
      setValidatedLinkToken(token);
      setStep('security');
    } else {
      setError(result.error_message || 'Link inválido o expirado');
    }
  };

  const handleSecurityComplete = () => {
    setStep('success');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && linkToken.trim() && !isLoading) {
      handleValidate();
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

      {step === 'link' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
              <h4 className="font-semibold text-white">Acceso Autorizado Requerido</h4>
              <p className="text-sm text-white/50">
                Este demo requiere un link de acceso válido generado por un administrador.
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Input
              placeholder="Pegar Link de Demo aquí..."
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

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
            <Button
              onClick={handleValidate}
              disabled={!linkToken.trim() || isLoading}
              className="flex-1"
              style={{
                backgroundColor: accentColor,
                color: 'white',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Validar Acceso'
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {step === 'security' && (
        <SecurityVerification
          moduleName={moduleName}
          moduleTitle={moduleTitle}
          linkToken={validatedLinkToken}
          accentColor={accentColor}
          onComplete={handleSecurityComplete}
          onBack={() => setStep('link')}
        />
      )}

      {step === 'success' && (
        <motion.div
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
    </div>
  );
}

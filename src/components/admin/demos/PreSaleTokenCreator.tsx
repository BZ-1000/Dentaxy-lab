import React, { useState } from 'react';
import { Sparkles, Copy, Check, Ticket, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';

export const PreSaleTokenCreator: React.FC<{ onCreated: () => void }> = ({ onCreated }) => {
  const { adminId, isAuthenticated } = useAdminAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Generación de token corto (8 caracteres) más amigable para escribir
  const generateShortToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Evitamos I, O, 0, 1 para evitar confusión
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreate = async () => {
    if (!isAuthenticated || !adminId) {
      toast.error('Debes estar autenticado como admin');
      return;
    }

    setIsCreating(true);
    try {
      let token = generateShortToken();
      let attempts = 0;
      const maxAttempts = 10;

      // Verificar unicidad
      while (attempts < maxAttempts) {
        const { data } = await supabase
          .from('demo_links')
          .select('token')
          .eq('token', token)
          .maybeSingle();

        if (!data) break;
        token = generateShortToken();
        attempts++;
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 horas

      // Usar la función RPC existente
      const { data: rpcData, error: rpcError } = await supabase.rpc('create_demo_link', {
        p_token: token,
        p_admin_id: adminId,
        p_expires_at: expiresAt,
        p_max_uses: 9999, // Múltiples usos durante 24 hrs
        p_allowed_modules: ['seed_preventa'],
        p_requires_token: true,
        p_requires_user_info: false,
        p_is_geo_fenced: false,
      });

      if (rpcError) throw rpcError;

      const result = rpcData?.[0];
      if (!result?.success) {
        throw new Error(result?.error_message || 'Error al crear el token');
      }

      setCreatedToken(token);
      toast.success('Token de preventa generado');
      onCreated();
    } catch (error) {
      console.error('Error creating pre-sale token:', error);
      toast.error('No se pudo generar el token de preventa');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!createdToken) return;
    await navigator.clipboard.writeText(createdToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Token copiado');
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedToken(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] transition-all duration-300">
          <Ticket className="h-4 w-4" />
          Generar Token Preventa
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-blue-200/50 bg-white/95 backdrop-blur-2xl sm:max-w-md shadow-[0_0_100px_rgba(37,99,235,0.15)]">
        <DialogHeader className="px-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <Ticket className="h-6 w-6 text-blue-600" />
            {createdToken ? '🎟️ Token Generado' : '⚡ Nuevo Token de Preventa'}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {createdToken
              ? 'Este token es válido para uso ilimitado durante 24 horas.'
              : 'Genera un acceso único para Dentaxy Seed (Válido 24h).'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {createdToken ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-100 border-dashed">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">Código de Acceso</span>
                <span className="text-4xl font-black text-slate-900 tracking-widest font-mono">
                  {createdToken}
                </span>
              </div>

              <Button
                onClick={handleCopy}
                className="w-full bg-slate-900 hover:bg-black text-white h-14 rounded-2xl gap-2 transition-all"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                {copied ? 'Copiado' : 'Copiar Código'}
              </Button>
              
              <p className="text-center text-xs text-slate-400">
                Comparte este código directamente con el usuario.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Expiración automática: **24 horas**
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Límite de usos: **Ilimitados (24h)**
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Módulo: **Dentaxy Seed (Preventa)**
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleCreate}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-800 text-white font-bold h-14 rounded-2xl shadow-xl shadow-blue-200 transition-all"
              >
                {isCreating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generar Acceso Ahora
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

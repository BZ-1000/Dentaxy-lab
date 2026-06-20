import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function SeedOnboardingDrive() {
  const handleConnect = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.warn("No hay sesión activa de Supabase. Redireccionando a login...");
        window.location.href = '/seed?login=true';
        return;
      }

      window.location.href = `/api/auth/google/login?user_id=${session.user.id}`;
    } catch (error) {
      console.error("Error al iniciar conexión:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      {/* Contenedor Total White Glassmorphic */}
      <div className="relative w-full max-w-lg p-10 mx-4 overflow-hidden bg-white/90 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)]">
        
        {/* Glow effect sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-emerald-400/20 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Icono de Drive moderno (Asumiendo que public/logos/google-drive.png existe) */}
          <div className="w-20 h-20 mb-6 drop-shadow-xl hover:scale-105 transition-transform duration-300">
            <img 
              src="/logos/google-drive.png" 
              alt="Google Drive" 
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Protege tus Expedientes
          </h2>
          
          <p className="text-slate-600 font-medium mb-8 max-w-[320px] text-sm leading-relaxed">
            Dentaxy opera bajo una arquitectura de <strong>cero almacenamiento</strong>. Conecta tu cuenta para que los expedientes se guarden directamente en tu propio Google Drive.
          </p>

          <button 
            onClick={handleConnect}
            className="group relative flex items-center justify-center gap-3 w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-base transition-all shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)] active:scale-[0.98]"
          >
            <Lock size={18} className="text-emerald-400" />
            Conectar mi Google Drive
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="mt-6 text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Tus datos, tus reglas. Máxima privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}

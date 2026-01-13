import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ClimuzacHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/academico')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Volver</span>
        </Button>

        {/* Center: Title */}
        <div className="text-center flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <h1 className="text-lg font-black tracking-tight">CLIMUZAC</h1>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <p className="hidden sm:block text-xs text-muted-foreground">
            Dentaxy × Smile · Demostración de Integración
          </p>
        </div>

        {/* Badge de integración activa */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Zap className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-600">
            Integración Activa
          </span>
        </div>
      </div>
    </header>
  );
};

export default ClimuzacHeader;

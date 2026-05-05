import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemo } from '@/pages/academico/context/DemoContext';

interface DemoHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({ showBack = true, onBack }) => {
  const navigate = useNavigate();
  const { isZeroState, toggleZeroState } = useDemo();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/academico');
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-border/50"
    >
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Left - Back button & Branding */}
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <span className="text-lg font-black tracking-tight">
                DENTAXY
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm font-semibold text-muted-foreground">
              UAO SYNC
            </span>
          </div>
        </div>

        {/* Right - Status */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleZeroState}
            title={isZeroState ? "Llenar con datos mágicos" : "Volver a estado inicial (cero)"}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors group cursor-pointer"
          >
            {isZeroState ? (
              <Wand2 className="h-3.5 w-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
            ) : (
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
            )}
            <span className="text-xs font-medium text-emerald-600">
              {isZeroState ? "Zero-State Activo" : "Demo Verificado"}
            </span>
          </button>
          
          <img 
            src="/logos/uao-odontologia.png" 
            alt="UAO UAZ" 
            className="h-10 object-contain"
          />
        </div>
      </div>
    </motion.header>
  );
};

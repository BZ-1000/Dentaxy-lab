import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DemoHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({ showBack = false, onBack }) => {
  const navigate = useNavigate();

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
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary to-primary/80 p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">
                UAO SYNC
              </span>
              <span className="text-xs text-muted-foreground">
                Dentaxy Académico
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-emerald-500" />
            <span>Sesión Verificada</span>
          </div>
          
          <div className="h-8 w-px bg-border hidden sm:block" />
          
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/688aaa11-080e-4ce1-ad03-970733b79d54.png" 
              alt="Dentaxy" 
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

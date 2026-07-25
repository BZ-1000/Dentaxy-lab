import {
  HomeIcon,
  Trash,
  Search,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  Check,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { FloatingChatInput } from './ui/FloatingChatInput';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppleStyleDockProps {
  onOpenFormularios?: (forceOpen?: boolean) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  canGoNext?: boolean;
  canGoPrev?: boolean;
  currentStep?: number;
  totalSteps?: number;
  stepNames?: string[];
  onStepClick?: (index: number) => void;
  position?: 'fixed' | 'absolute';
}

export function AppleStyleDock({
  onOpenFormularios,
  onNext,
  onPrev,
  onGenerate,
  isGenerating,
  canGoNext,
  canGoPrev,
  currentStep = 0,
  totalSteps = 1,
  stepNames = [],
  onStepClick,
  position = 'fixed',
}: AppleStyleDockProps = {}) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [showStepsDialog, setShowStepsDialog] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [session, setSession] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [username, setUsername] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [redaccionesState, setRedaccionesState] = useState<'idle' | 'loading' | 'success'>('idle');

  const getRedaccionesIcon = () => {
    switch (redaccionesState) {
      case 'loading':
        return <Loader2 className='h-full w-full text-emerald-500 animate-spin' />;
      case 'success':
        return <Check className='h-full w-full text-emerald-500 animate-in zoom-in' />;
      default:
        return <BookOpen className='h-full w-full text-zinc-900 dark:text-zinc-100' />;
    }
  };

  // Botones estáticos del Dock
  const data = [
    {
      title: 'Inicio',
      icon: <HomeIcon className='h-full w-full text-zinc-900 dark:text-zinc-100' />,
    },
    {
      title: 'Limpiar Formulario',
      icon: <Trash className='h-full w-full text-zinc-900 dark:text-zinc-100' />,
    },
    {
      title: 'DentaxyGPT',
      icon: <Search className='h-full w-full text-zinc-900 dark:text-zinc-100' />,
    },
    {
      title: 'Redacciones',
      icon: getRedaccionesIcon(),
    },
  ];

  useEffect(() => {
    const nameInput = document.querySelector('#patient-name-input');
    const checkScroll = () => {
      if (nameInput) {
        const rect = nameInput.getBoundingClientRect();
        setIsVisible(rect.top < 0);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToName = () => {
    const nameInput = document.querySelector('#patient-name-input');
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth' });
      const input = nameInput.querySelector('input');
      if (input) setTimeout(() => input.focus(), 300);
    }
  };

  const handleItemClick = async (title: string) => {
    switch (title) {
      case 'Inicio':
        navigate('/');
        break;
      case 'Limpiar Formulario':
        handleResetForm();
        break;
      case 'DentaxyGPT':
        setShowFloatingChat(true);
        break;
      case 'Redacciones':
        onOpenFormularios?.();
        break;
      case 'Actividad': {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          toast.error('Debes iniciar sesión para acceder a tu perfil');
          return;
        }
        setSession(currentSession);
        setShowProfile(true);
        break;
      }
    }
  };

  const handleChatSend = (message: string) => {
    console.log('Chat message:', message);
  };

  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim()) {
      toast.error('Por favor escribe un mensaje');
      return;
    }
    try {
      const { error } = await supabase.functions.invoke('send-feedback', {
        body: { message: feedbackMessage },
      });
      if (error) throw error;
      toast.success('¡Feedback enviado exitosamente!');
      setFeedbackMessage('');
      setShowFeedback(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al enviar el feedback');
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error al cerrar sesión');
      return;
    }
    setSession(null);
    setShowProfile(false);
    toast.success('Sesión cerrada exitosamente');
  };

  const handleResetForm = () => {
    if (window.confirm('¿Estás seguro que deseas limpiar todo el formulario? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('currentFormData');
      localStorage.removeItem('formBackup');
      window.location.reload();
    }
  };

  return (
    <>
    <>
      {/* Dock vertical flotante a la izquierda, solo iconos, más alto que ancho */}
      <div className={cn(
        'fixed left-4 top-1/2 -translate-y-1/2 z-[100000]',
        'w-14 py-5 rounded-full flex flex-col items-center gap-4.5',
        'glass-deep border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-left-8 duration-500'
      )}>
        
        {/* Botón Inicio */}
        <button
          onClick={() => handleItemClick('Inicio')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer active:scale-90"
          title="Inicio"
        >
          <HomeIcon size={16} />
        </button>

        {/* Botón Limpiar Formulario */}
        <button
          onClick={() => handleItemClick('Limpiar Formulario')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer active:scale-90"
          title="Limpiar Formulario"
        >
          <Trash size={16} />
        </button>

        {/* Separador */}
        <div className="w-8 h-px bg-white/10 my-1" />

        {/* Botón Paso Anterior */}
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90",
            canGoPrev 
              ? "text-zinc-300 hover:text-white hover:bg-white/10" 
              : "text-zinc-600 opacity-40 cursor-not-allowed"
          )}
          title="Paso Anterior"
        >
          <ArrowLeft size={16} />
        </button>

        {/* Indicador de paso actual (Clicable para abrir diálogo) */}
        <button
          onClick={() => setShowStepsDialog(true)}
          className="w-10 h-10 rounded-full flex flex-col items-center justify-center bg-white/5 border border-white/10 hover:bg-white/15 transition-all cursor-pointer text-white relative group"
          title="Navegación Rápida"
        >
          <span className="text-[9px] font-bold tracking-tighter leading-none">{currentStep + 1}</span>
          <span className="text-[7px] text-zinc-400 font-semibold leading-none scale-90 mt-0.5">/{totalSteps}</span>
          
          {/* Anillo de progreso alrededor */}
          <div className="absolute inset-0 rounded-full border border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Botón Paso Siguiente */}
        <button
          onClick={() => {
            if (onGenerate) onGenerate();
            if (onNext) onNext();
            if (!isMobile && onOpenFormularios) onOpenFormularios(true);
            setRedaccionesState('loading');
            setTimeout(() => {
              setRedaccionesState('success');
              setTimeout(() => setRedaccionesState('idle'), 2000);
            }, 5000);
          }}
          disabled={!canGoNext}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90",
            canGoNext 
              ? "bg-emerald-500 hover:bg-emerald-450 text-white shadow-lg shadow-emerald-500/20" 
              : "bg-zinc-800 text-zinc-600 opacity-40 cursor-not-allowed"
          )}
          title="Siguiente Paso"
        >
          <ArrowRight size={16} />
        </button>

        {/* Separador */}
        <div className="w-8 h-px bg-white/10 my-1" />

        {/* Botón DentaxyGPT / Chat */}
        <button
          onClick={() => handleItemClick('DentaxyGPT')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer active:scale-90"
          title="DentaxyGPT"
        >
          <Search size={16} />
        </button>

        {/* Botón Redacciones */}
        <button
          onClick={() => handleItemClick('Redacciones')}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90",
            redaccionesState === 'loading' ? 'animate-pulse' : ''
          )}
          title="Ver Redacciones"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            {getRedaccionesIcon()}
          </div>
        </button>

      </div>
    </>

      <FloatingChatInput
        isOpen={showFloatingChat}
        onClose={() => setShowFloatingChat(false)}
        onSend={handleChatSend}
      />

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guía de uso</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="font-bold">Navegación básica:</h3>
                  <p>- Usa el icono de Inicio para volver al inicio</p>
                  <p>- El icono de perfil te permite gestionar tu cuenta</p>
                </div>
                <div>
                  <h3 className="font-bold">Funcionalidades principales:</h3>
                  <p>- Completa tu perfil para acceder a todas las funciones</p>
                  <p>- Envía feedback para ayudarnos a mejorar</p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Ideas o problemas? Escríbenos</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 mt-4">
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="w-full h-32 p-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700"
                  placeholder="Describe el error o sugerencia de mejora..."
                />
                <Button onClick={handleSendFeedback} className="w-full">
                  Enviar sugerencias
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perfil de Usuario</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 mt-4">
                {session ? (
                  <>
                    <div className="text-sm space-y-2">
                      <p>Email: {session.user.email}</p>
                      {username && <p>Usuario: {username}</p>}
                    </div>
                    <Button variant="destructive" onClick={handleLogout} className="w-full">
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <p>Por favor, inicia sesión para ver tu perfil</p>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showStepsDialog} onOpenChange={setShowStepsDialog}>
        <DialogContent className="max-h-[80vh] overflow-y-auto dentaxy-scrollbar">
          <DialogHeader>
            <DialogTitle>Navegación Rápida</DialogTitle>
            <DialogDescription>
              Selecciona una sección para ir directamente a ella.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {stepNames.map((name, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (onStepClick) {
                    onStepClick(idx);
                  }
                  setShowStepsDialog(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  idx === currentStep 
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </>
  );
}

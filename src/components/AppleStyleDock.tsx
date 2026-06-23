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
      {/* Dock adherido a la base de la card, mismo ancho máximo */}
      <div className={cn(
        position === 'absolute' ? 'absolute' : 'fixed',
        'bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-[100000]',
        'w-full max-w-[min(600px,calc(100vw-32px))]',
        'px-0'
      )}>
        <div className="flex items-stretch bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.12)] rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden">

          {/* Textarea libre estilo Dex — ocupa todo el espacio disponible */}
          <div className="flex-1 flex items-center px-3.5 py-2.5">
            <textarea
              rows={1}
              placeholder="Escribe una nota o instrucción para Dex..."
              className="w-full resize-none bg-transparent border-none outline-none text-[12.5px] text-zinc-700 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 leading-snug overflow-hidden"
              style={{ minHeight: '28px', maxHeight: '80px' }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 80) + 'px';
              }}
            />
          </div>

          {/* Separador */}
          <div className="w-px bg-zinc-200 dark:bg-zinc-800 my-2" />

          {/* Indicador de pasos — clickeable para ver lista */}
          <div
            onClick={() => setShowStepsDialog(true)}
            className="flex flex-col justify-center items-center px-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
              Paso {currentStep + 1} de {totalSteps}
            </span>
            <div className="w-14 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Botón Atrás */}
          {onPrev && canGoPrev && (
            <button
              onClick={onPrev}
              className="flex items-center justify-center w-10 h-full hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors border-l border-zinc-200 dark:border-zinc-800"
            >
              <ArrowLeft size={15} className="text-zinc-600 dark:text-zinc-300" />
            </button>
          )}

          {/* Botón Siguiente — verde esmeralda */}
          {onNext && canGoNext && (
            <button
              onClick={() => {
                if (onGenerate) onGenerate();
                onNext();
                if (!isMobile && onOpenFormularios) onOpenFormularios(true);
                setRedaccionesState('loading');
                setTimeout(() => {
                  setRedaccionesState('success');
                  setTimeout(() => setRedaccionesState('idle'), 2000);
                }, 5000);
              }}
              className="flex items-center justify-center w-10 h-full rounded-r-2xl bg-[#0ecf8e] hover:bg-[#25dba0] transition-colors border-l border-[#0ecf8e]/20"
            >
              {isGenerating ? (
                <Loader2 size={15} className="text-white animate-spin" />
              ) : (
                <ArrowRight size={15} className="text-white" />
              )}
            </button>
          )}
        </div>
      </div>

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

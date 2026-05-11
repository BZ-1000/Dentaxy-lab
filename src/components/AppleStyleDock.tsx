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
}

export function AppleStyleDock({
  onOpenFormularios,
  onNext,
  onPrev,
  onGenerate,
  isGenerating,
  canGoNext,
  canGoPrev,
}: AppleStyleDockProps = {}) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
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
      {/* Dock flotante — z-index máximo para superponerse a todo */}
      <div className='fixed bottom-1 sm:bottom-2 left-1/2 max-w-[95vw] sm:max-w-full -translate-x-1/2 z-[9999] px-2 sm:px-0'>
        <Dock
          className={cn(
            'items-end pb-2 sm:pb-3 pt-2 sm:pt-3 px-3 flex bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.1)] rounded-2xl overflow-visible',
            isVisible ? 'w-auto' : 'w-fit'
          )}
          distance={140}
          magnification={60}
          panelHeight={48}
        >
          {/* Botones estáticos */}
          {data.map((item, idx) => (
            <DockItem
              key={idx}
              onClick={() => handleItemClick(item.title)}
              className='aspect-square rounded-full cursor-pointer bg-white dark:bg-white shadow-sm'
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}

          {/* Botón Atrás — solo si existe navegación */}
          {onPrev && canGoPrev && (
            <DockItem
              onClick={onPrev}
              className='aspect-square rounded-full bg-white dark:bg-white shadow-sm cursor-pointer'
            >
              <DockLabel>Atrás</DockLabel>
              <DockIcon>
                <ArrowLeft className='h-full w-full text-zinc-900 dark:text-zinc-900' />
              </DockIcon>
            </DockItem>
          )}

          {/* Botón Siguiente — verde esmeralda vibrante */}
          {onNext && canGoNext && (
            <DockItem
              onClick={() => {
                if (onGenerate) onGenerate();
                onNext();
                if (!isMobile && onOpenFormularios) onOpenFormularios(true);
                
                setRedaccionesState('loading');
                setTimeout(() => {
                  setRedaccionesState('success');
                  setTimeout(() => {
                    setRedaccionesState('idle');
                  }, 2000);
                }, 5000);
              }}
              className='aspect-square rounded-full bg-[#10b981] hover:bg-[#059669] shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer'
            >
              <DockLabel>Siguiente</DockLabel>
              <DockIcon>
                {isGenerating ? (
                  <Loader2 className='h-full w-full text-white animate-spin' />
                ) : (
                  <ArrowRight className='h-full w-full text-white' />
                )}
              </DockIcon>
            </DockItem>
          )}

          {/* Scroll-to-name: aparece dinámicamente al hacer scroll */}
          {isVisible && (
            <DockItem
              onClick={scrollToName}
              className='aspect-square rounded-full bg-white dark:bg-white text-zinc-900 shadow-lg cursor-pointer slide-in'
            >
              <DockLabel>Scroll to Name</DockLabel>
              <DockIcon>
                <Save className='h-full w-full text-zinc-900' />
              </DockIcon>
            </DockItem>
          )}
        </Dock>
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

import {
  Mail,
  RefreshCw,
  HomeIcon,
  UserCircle,
  SunMoon,
  Crown,
  Save,
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
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
import { cn } from '@/lib/utils'; // Asegúrate de importar la utilidad cn
import ResetConfirmationDialog from '@/components/historia-clinica/ResetConfirmationDialog';

const data = [
  {
    title: 'Inicio',
    icon: (
      <HomeIcon className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '/',
  },
  {
    title: 'Actividad',
    icon: (
      <UserCircle className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
  {
    title: 'Reiniciar',
    icon: (
      <RefreshCw className='h-full w-full text-white' />
    ),
    href: '#',
    customClass: 'bg-amber-400 hover:bg-amber-500'
  },
  {
    title: 'Comentarios',
    icon: (
      <Mail className='h-full w-full text-red-500 dark:text-red-400' />
    ),
    href: '#',
  },
];

export function AppleStyleDock() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [session, setSession] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [username, setUsername] = useState('');
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Estado para la visibilidad del botón
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  useEffect(() => {
    const nameInput = document.querySelector('#patient-name-input');

    const checkScroll = () => {
      if (nameInput) {
        const rect = nameInput.getBoundingClientRect();
        setIsVisible(rect.top < 0); // Lógica para mostrar/ocultar el botón
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
      if (input) {
        setTimeout(() => {
          input.focus();
        }, 300); // Espera a que termine el scroll antes de enfocar
      }
    }
  };

  const handleItemClick = async (title: string) => {
    switch (title) {
      case 'Inicio':
        navigate('/');
        break;
      case 'Actividad':
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          toast.error('Debes iniciar sesión para acceder a tu perfil');
          return;
        }
        setSession(currentSession);
        setShowProfile(true);
        break;
      case 'Reiniciar':
        setShowResetConfirmation(true);
        break;
      case 'Comentarios':
        setShowFeedback(true);
        break;
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim()) {
      toast.error('Por favor escribe un mensaje');
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-feedback', {
        body: { message: feedbackMessage }
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

  const handleChangePlan = () => {
    setShowPricingPopup(true);
    setShowProfile(false);
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

  const handleReset = () => {
    // Clear localStorage form data
    localStorage.removeItem('AUTO_SAVE_KEY');
    // Reload the page to reset all forms
    window.location.reload();
  };

  return (
    <>
      <div className='fixed bottom-2 left-1/2 max-w-full -translate-x-1/2 z-50'>
        <Dock className={cn('items-end pb-3 flex', isVisible ? 'w-auto' : 'w-fit')}>
          {data.map((item, idx) => (
            <DockItem
              key={idx}
              onClick={() => handleItemClick(item.title)}
              className={cn(
                'aspect-square rounded-full cursor-pointer',
                item.customClass || 'bg-gray-200 dark:bg-neutral-800'
              )}
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}
          <DockItem
            onClick={toggleTheme}
            className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 cursor-pointer'
          >
            <DockLabel>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</DockLabel>
            <DockIcon>
              <SunMoon className='h-full w-full text-neutral-600 dark:text-neutral-300' />
            </DockIcon>
          </DockItem>
          {/* Nuevo botón ScrollToName */}
          {isVisible && (
            <DockItem
              onClick={scrollToName}
              className='aspect-square rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg cursor-pointer slide-in'
            >
              <DockLabel>Scroll to Name</DockLabel>
              <DockIcon>
                <Save className='h-full w-full' />
              </DockIcon>
            </DockItem>
          )}
        </Dock>
      </div>

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
                  <p>- Puedes cambiar entre modo claro y oscuro</p>
                </div>
                <div>
                  <h3 className="font-bold">Funcionalidades principales:</h3>
                  <p>- Completa tu perfil para acceder a todas las funciones</p>
                  <p>- Envía feedback para ayudarnos a mejorar</p>
                  <p>- Explora el contenido disponible en la versión beta</p>
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
                      <div className="flex items-center gap-2 text-blue-500">
                        <Crown className="h-4 w-4" />
                        <p>Plan Beta</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleChangePlan}
                      className="w-full mb-2"
                    >
                      Cambiar Plan
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="w-full"
                    >
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

      {showPricingPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-black/90 p-8 rounded-lg border border-white/20 shadow-xl w-full max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Planes Disponibles</h2>
              <Button
                variant="ghost"
                onClick={() => setShowPricingPopup(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative p-6 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  Disponible
                </div>
                <h3 className="text-xl font-bold text-white mb-4 mt-4">Plan Beta</h3>
                <p className="text-white/60 mb-6">Acceso completo durante la fase beta</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-white/80">
                    <span className="mr-2">✓</span> Acceso a todas las funciones
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="mr-2">✓</span> Soporte prioritario
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="mr-2">✓</span> Beneficios exclusivos
                  </li>
                </ul>
                <Button
                  onClick={() => {
                    // Aquí implementaría el cambio de plan
                    setShowPricingPopup(false);
                    toast.success('Plan Beta seleccionado');
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Seleccionar Plan Beta
                </Button>
              </div>

              <div className="p-6 rounded-xl border border-white/20 backdrop-blur-sm opacity-50">
                <h3 className="text-xl font-bold text-white mb-4">Plan Básico</h3>
                <p className="text-white/60 mb-6">Próximamente</p>
              </div>

              <div className="p-6 rounded-xl border border-white/20 backdrop-blur-sm opacity-50">
                <h3 className="text-xl font-bold text-white mb-4">Plan Premium</h3>
                <p className="text-white/60 mb-6">Próximamente</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
      
      <ResetConfirmationDialog 
        isOpen={showResetConfirmation} 
        onClose={() => setShowResetConfirmation(false)}
        onConfirm={handleReset}
      />
    </>
  );
}

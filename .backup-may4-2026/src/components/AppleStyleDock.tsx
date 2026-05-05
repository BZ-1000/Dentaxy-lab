import {
  Mail,
  ScrollText,
  HomeIcon,
  UserCircle,
  SunMoon,
  Save,
  Trash,
  Cross,
  Search,
  BookOpen,
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
import { cn } from '@/lib/utils';
import { MedicationSearch } from './MedicationSearch';
import { FloatingChatInput } from './ui/FloatingChatInput';

const data = [
  {
    title: 'Inicio',
    icon: (
      <HomeIcon className='h-full w-full text-white' />
    ),
    href: '/',
  },
  {
    title: 'Medicamentos',
    icon: (
      <Cross className='h-full w-full text-white' />
    ),
    href: '#',
  },
  {
    title: 'DentaxyGPT',
    icon: (
      <Search className='h-full w-full text-white' />
    ),
    href: '#',
  },
  {
    title: 'Comentarios',
    icon: (
      <Mail className='h-full w-full text-red-500 dark:text-red-400' />
    ),
    href: '#',
  },
  {
    title: 'Formularios',
    icon: (
      <BookOpen className='h-full w-full text-white' />
    ),
    href: '#',
  },
];

interface AppleStyleDockProps {
  onOpenFormularios?: () => void;
}

export function AppleStyleDock({ onOpenFormularios }: AppleStyleDockProps = {}) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showMedicationSearch, setShowMedicationSearch] = useState(false);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [session, setSession] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [username, setUsername] = useState('');
  
  const [isVisible, setIsVisible] = useState(false);

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
      if (input) {
        setTimeout(() => {
          input.focus();
        }, 300);
      }
    }
  };

  const handleItemClick = async (title: string) => {
    switch (title) {
      case 'Inicio':
        navigate('/');
        break;
      case 'Medicamentos':
        setShowMedicationSearch(true);
        break;
      case 'DentaxyGPT':
        setShowFloatingChat(true);
        break;
      case 'Comentarios':
        setShowFeedback(true);
        break;
      case 'Formularios':
        onOpenFormularios?.();
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
      <div className='fixed bottom-1 sm:bottom-2 left-1/2 max-w-[95vw] sm:max-w-full -translate-x-1/2 z-50 px-2 sm:px-0'>
        <Dock 
          className={cn('items-end pb-2 sm:pb-3 flex', isVisible ? 'w-auto' : 'w-fit')}
          distance={100}
          magnification={50}
          panelHeight={48}
        >
          {data.map((item, idx) => (
            <DockItem
              key={idx}
              onClick={() => handleItemClick(item.title)}
              className={`aspect-square rounded-full cursor-pointer ${
                item.title === 'Medicamentos' ? 'bg-emerald-500' : (item.title === 'DentaxyGPT' ? 'bg-black' : (item.title === 'Inicio' ? 'bg-amber-400' : (item.title === 'Formularios' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-neutral-800')))
              } ${item.title === 'Formularios' ? 'hidden md:flex' : ''}`}
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}
          <DockItem
            onClick={toggleTheme}
            className='aspect-square rounded-full bg-gray-700 cursor-pointer'
          >
            <DockLabel>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</DockLabel>
            <DockIcon>
              <SunMoon className='h-full w-full text-white' />
            </DockIcon>
          </DockItem>
          <DockItem
            onClick={handleResetForm}
            className='aspect-square rounded-full bg-red-500 hover:bg-red-600 cursor-pointer'
          >
            <DockLabel>Limpiar Formulario</DockLabel>
            <DockIcon>
              <Trash className='h-full w-full text-white' />
            </DockIcon>
          </DockItem>
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

      <MedicationSearch
        open={showMedicationSearch}
        onOpenChange={setShowMedicationSearch}
      />

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
                    </div>
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
    </>
  );
}

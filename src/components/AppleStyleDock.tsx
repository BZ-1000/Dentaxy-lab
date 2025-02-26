import {
  Mail,
  ScrollText,
  HomeIcon,
  UserCircle,
  SunMoon,
  Crown,
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
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const data = [
  {
    title: 'Home',
    icon: (
      <HomeIcon className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '/',
  },
  {
    title: 'Activity',
    icon: (
      <UserCircle className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
  {
    title: 'Change Log',
    icon: (
      <ScrollText className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
  {
    title: 'Feedback',
    icon: (
      <Mail className='h-full w-full text-red-500 dark:text-red-400' /> // Color rojo estilo Apple
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

  const handleItemClick = async (title: string) => {
    switch (title) {
      case 'Home':
        navigate('/');
        break;
      case 'Activity':
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          toast.error('Debes iniciar sesión para acceder a tu perfil');
          return;
        }
        setSession(currentSession);
        setShowProfile(true);
        break;
      case 'Change Log':
        setShowInstructions(true);
        break;
      case 'Feedback':
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

  return (
    <>
      <div className='fixed bottom-2 left-1/2 max-w-full -translate-x-1/2 z-50'>
        <Dock className='items-end pb-3'>
          {data.map((item, idx) => (
            <DockItem
              key={idx}
              onClick={() => handleItemClick(item.title)}
              className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 cursor-pointer'
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}
          <DockItem
            onClick={toggleTheme}
            className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 cursor-pointer'
          >
            <DockLabel>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</DockLabel>
            <DockIcon>
              <SunMoon className='h-full w-full text-neutral-600 dark:text-neutral-300' />
            </DockIcon>
          </DockItem>
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
                  <p>- Usa el icono de Home para volver al inicio</p>
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
    </>
  );
}

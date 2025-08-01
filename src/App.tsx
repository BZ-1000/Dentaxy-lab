
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Index from './pages/Index';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import AuthCallback from './pages/auth/callback';
import { supabase } from './integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Toaster } from './components/ui/sonner';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import { useTheme } from '@/hooks/use-theme';

// Páginas del menú principal
import About from './pages/about/About';
import HowItWorks from './pages/how-it-works/HowItWorks';
import Benefits from './pages/benefits/Benefits';
import Plans from './pages/plans/Plans';
import Contact from './pages/contact/Contact';

// Páginas de políticas
import TermsAndConditions from './pages/policies/TermsAndConditions';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    // Check if this is a manual reload (F5 or browser refresh button)
    const isManualReload = performance.navigation.type === 1;
    if (isManualReload) {
      // Clear form data on manual reload
      localStorage.removeItem('currentFormData');
      localStorage.removeItem('formBackup');
      console.log('Manual page reload detected - form data cleared');
    }

    // Persistir la sesión usando localStorage
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }

    // Obtener la sesión actual al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        localStorage.setItem('userSession', JSON.stringify(session));
      }
      setLoading(false);
    });

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        localStorage.setItem('userSession', JSON.stringify(session));
      } else {
        localStorage.removeItem('userSession');
      }
      setLoading(false);
    });

    // Manejar eventos de visibilidad del documento
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Verificar sesión al volver a la pestaña
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
        });
        
        // Restaurar datos del formulario si existen
        const savedData = localStorage.getItem('currentFormData');
        if (savedData) {
          console.log('Restoring form data from localStorage');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Prevenir recargas automáticas
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const formData = localStorage.getItem('currentFormData');
      if (formData) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Componente protegido que verifica si el usuario está autenticado
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div>Cargando...</div>;
    
    if (!session) {
      return <Navigate to="/auth/login" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <ErrorBoundary>
      <div translate="no">
        <Toaster richColors position="top-right" />
        <Router>
          <Routes>
            {/* Página de inicio */}
            <Route path="/" element={<Landing />} />
            
            {/* Páginas del menú principal */}
            <Route path="/about" element={<About />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/como-funciona" element={<HowItWorks />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/beneficios" element={<Benefits />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/planes" element={<Plans />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contacto" element={<Contact />} />
            
            {/* Páginas de políticas */}
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            
            {/* Autenticación */}
            <Route path="/auth/login" element={session ? <Navigate to="/app" replace /> : <Login />} />
            <Route path="/auth/register" element={session ? <Navigate to="/app" replace /> : <Register />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* App protegida */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            {/* 404 - No encontrado */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Analytics />
      </div>
    </ErrorBoundary>
  );
}

export default App;

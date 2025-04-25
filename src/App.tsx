
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
import './App.css';

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

  useEffect(() => {
    // Prevent automatic reloads
    // Handle beforeunload event - ONLY for actual manual page reloads
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only allow page reload when the user explicitly requests it
      // Do not prevent the default browser behavior for manual reloads
      return undefined;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Prevent any automatic reloads when switching tabs
    const handleVisibilityChange = () => {
      // Just a listener to handle visibility changes, no action needed
      // The form data will be auto-saved in the FormulariosSidebar component
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Obtener la sesión actual al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
    <>
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
    </>
  );
}

export default App;

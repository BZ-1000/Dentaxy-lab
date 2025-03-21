
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import AuthCallback from './pages/auth/callback';
import Nosotros from './pages/Nosotros';
import ComoFunciona from './pages/ComoFunciona';
import Beneficios from './pages/Beneficios';
import Planes from './pages/Planes';
import Contacto from './pages/Contacto';
import { supabase } from './integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import './App.css';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    return () => subscription.unsubscribe();
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
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/beneficios" element={<Beneficios />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/contacto" element={<Contacto />} />
        
        <Route path="/app" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        
        <Route path="/auth/login" element={session ? <Navigate to="/app" replace /> : <Login />} />
        <Route path="/auth/register" element={session ? <Navigate to="/app" replace /> : <Register />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

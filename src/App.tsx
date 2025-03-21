
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Index from './pages/Index';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import AuthCallback from './pages/auth/callback';
import Nosotros from './pages/Nosotros';
import Funciones from './pages/Funciones';
import Beneficios from './pages/Beneficios';
import Planes from './pages/Planes';
import Contacto from './pages/Contacto';
import Terminos from './pages/Terminos';
import Privacidad from './pages/Privacidad';
import { supabase } from './integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import './App.css';

// Loading component to show during authentication check
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First set up auth state listener to catch events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session ? "User authenticated" : "No session");
      setSession(session);
      setLoading(false);
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session found" : "No session found");
      setSession(session);
      setLoading(false);
    }).catch(error => {
      console.error("Error checking session:", error);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    
    if (loading) {
      return <LoadingScreen />;
    }
    
    if (!session) {
      // Save the attempted URL to redirect back after login
      localStorage.setItem('redirectAfterLogin', location.pathname);
      return <Navigate to="/auth/login" replace />;
    }
    
    return <>{children}</>;
  };

  // Render loading screen while initial authentication check is in progress
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/funciones" element={<Funciones />} />
        <Route path="/beneficios" element={<Beneficios />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        
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

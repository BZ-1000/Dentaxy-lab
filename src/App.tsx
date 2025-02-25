
import React from 'react';
import { Toaster } from 'sonner';
import { Route, Routes, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import { useEffect, useState } from 'react';
import { supabase } from './integrations/supabase/client';
import './App.css';

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Obtener la sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Componente PrivateRoute para proteger rutas
  const PrivateRoute = ({ children }) => {
    if (!session) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing session={session} />} />
              <Route 
                path="/app/*" 
                element={
                  <PrivateRoute>
                    <Index />
                  </PrivateRoute>
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
};

export default App;

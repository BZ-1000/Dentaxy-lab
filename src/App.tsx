
import React from 'react';
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
import { AuthProvider, useAuth } from './hooks/useAuth';
import { GeminiProvider } from './contexts/GeminiContext';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

// Loading component to show during authentication check
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    // Save the attempted URL to redirect back after login
    localStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  const { loading } = useAuth();

  // Render loading screen while initial authentication check is in progress
  if (loading) {
    return <LoadingScreen />;
  }

  return (
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
      
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <GeminiProvider>
          <AppRoutes />
          <Toaster />
        </GeminiProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

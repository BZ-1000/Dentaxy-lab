import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Index from './pages/Index';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import AuthCallback from './pages/auth/callback';
import { Toaster } from './components/ui/sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

// Página de éxito de donación
import DonationSuccess from './pages/DonationSuccess';

// Componente protegido que verifica si el usuario está autenticado
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

import ActivityTracker from './components/ActivityTracker';

function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        {/* Tracker global: cuenta minutos en cualquier apartado para usuarios logueados */}
        <ActivityTracker />
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
              
              {/* Donación */}
              <Route path="/donation-success" element={<DonationSuccess />} />
              
              {/* Autenticación */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
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
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

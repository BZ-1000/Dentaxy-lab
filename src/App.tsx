
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Index from './pages/Index';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { useGlobalMetrics } from './hooks/useGlobalMetrics';
import './App.css';

// Páginas del menú principal
import About from './pages/about/About';
import HowItWorks from './pages/how-it-works/HowItWorks';
import Benefits from './pages/benefits/Benefits';
import Contact from './pages/contact/Contact';

// Páginas de políticas
import TermsAndConditions from './pages/policies/TermsAndConditions';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';

// Página de éxito de donación
import DonationSuccess from './pages/DonationSuccess';

// Component to initialize global tracking
const GlobalTracker = () => {
  useGlobalMetrics(); // Initialize all metrics tracking globally
  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <GlobalTracker />
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
            
            <Route path="/contact" element={<Contact />} />
            <Route path="/contacto" element={<Contact />} />
            
            {/* Páginas de políticas */}
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            
            {/* Donación */}
            <Route path="/donation-success" element={<DonationSuccess />} />
            
            {/* Redirecciones de auth a app */}
            <Route path="/auth/*" element={<Navigate to="/app" replace />} />
            
            {/* App - Acceso libre */}
            <Route path="/app" element={<Index />} />
            
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

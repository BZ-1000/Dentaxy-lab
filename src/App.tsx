
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AcademicoProvider } from '@/contexts/AcademicoContext';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import Index from './pages/Index';
import Landing from './pages/Landing';
import ModulesHub from './pages/ModulesHub';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { useGlobalMetrics } from './hooks/useGlobalMetrics';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
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

// Admin Panel
import AdminLayout from './pages/admin/AdminLayout';
import AdminLoginPage from './pages/admin/LoginPage';
import AdminDashboard from './pages/admin/Dashboard';
import Ecosystem from './pages/admin/Ecosystem';
import DemoControl from './pages/admin/DemoControl';
import Security from './pages/admin/Security';
import GeoMap from './pages/admin/GeoMap';
import Analytics from './pages/admin/Analytics';
import Communication from './pages/admin/Communication';
import StudentModule from './pages/admin/StudentModule';
import ModulesManager from './pages/admin/ModulesManager';
import AuditLogs from './pages/admin/AuditLogs';
import Settings from './pages/admin/Settings';
import AdminNexusIntel from './pages/admin/NexusIntel';

// Shop (Tienda privada)
import ShopLogin from './pages/shop/ShopLogin';
import Shop from './pages/shop/Shop';
import { ShopAuthProvider } from './contexts/ShopAuthContext';

// Demo Académico UAO
import { AcademicoDemo, ClinicaView } from './pages/academico';

// Demo DENTAXY AI
import AIDemo from './pages/demo/AIDemo';
import DICOMDemo from './pages/demo/DICOMDemo';
import EnterpriseDemo from './pages/demo/EnterpriseDemo';
import StarkDemo from './pages/demo/StarkDemo';
import { DemoGuard } from './components/demos/DemoGuard';
import DentaxyPresentation from './pages/demo/DentaxyPresentation';
import PresentationRemote from './pages/admin/PresentationRemote';
import PresentationEditor from './pages/admin/PresentationEditor';

// Dentaxy Core
import CorePage from './app/core/page';

// Dentaxy Singularity Workspace
import SingularityPage from './app/singularity/page';

// Dentaxy Seed
import SeedLanding from './pages/seed/SeedLanding';
import SeedLogin from './pages/seed/SeedLogin';

// NFC Verificación de Autenticidad
import NFCVerify from './pages/verify/NFCVerify';

// Component to initialize global tracking
const GlobalTracker = () => {
  useGlobalMetrics(); // Initialize all metrics tracking globally
  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdminAuthProvider>
            <GlobalTracker />
            <div translate="no">
              <Toaster richColors position="top-right" />
              <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                  {/* Página de inicio */}
                  <Route path="/" element={<Landing />} />

                  {/* Hub de módulos */}
                  <Route path="/hub" element={<ModulesHub />} />
                  <Route path="/modules" element={<ModulesHub />} />

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

                  {/* Admin Panel */}
                  <Route path="/admin" element={<AdminLoginPage />} />
                  <Route path="/admin/*" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="nexus-intel" element={<AdminNexusIntel />} />
                    <Route path="ecosystem" element={<Ecosystem />} />
                    <Route path="demos" element={<DemoControl />} />
                    <Route path="security" element={<Security />} />
                    <Route path="geomap" element={<GeoMap />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="communication" element={<Communication />} />
                    <Route path="presentation-remote" element={<PresentationRemote />} />
                    <Route path="presentation-editor" element={<PresentationEditor />} />

                    {/* Legacy or Secondary Modules */}
                    <Route path="students" element={<StudentModule />} />
                    <Route path="modules" element={<ModulesManager />} />
                    <Route path="audit" element={<AuditLogs />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Shop - Tienda privada */}
                  <Route path="/shop" element={<ShopLogin />} />
                  <Route path="/shop/tienda" element={
                    <ShopAuthProvider>
                      <Shop />
                    </ShopAuthProvider>
                  } />

                  {/* Redireccion legacy de auth */}
                  <Route path="/auth/*" element={<Navigate to="/hub" replace />} />

                  {/* Demo Académico UAO */}
                  <Route path="/academico" element={<AcademicoDemo />} />
                  <Route path="/academico/:clinicaId" element={<ClinicaView />} />

                  {/* Demo DENTAXY AI — Protegidos por DemoGuard */}
                  <Route path="/demo/ai" element={<DemoGuard moduleName="motor_neuronal"><AIDemo /></DemoGuard>} />
                  <Route path="/demo/dicom" element={<DemoGuard moduleName="dicom"><DICOMDemo /></DemoGuard>} />
                  <Route path="/enterprise" element={<DemoGuard moduleName="enterprise"><EnterpriseDemo /></DemoGuard>} />
                  <Route path="/stark" element={<DemoGuard moduleName="proyecto_stark"><StarkDemo /></DemoGuard>} />
                  <Route path="/demo/presentacion" element={<DemoGuard moduleName="academico_presentacion"><DentaxyPresentation /></DemoGuard>} />

                  {/* Dentaxy Core */}
                  <Route path="/core" element={<CorePage />} />

                  {/* Dentaxy Singularity Workspace */}
                  <Route path="/singularity" element={<SingularityPage />} />

                  {/* Dentaxy Seed */}
                  <Route path="/seed" element={<SeedLogin />} />
                  <Route path="/seed/overview" element={<SeedLanding />} />

                  {/* App - Acceso libre */}
                  <Route path="/app" element={<Index />} />

                  {/* NFC — Verificación de Autenticidad de Documentos */}
                  <Route path="/verify" element={<NFCVerify />} />

                  {/* 404 - No encontrado */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
              <VercelAnalytics />
            </div>
          </AdminAuthProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

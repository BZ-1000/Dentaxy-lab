
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
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
import WaitlistAdmin from './pages/admin/WaitlistAdmin';
import SeedManager from './pages/admin/SeedManager';

// Shop (Tienda privada)
import ShopLogin from './pages/shop/ShopLogin';
import Shop from './pages/shop/Shop';
import { ShopAuthProvider } from './contexts/ShopAuthContext';

// Demo Académico UAO — Fases 1–5
import { AcademicoDemo, ClinicaView } from './pages/academico';
import { DemoProvider } from './pages/academico/context/DemoContext';
import { UaoSandboxProvider } from './pages/academico/context/SandboxContext';
import RolSelectorView from './pages/academico/views/RolSelectorView';
import NodosView from './pages/academico/views/NodosView';
import DirectorView from './pages/academico/views/DirectorView';
import PlaceholderView from './pages/academico/views/PlaceholderView';
import AlumnoView from './pages/academico/views/AlumnoView';
import ExpedienteView from './pages/academico/views/ExpedienteView';
import JefeView from './pages/academico/views/JefeView';
import DocenteView from './pages/academico/views/DocenteView';
import CoordinadorView from './pages/academico/views/CoordinadorView';
import AdministrativoView from './pages/academico/views/AdministrativoView';
import AgendaView from './pages/academico/views/AgendaView';
import PacientePortalView from './pages/academico/views/PacientePortalView';
import ReportesView from './pages/academico/views/ReportesView';
import InventarioView from './pages/academico/views/InventarioView';

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

// Dentaxy Ecosistema (páginas de cada producto)
import LabPage from './pages/ecosystem/LabPage';
import ClubPage from './pages/ecosystem/ClubPage';
import NewsPage from './pages/ecosystem/NewsPage';
import AuraPage from './pages/ecosystem/AuraPage';
import SpacePage from './pages/ecosystem/SpacePage';
import MyLanaPage from './pages/ecosystem/MyLanaPage';

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
                    <Route path="waitlist" element={<WaitlistAdmin />} />
                    <Route path="seed" element={<SeedManager />} />
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

                  {/* Demo Académico UAO Sync — Fase 1-5 Agrupado con DemoProvider único */}
                  <Route path="/academico" element={<DemoProvider><UaoSandboxProvider><Outlet /></UaoSandboxProvider></DemoProvider>}>
                    <Route index element={<AcademicoDemo />} />
                    <Route path="roles" element={<RolSelectorView />} />
                    <Route path="nodos" element={<NodosView />} />
                    <Route path="nodos/:nodoId" element={<NodosView />} />
                    <Route path="nodos/:nodoId/:subId" element={<NodosView />} />
                    <Route path="director" element={<DirectorView />} />
                    <Route path="jefe" element={<JefeView />} />
                    <Route path="coordinador" element={<CoordinadorView />} />
                    <Route path="docente" element={<DocenteView />} />
                    <Route path="alumno" element={<AlumnoView />} />
                    <Route path="alumno/expediente/:id" element={<ExpedienteView />} />
                    <Route path="administrativo" element={<AdministrativoView />} />
                    <Route path="paciente" element={<PacientePortalView />} />
                    <Route path="agenda" element={<AgendaView />} />
                    <Route path="reportes" element={<ReportesView />} />
                    <Route path="inventario" element={<InventarioView />} />
                    {/* Legacy compatibility */}
                    <Route path=":clinicaId" element={<ClinicaView />} />
                  </Route>

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

                  {/* Dentaxy Seed — Landing pública directa, sin código de preventa */}
                  <Route path="/seed" element={<SeedLanding />} />
                  <Route path="/seed/login" element={<SeedLogin />} />

                  {/* Dentaxy Ecosistema — Páginas de cada producto */}
                  <Route path="/lab" element={<LabPage />} />
                  <Route path="/club" element={<ClubPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/aura" element={<AuraPage />} />
                  <Route path="/space" element={<SpacePage />} />
                  <Route path="/mylana" element={<MyLanaPage />} />

                  {/* App - Acceso libre */}
                  <Route path="/app" element={<Index />} />

                  {/* NFC — Verificación de Autenticidad de Documentos */}
                  <Route path="/verify" element={<NFCVerify />} />

                  {/* 404 - No encontrado */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
              <VercelAnalytics />
              <SpeedInsights />
            </div>
          </AdminAuthProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

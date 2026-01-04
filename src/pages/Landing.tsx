import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Calculator, Brain, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Typewriter } from "@/components/ui/typewriter-text";
import { useGlobalMetrics } from '@/hooks/useGlobalMetrics';
import { DockWithContent } from '@/components/ui/interactive-dock-content';
import { CalculatorContent, DemoContent, BenefitsContent } from '@/components/ui/dock-content-sections';
import { EstadisticasContent } from '@/components/ui/dock-sections/EstadisticasContent';

const menuItems = [{
  label: "Nosotros",
  href: "/about"
}, {
  label: "Tecnologías",
  href: "/how-it-works"
}, {
  label: "Beneficios",
  href: "/benefits"
}, {
  label: "Contacto",
  href: "/contact"
}];

const Landing = () => {
  useGlobalMetrics();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>("");
  const isMobile = useIsMobile();

  const handleBetaAccess = () => {
    // Navigate to modules hub with splash screen
    navigate('/hub');
  };

  const handleStartTracking = () => {
    navigate('/app');
  };

  const dockItems = [{
    id: 'estadisticas',
    icon: BarChart3,
    label: "Estadísticas",
    content: <EstadisticasContent onStartTracking={handleStartTracking} />
  }, {
    id: 'calculator',
    icon: Calculator,
    label: "Calculadora ROI",
    content: <CalculatorContent />
  }, {
    id: 'demo',
    icon: Brain,
    label: "Demo de IA",
    content: <DemoContent />
  }, {
    id: 'beta',
    icon: Zap,
    label: "Prueba Beta",
    content: <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Acceso Beta</h3>
          <p className="text-gray-600 mb-6">¿Listo para experimentar el futuro de la redacción clínica?</p>
          <Button onClick={handleBetaAccess} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg">
            <Zap className="h-5 w-5 mr-2" />
            Acceder a Beta
          </Button>
        </div>
  }, {
    id: 'benefits',
    icon: TrendingUp,
    label: "Beneficios",
    content: <BenefitsContent />
  }];

  return <div className="min-h-screen w-full bg-white apple-minimalist">
      {/* Header with logo and navigation */}
      <header className="sticky top-0 bg-white z-50 flex items-center justify-between px-6 py-4 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <img alt="Logo DENTAXY" src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png" className="h-8 w-8" />
          <span className="text-xs font-bold text-gray-700">DENTAXY Technologies</span>
        </div>

        {/* Main horizontal navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map(item => <Link key={item.label} to={item.href} className={`text-gray-700 hover:text-blue-600 transition-colors text-sm ${activeItem === item.label ? 'font-medium' : 'font-normal'}`} onClick={() => setActiveItem(item.label)}>
              {item.label}
            </Link>)}
        </nav>

        {/* CTA Button */}
        <Button onClick={handleBetaAccess} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm">
          Probar Demo
        </Button>
      </header>

      {/* Mobile Menu */}
      {isMobile && <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-around">
            {menuItems.map(item => <Link key={item.label} to={item.href} className={`flex flex-col items-center text-xs ${activeItem === item.label ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => setActiveItem(item.label)}>
                {item.label}
              </Link>)}
          </div>
        </nav>}

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 pt-12 pb-32 max-w-5xl mx-auto py-[4px]">
        <div className="text-center w-full my-[50px]">
          <h1 className="mb-5 font-black text-black text-5xl text-center sm:text-8xl">
            DENTAXY
            <Typewriter text={[".ai", ".com"]} speed={100} deleteSpeed={80} delay={12000} loop={true} className="text-blue-500" />
          </h1>

          <div className="mb-5">
            <p className="inline-block bg-blue-500 text-white text-sm font-base rounded-full mx-0 my-0 px-[20px] py-px">
              Innovación tecnológica odontológica de alto nivel
            </p>
          </div>

          <div className="mb-8">
            <button onClick={handleBetaAccess} className="rounded-full px-[20px] py-[8px] hover:bg-slate-1 text-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-gray-50 flex items-center gap-2 mx-auto">
              EXPLORAR DEMO
              <ArrowRight className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Interactive Dock */}
          <DockWithContent items={dockItems} className="mb-12" />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Column 1 - Company Info */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-2">
                <img alt="Logo" src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png" className="h-8 w-8" />
                <h3 className="text-lg font-semibold text-gray-800">DENTAXY Technologies</h3>
              </div>
              <p className="text-sm text-gray-500">Innovación odontológica mexicana</p>
              <p className="text-xs text-gray-400">© 2025 Dentaxy.ai Todos los derechos reservados.</p>
              <p className="text-xs text-gray-400">© 2025 Dentaxy.com Todos los derechos reservados.</p>
            </div>
            
            {/* Column 2 - Quick Links */}
            <nav>
              <h3 className="text-sm font-medium text-gray-800 mb-4">Enlaces</h3>
              <ul className="space-y-2">
                {menuItems.map(item => <li key={item.label}>
                    <Link to={item.href} className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
                      {item.label}
                    </Link>
                  </li>)}
              </ul>
            </nav>
            
            {/* Column 3 - Legal */}
            <nav>
              <h3 className="text-sm font-medium text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs">Transformando la experiencia odontológica con tecnología de vanguardia</p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Landing;

import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGlobalMetrics } from "@/hooks/useGlobalMetrics";
import { toast } from "sonner";
import { TypewriterSyncProvider } from "@/contexts/TypewriterSyncContext";
import { DentaxyNav } from "@/components/nav/DentaxyNav";
import WaitlistMasterModal from "@/components/waitlist/WaitlistMasterModal";

// Landing sections
import { HeroSection } from "@/components/landing/HeroSection";
import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { MotorNeuronalSection } from "@/components/landing/MotorNeuronalSection";
import { FormulariosSection } from "@/components/landing/FormulariosSection";
import { ModulosSection } from "@/components/landing/ModulosSection";
import { TecnologiasPreviewSection } from "@/components/landing/TecnologiasPreviewSection";
import { CalculatorSection } from "@/components/landing/CalculatorSection";
import { CTASection } from "@/components/landing/CTASection";

const Landing = () => {
  useGlobalMetrics();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const handleBetaAccess = () => {
    navigate("/hub");
  };
  const handleExplore = () => {
    if (mainRef.current) {
      // Scroll to second section (Architecture)
      const sectionHeight = window.innerHeight;
      mainRef.current.scrollTo({
        top: sectionHeight,
        behavior: "smooth"
      });
    }
  };
  const handleRequestDemo = () => {
    setWaitlistOpen(true);
  };
  return <TypewriterSyncProvider>
    <div className="h-screen w-screen max-w-full bg-background flex flex-col overflow-hidden">
      <WaitlistMasterModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      {/* Header — DentaxyNav con mega-menu */}
      <DentaxyNav />

      {/* Main Content - Snap Scroll */}
      <main ref={mainRef} className="flex-1 overflow-y-auto snap-y snap-proximity scroll-smooth">
        <HeroSection onExplore={handleExplore} />
        <ArchitectureSection />
        <MotorNeuronalSection />
        <FormulariosSection />
        <ModulosSection />
        <TecnologiasPreviewSection />
        <CalculatorSection />
        <CTASection onRequestDemo={handleRequestDemo} />

        {/* Footer */}
        <footer className="min-h-[50vh] bg-background py-12 border-t border-border flex items-center w-full">
          <div className="w-full mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Company Info */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-2">
                  <img alt="Logo" src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png" className="h-8 w-8" />
                  <h3 className="text-lg font-semibold text-foreground">DENTAXY Technologies</h3>
                </div>
                <p className="text-sm text-muted-foreground">Innovación odontológica mexicana</p>
                <p className="text-xs text-muted-foreground/70">© 2026 Dentaxy.com Todos los derechos reservados.</p>
                <p className="text-xs text-neutral-600">Founded by Braulio Zavala Uribe</p>
              </div>

              {/* Quick Links */}
              <nav>
                <h3 className="text-sm font-medium text-foreground mb-4">Enlaces</h3>
                <ul className="space-y-2">
                  {[
                    { label: "Shop", href: "/shop", cls: "text-emerald-500 hover:text-emerald-400 font-medium" },
                    { label: "Seed", href: "/seed", cls: "text-blue-500 hover:text-blue-400 font-semibold" },
                    { label: "Nosotros", href: "/about", cls: "text-muted-foreground hover:text-foreground" },
                    { label: "Tecnologías", href: "/how-it-works", cls: "text-muted-foreground hover:text-foreground" },
                    { label: "Beneficios", href: "/benefits", cls: "text-muted-foreground hover:text-foreground" },
                    { label: "Contacto", href: "/contact", cls: "text-muted-foreground hover:text-foreground" },
                  ].map(item => <li key={item.label}>
                    <Link to={item.href} className={`transition-colors text-sm ${item.cls}`}>{item.label}</Link>
                  </li>)}
                </ul>
              </nav>

              {/* Legal */}
              <nav>
                <h3 className="text-sm font-medium text-foreground mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      Términos y Condiciones
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      Política de Privacidad
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="mt-10 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground/70 text-xs">
                Transformando la experiencia odontológica con tecnología de vanguardia
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  </TypewriterSyncProvider>;
};
export default Landing;
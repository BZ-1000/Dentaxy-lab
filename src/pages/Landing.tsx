import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGlobalMetrics } from "@/hooks/useGlobalMetrics";
import { toast } from "sonner";

// Landing sections
import { HeroSection } from "@/components/landing/HeroSection";
import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { MotorNeuronalSection } from "@/components/landing/MotorNeuronalSection";
import { FormulariosSection } from "@/components/landing/FormulariosSection";
import { ModulosSection } from "@/components/landing/ModulosSection";
import { TecnologiasPreviewSection } from "@/components/landing/TecnologiasPreviewSection";
import { CalculatorSection } from "@/components/landing/CalculatorSection";
import { CTASection } from "@/components/landing/CTASection";

const menuItems = [
  { label: "Nosotros", href: "/about" },
  { label: "Tecnologías", href: "/how-it-works" },
  { label: "Beneficios", href: "/benefits" },
  { label: "Contacto", href: "/contact" },
];

const Landing = () => {
  useGlobalMetrics();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const mainRef = useRef<HTMLDivElement>(null);

  const handleBetaAccess = () => {
    navigate("/hub");
  };

  const handleExplore = () => {
    if (mainRef.current) {
      // Scroll to second section (Architecture)
      const sectionHeight = window.innerHeight;
      mainRef.current.scrollTo({ top: sectionHeight, behavior: "smooth" });
    }
  };

  const handleRequestDemo = () => {
    toast.success("¡Solicitud recibida!", {
      description: "Nos pondremos en contacto contigo pronto.",
    });
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <img
            alt="Logo DENTAXY"
            src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png"
            className="h-8 w-8"
          />
          <span className="text-xs font-bold text-foreground">DENTAXY Technologies</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <Button
          onClick={handleBetaAccess}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm"
        >
          Probar Demo
        </Button>
      </header>

      {/* Mobile Menu */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4">
          <div className="flex justify-around">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex flex-col items-center text-xs text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Main Content - Snap Scroll */}
      <main 
        ref={mainRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth"
      >
        <HeroSection onExplore={handleExplore} />
        <ArchitectureSection />
        <MotorNeuronalSection />
        <FormulariosSection />
        <ModulosSection />
        <TecnologiasPreviewSection />
        <CalculatorSection />
        <CTASection onRequestDemo={handleRequestDemo} />

        {/* Footer */}
        <footer className="min-h-[50vh] bg-background py-12 border-t border-border snap-start flex items-center">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Company Info */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-2">
                  <img
                    alt="Logo"
                    src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png"
                    className="h-8 w-8"
                  />
                  <h3 className="text-lg font-semibold text-foreground">DENTAXY Technologies</h3>
                </div>
                <p className="text-sm text-muted-foreground">Innovación odontológica mexicana</p>
                <p className="text-xs text-muted-foreground/70">© 2025 Dentaxy.ai Todos los derechos reservados.</p>
                <p className="text-xs text-muted-foreground/70">© 2025 Dentaxy.com Todos los derechos reservados.</p>
              </div>

              {/* Quick Links */}
              <nav>
                <h3 className="text-sm font-medium text-foreground mb-4">Enlaces</h3>
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Legal */}
              <nav>
                <h3 className="text-sm font-medium text-foreground mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/terms"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      Términos y Condiciones
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
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
  );
};

export default Landing;

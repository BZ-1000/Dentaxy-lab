import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalMetrics } from "@/hooks/useGlobalMetrics";
import { TypewriterSyncProvider } from "@/contexts/TypewriterSyncContext";
import { DentaxyNav } from "@/components/nav/DentaxyNav";
import WaitlistMasterModal from "@/components/waitlist/WaitlistMasterModal";

// Landing sections
import { HeroSection } from "@/components/landing/HeroSection";
import { InsightsSection } from "@/components/landing/InsightsSection";

const Landing = () => {
  useGlobalMetrics();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const handleExplore = () => {
    if (mainRef.current) {
      // Scroll suave a la siguiente sección (Insights)
      const sectionHeight = window.innerHeight;
      mainRef.current.scrollTo({
        top: sectionHeight,
        behavior: "smooth"
      });
    }
  };

  return (
    <TypewriterSyncProvider>
      <div className="h-screen w-screen max-w-full bg-background flex flex-col overflow-hidden">
        <WaitlistMasterModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
        {/* Header — DentaxyNav con mega-menu */}
        <DentaxyNav />

        {/* Main Content - Snap Scroll */}
        <main ref={mainRef} className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth relative">
          <HeroSection onExplore={handleExplore} />
          <InsightsSection mainRef={mainRef} />
        </main>
      </div>
    </TypewriterSyncProvider>
  );
};

export default Landing;
import { useRef } from "react";
import { AcademyNav } from "@/components/nav/AcademyNav";
import { TypewriterSyncProvider } from "@/contexts/TypewriterSyncContext";
import AcademyHeroSection from "@/components/academy/AcademyHeroSection";
import { AcademyInsightsSection } from "@/components/academy/AcademyInsightsSection";

export default function AcademyLanding() {
  const mainRef = useRef<HTMLDivElement>(null);

  const handleExplore = () => {
    if (mainRef.current) {
      const sectionHeight = window.innerHeight;
      mainRef.current.scrollTo({
        top: sectionHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <TypewriterSyncProvider>
      <div className="h-screen w-screen max-w-full bg-background flex flex-col overflow-hidden">
        {/* Header exclusivo de Academy con Supabase Google Auth e instancias aisladas */}
        <AcademyNav />

        {/* Main Content - Snap Scroll 1:1 idéntico al landing principal */}
        <main ref={mainRef} className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth relative">
          <AcademyHeroSection onExplore={handleExplore} />
          <AcademyInsightsSection mainRef={mainRef} />
        </main>
      </div>
    </TypewriterSyncProvider>
  );
}

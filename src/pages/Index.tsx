import HistoriaClinica from "@/components/HistoriaClinica";
import { AppleStyleDock } from "@/components/AppleStyleDock";

const Index = () => {
  return (
    <>
      <HistoriaClinica />
      <AppleStyleDock />
      <div className="h-24" /> {/* Spacer to prevent content from being hidden behind the dock */}
    </>
  );
};

export default Index;
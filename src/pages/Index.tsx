import HistoriaClinica from "@/components/HistoriaClinica";
import BottomMenu from "@/components/BottomMenu";

const Index = () => {
  return (
    <>
      <HistoriaClinica />
      <BottomMenu />
      <div className="h-16" /> {/* Spacer to prevent content from being hidden behind the menu */}
    </>
  );
};

export default Index;
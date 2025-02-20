
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" 
                alt="Logo" 
                className="w-8 h-8"
              />
              <span className="text-white font-semibold text-xl">Dental Basics</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/app">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Iniciar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Background glow effect */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-[1px] h-full bg-gradient-to-b from-blue-500/0 via-blue-500 to-blue-500/0 blur-[2px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Todo en Uno para<br/>
              Historias Clínicas
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12">
              Genera historias clínicas dentales profesionales con IA.<br/>
              Más rápido, más preciso y más eficiente que nunca.
            </p>
            <Link to="/app">
              <Button size="lg" className="bg-white hover:bg-gray-200 text-black font-semibold px-8">
                Pruébalo Gratis →
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature grid */}
        <div className="absolute bottom-0 w-full pb-20 bg-gradient-to-t from-black to-transparent">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Generación con IA</h3>
                <p className="text-gray-400">Genera historias clínicas completas en segundos usando inteligencia artificial avanzada.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Formato Profesional</h3>
                <p className="text-gray-400">Documentos estructurados y profesionales listos para usar en tu práctica dental.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Fácil de Usar</h3>
                <p className="text-gray-400">Interfaz intuitiva diseñada para optimizar tu flujo de trabajo clínico.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

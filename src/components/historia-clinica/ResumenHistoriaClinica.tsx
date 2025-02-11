
import { useTheme } from "@/hooks/use-theme";

interface ResumenHistoriaClinicaProps {
  resumen: string;
}

const ResumenHistoriaClinica = ({ resumen }: ResumenHistoriaClinicaProps) => {
  const { theme } = useTheme();

  if (!resumen) return null;

  // Function to format the text with red color for the note
  const formatText = (text: string) => {
    const parts = text.split(/(Nota: En la familia predominan los antecedentes de:.*\.)/);
    return parts.map((part, index) => {
      if (part.startsWith('Nota: En la familia predominan los antecedentes de:')) {
        return <span key={index} className="text-[#ea384c]">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="mt-8 animate-fade-in">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90 transition-colors duration-200`}>
        <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
          Historia Clínica Generada con IA
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <pre className={`whitespace-pre-line ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg text-sm transition-colors duration-200 text-justify`}>
            {formatText(resumen)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ResumenHistoriaClinica;

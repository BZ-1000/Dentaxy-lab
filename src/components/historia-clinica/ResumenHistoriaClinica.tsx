
import { FormDataState } from "@/types/historiaClinica";
import { useTheme } from "@/hooks/use-theme";

interface ResumenHistoriaClinicaProps {
  open: boolean;
  onClose: () => void;
  formData: FormDataState;
}

const ResumenHistoriaClinica = ({ open, onClose, formData }: ResumenHistoriaClinicaProps) => {
  const { theme } = useTheme();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-[90%] max-w-4xl max-h-[90vh] overflow-auto">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90 transition-colors duration-200`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              Historia Clínica Generada
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cerrar
            </button>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <pre className={`whitespace-pre-line ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg text-sm transition-colors duration-200`}>
              {/* Display the generated content here */}
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenHistoriaClinica;

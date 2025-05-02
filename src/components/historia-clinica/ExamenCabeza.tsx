import React from 'react';
import { FormDataState } from '@/types/historiaClinica';
import { Card } from "@/components/ui/card";

interface VoiceInputProps {
  placeholder: string;
  onTranscription: (text: string) => void;
}

const ExamenCabeza = ({ 
  formData, 
  handleExamenCabezaChange 
}) => {
  // State and handlers for the component
  const handleInputChange = (field, value) => {
    handleExamenCabezaChange(field, value);
  };
  
  // VoiceInput component implementation
  const VoiceInput = ({ placeholder, onTranscription }: VoiceInputProps) => {
    const [isListening, setIsListening] = React.useState(false);
    
    const startListening = () => {
      setIsListening(true);
      // Implementation for speech recognition
      if ('webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'es-ES';
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          onTranscription(transcript);
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      } else {
        alert('Tu navegador no soporta reconocimiento de voz');
        setIsListening(false);
      }
    };
    
    const stopListening = () => {
      setIsListening(false);
      // Stop speech recognition
      if ('webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.stop();
      }
    };
    
    return (
      <div className="flex items-center border rounded-md p-2">
        <input
          type="text"
          placeholder={placeholder}
          className="flex-grow outline-none"
          readOnly
        />
        <button
          onClick={isListening ? stopListening : startListening}
          className={`ml-2 p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        >
          {isListening ? 'Detener' : 'Hablar'}
        </button>
      </div>
    );
  };
  
  return (
    <Card className="p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Examen de Cabeza</h2>
      <p className="text-sm text-gray-500 mb-4">
        Registre los hallazgos del examen de la cabeza del paciente.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Forma de la cabeza</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.examenCabeza?.formaCabeza || ''}
            onChange={(e) => handleInputChange('formaCabeza', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Simetría facial</label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.examenCabeza?.simetriaFacial || ''}
            onChange={(e) => handleInputChange('simetriaFacial', e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="simetrica">Simétrica</option>
            <option value="asimetrica">Asimétrica</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Piel</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            value={formData.examenCabeza?.piel || ''}
            onChange={(e) => handleInputChange('piel', e.target.value)}
            placeholder="Describa color, textura, lesiones, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Cabello</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={2}
            value={formData.examenCabeza?.cabello || ''}
            onChange={(e) => handleInputChange('cabello', e.target.value)}
            placeholder="Describa características del cabello"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Ojos</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            value={formData.examenCabeza?.ojos || ''}
            onChange={(e) => handleInputChange('ojos', e.target.value)}
            placeholder="Describa hallazgos en los ojos"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Nariz</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={2}
            value={formData.examenCabeza?.nariz || ''}
            onChange={(e) => handleInputChange('nariz', e.target.value)}
            placeholder="Describa hallazgos en la nariz"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Oídos</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={2}
            value={formData.examenCabeza?.oidos || ''}
            onChange={(e) => handleInputChange('oidos', e.target.value)}
            placeholder="Describa hallazgos en los oídos"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Usar reconocimiento de voz</label>
          <VoiceInput 
            placeholder="Habla para introducir texto..." 
            onTranscription={(text) => {
              // Handle transcription
              console.log(text);
              handleInputChange('notasAdicionales', text);
            }} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Notas adicionales</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={4}
            value={formData.examenCabeza?.notasAdicionales || ''}
            onChange={(e) => handleInputChange('notasAdicionales', e.target.value)}
            placeholder="Añada cualquier otra observación relevante"
          />
        </div>
      </div>
    </Card>
  );
};

export default ExamenCabeza;

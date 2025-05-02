
import React from 'react';

// Fix the 'expandText' property issue by not assuming it exists on window
const WikiSearch = () => {
  const handleExpandText = (text: string) => {
    // Use a local function instead of window.expandText
    console.log("Text to expand:", text);
    // Implementation of text expansion logic here
  };
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Búsqueda Wiki</h2>
      <p>Componente para búsqueda wiki (en desarrollo)</p>
      <button 
        onClick={() => handleExpandText("Example text")}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Expandir Texto
      </button>
    </div>
  );
};

export default WikiSearch;

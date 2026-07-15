import React, { useRef, useState, useEffect } from 'react';

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string) => void;
  theme: 'dark' | 'light';
}

export default function SignaturePad({ onSignatureChange, theme }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = isDark ? '#ffffff' : '#0f172a'; // Tinta blanca en oscuro, negra en claro
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isDark]);

  const getCoordinates = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in event) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: (event as React.MouseEvent).clientX - rect.left,
        y: (event as React.MouseEvent).clientY - rect.top
      };
    }
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const { x, y } = getCoordinates(event);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!isDrawing) return;
    
    const { x, y } = getCoordinates(event);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveSignature();
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSignatureChange(dataUrl);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onSignatureChange('');
    }
  };

  const padBg = isDark 
    ? 'bg-neutral-950/60 border border-neutral-800' 
    : 'bg-white/60 border border-neutral-200';

  const btnBg = isDark 
    ? 'text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800'
    : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200';

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className={`relative rounded-2xl overflow-hidden touch-none transition-all duration-300 ${padBg}`} style={{ height: '180px' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={180}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
          <span className={`text-xs uppercase tracking-widest font-black ${isDark ? 'text-white' : 'text-neutral-900'}`} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>
            Firma autógrafa aquí
          </span>
        </div>
      </div>
      <div className="flex justify-end">
        <button 
          onClick={clearSignature}
          className={`text-[9px] uppercase tracking-widest font-black px-4 py-2 rounded-xl transition-all duration-300 ${btnBg}`}
          style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}
        >
          Borrar firma
        </button>
      </div>
    </div>
  );
}

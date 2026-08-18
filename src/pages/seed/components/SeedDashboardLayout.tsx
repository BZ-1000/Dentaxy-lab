import React, { useState } from 'react';
import SeedLobbyWidget from './SeedLobbyWidget';
import SeedChatConsole from './SeedChatConsole';
import SeedWhatsAppWidget from './SeedWhatsAppWidget';

export default function SeedDashboardLayout({ 
  activePatient,
  isFolderHovered,
  onFolderHoverChange,
  onOpenFolder,
  onOpenAddPatient,
  isQuestionMode = false,
  setIsQuestionMode,
  questionType = null,
  onConfirmQuestion,
  theme = 'dark',
  onOpenQR,
  isOpenQR = false,
  forceWhiteBg = false
}: { 
  activePatient?: any;
  isFolderHovered?: boolean;
  onFolderHoverChange?: (hovered: boolean) => void;
  onOpenFolder?: (folder: any, rect: DOMRect) => void;
  onOpenAddPatient?: () => void;
  isQuestionMode?: boolean;
  setIsQuestionMode?: (val: boolean) => void;
  questionType?: 'NEW_PATIENT' | 'INIT_EXPEDIENTE' | null;
  onConfirmQuestion?: (type: 'NEW_PATIENT' | 'INIT_EXPEDIENTE') => void;
  theme?: 'dark' | 'light';
  onOpenQR?: (code: string) => void;
  isOpenQR?: boolean;
  forceWhiteBg?: boolean;
}) {
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [isLobbyActive, setIsLobbyActive] = useState(false);

  return (
    <div className="w-full max-w-[98vw] mx-auto px-2 grid grid-cols-1 lg:grid-cols-[340px_1fr_340px] gap-2.5 items-end relative z-20">
      
      {/* Columna Izquierda: Lobby Digital */}
      <div 
        onMouseEnter={() => setHoverLeft(true)}
        onMouseLeave={() => setHoverLeft(false)}
        className={`transition-[filter,opacity,transform] duration-[280ms] ease-out ${
          isQuestionMode ? 'blur-[3px] opacity-85 pointer-events-none' : isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''
        }`}
        style={{
          height: isOpenQR ? '510px' : '340px',
          transform: (hoverLeft || isLobbyActive || isOpenQR) ? 'translateY(0)' : 'translateY(140px)',
          transition: 'transform 0.28s cubic-bezier(0.25,1,0.5,1), filter 0.28s ease, opacity 0.28s ease'
        }}
      >
        <SeedLobbyWidget 
          theme={theme} 
          onActiveChange={setIsLobbyActive} 
          onOpenQR={onOpenQR}
          isOpenQR={isOpenQR}
          onOpenAddPatient={onOpenAddPatient}
        />
      </div>

      {/* Columna Central: Consola de Chat Dentaxy IA */}
      <div
        className={`flex items-end relative w-full ${
          isQuestionMode && questionType === 'NEW_PATIENT' ? 'h-[385px]' : 'h-[340px]'
        } ${isOpenQR ? 'blur-[3px] opacity-85 pointer-events-none' : ''}`}
        style={{ transition: 'height 0.28s cubic-bezier(0.25,1,0.5,1), filter 0.22s ease, opacity 0.22s ease' }}
      >
        <SeedChatConsole 
          activePatient={activePatient} 
          onHoverChange={onFolderHoverChange} 
          onOpenAddPatient={onOpenAddPatient}
          isQuestionMode={isQuestionMode}
          setIsQuestionMode={setIsQuestionMode}
          questionType={questionType}
          onConfirmQuestion={onConfirmQuestion}
          theme={theme}
          forceWhiteBg={forceWhiteBg}
        />
      </div>

      {/* Columna Derecha: WhatsApp Chat & QR Widget para Pacientes */}
      <div 
        onMouseEnter={() => setHoverRight(true)}
        onMouseLeave={() => setHoverRight(false)}
        className={`transition-[filter,opacity,transform] duration-[280ms] ease-out ${
          (isQuestionMode || isOpenQR) ? 'blur-[3px] opacity-85 pointer-events-none' : isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''
        }`}
        style={{
          height: isOpenQR ? '510px' : '340px',
          transform: (hoverRight || isOpenQR) ? 'translateY(0)' : 'translateY(140px)',
          transition: 'transform 0.28s cubic-bezier(0.25,1,0.5,1), filter 0.28s ease, opacity 0.28s ease'
        }}
      >
        <SeedWhatsAppWidget 
          activePatient={activePatient} 
          theme={theme}
          forceWhiteBg={forceWhiteBg || theme === 'light'} 
        />
      </div>

    </div>
  );
}

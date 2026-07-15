import React, { useState } from 'react';
import SeedLobbyWidget from './SeedLobbyWidget';
import SeedChatConsole from './SeedChatConsole';
import SeedEventList from './SeedEventList';

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
  isOpenQR = false
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
        className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isQuestionMode ? 'blur-[3px] opacity-85 pointer-events-none' : isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''}`}
        style={{
          height: isOpenQR ? '510px' : '340px',
          transform: (hoverLeft || isLobbyActive || isOpenQR) ? 'translateY(0)' : 'translateY(140px)'
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
      <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-end relative w-full ${isQuestionMode && questionType === 'NEW_PATIENT' ? 'h-[385px]' : 'h-[340px]'} ${isOpenQR ? 'blur-[3px] opacity-85 pointer-events-none' : ''}`}>
        <SeedChatConsole 
          activePatient={activePatient} 
          onHoverChange={onFolderHoverChange} 
          onOpenAddPatient={onOpenAddPatient}
          isQuestionMode={isQuestionMode}
          setIsQuestionMode={setIsQuestionMode}
          questionType={questionType}
          onConfirmQuestion={onConfirmQuestion}
        />
      </div>

      {/* Columna Derecha: Event List */}
      <div 
        onMouseEnter={() => setHoverRight(true)}
        onMouseLeave={() => setHoverRight(false)}
        className={`h-[340px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${(isQuestionMode || isOpenQR) ? 'blur-[3px] opacity-85 pointer-events-none' : isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''}`}
        style={{
          transform: hoverRight ? 'translateY(0)' : 'translateY(140px)'
        }}
      >
        <SeedEventList />
      </div>

    </div>
  );
}

import React from 'react';

interface EmptyFolderStackProps {
  baseX?: number;
  offsetX?: number;
  baseZ?: number;
  offsetZ?: number;
  rotateY?: number;
  scale?: number;
  mirror?: boolean;
  isRight?: boolean;
}

export default function EmptyFolderStack({
  baseX = -208,
  offsetX = -8,
  baseZ = -20,
  offsetZ = -12,
  rotateY = 83,
  scale = 0.8,
  mirror = false,
  isRight = false,
}: EmptyFolderStackProps) {
  return (
    <>
      {/* Definiciones locales de clipPath únicas */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="folder-back-clip-lateral" clipPathUnits="objectBoundingBox">
            <path d="M 0,1 L 0,0.08 C 0,0.035 0.022,0 0.05,0 L 0.40,0 C 0.44,0 0.46,0.16 0.50,0.16 L 0.95,0.16 C 0.978,0.16 1,0.195 1,0.24 L 1,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {Array.from({ length: 7 }).map((_, i) => {
        // Progresión no lineal para la pila derecha para pegar más la 2da carpeta con la 1ra
        let factorX = i;
        if (isRight) {
          const rightFactors = [-0.08, 0.86, 1.78, 2.8, 3.9, 5.0, 6.0];
          factorX = rightFactors[i];
        }

        const translateX = baseX + factorX * offsetX;
        const translateZ = baseZ + i * offsetZ;
        const transform = `perspective(1500px) translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;

        return (
          <div
            key={`stack-folder-${baseX}-${i}`}
            className={`absolute w-[320px] h-[200px] transition-all duration-500 ease-out seed-folder-stack-item cursor-pointer ${isRight ? 'seed-stack-right' : 'seed-stack-left'}`}
            style={{
              transform,
              borderRadius: '24px',
              transformStyle: 'preserve-3d',
              zIndex: 20 - i, // Las de adelante quedan encima
            }}
          >
            {/* CONTENEDOR 3D RÍGIDO INTERNO (Mueve trasera, papel y delantera juntas en un solo bloque) */}
            <div 
              className="w-full h-full relative seed-folder-block"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* CAPA 1: SOLAPA TRASERA DE LA CARPETA */}
              <div
                className="absolute inset-0 seed-folder-back drop-shadow-sm"
                style={{
                  clipPath: 'url(#folder-back-clip-lateral)',
                  background: 'var(--seed-white-glass-bg)',
                }}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1 1" preserveAspectRatio="none">
                  <path 
                    d="M 0,1 L 0,0.08 C 0,0.035 0.022,0 0.05,0 L 0.40,0 C 0.44,0 0.46,0.16 0.50,0.16 L 0.95,0.16 C 0.978,0.16 1,0.195 1,0.24 L 1,1 Z" 
                    fill="none" 
                    stroke="rgba(255, 255, 255, 0.6)" 
                    strokeWidth="0.015"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              {/* CAPA 2: PAPEL INTERNO TRANSLÚCIDO (Crea volumen y se esconde bajo la pestaña) */}
              <div
                className="absolute left-[12px] right-[12px] top-[44px] bottom-[16px] rounded-xl pointer-events-none"
                style={{
                  transform: 'translate3d(0, 0, 12px)',
                  background: 'rgba(255, 255, 255, 0.20)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: 'inset 0 0 10px rgba(255,255,255,0.2), 0 4px 6px rgba(0,0,0,0.05)',
                  zIndex: 10,
                }}
              />

              {/* LOMO INFERIOR (SPINE) EN 3D PARA VOLUMEN FÍSICO */}
              <div className="seed-folder-spine"></div>

              {/* CAPA 3: SOLAPA DELANTERA (Volumen grueso sólido con CSS 3D shadows) */}
              <div
                className="absolute top-[56px] left-0 right-0 bottom-0 z-20 seed-folder-front"
                style={{
                  background: 'var(--seed-white-glass-front)',
                  transform: 'translate3d(0, 0, 24px)',
                  transformStyle: 'preserve-3d',
                  borderRadius: '16px 16px 0 0',
                  borderTop: '1.5px solid rgba(255,255,255,0.6)',
                  borderLeft: '1.5px solid rgba(255,255,255,0.4)',
                  borderRight: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '-4px 4px 10px rgba(0,0,0,0.1), inset 2px 2px 5px rgba(255,255,255,0.3)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.08] to-white/[0.22] pointer-events-none rounded-t-[16px] z-10"></div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

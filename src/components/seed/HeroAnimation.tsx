import React, { useState, useEffect } from 'react';
import styles from './HeroAnimation.module.css';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { AnalysisModeProvider } from '@/contexts/AnalysisModeContext';
import { DentaxyFormPanel } from '@/components/academico/DentaxyFormPanel';

interface HeroAnimationProps {
  dienteImg?: string;
  manoHumanaImg: string;
  manoRobotImg: string;
  className?: string;
}

/**
 * HeroAnimation — Rediseño v4 del Hero de DentaXy Seed
 * 
 * Corrección de tamaño y proporciones:
 * - Las imágenes de manos toman todo el ancho y alto del contenedor del título (1920x1080 canvas original)
 *   y usan `object-fit: cover` para alinearse perfectamente y encontrarse en el centro.
 * - El div con la atmósfera de glow neón se ajusta al fondo completo.
 * - El demo se asoma perfectamente por debajo del fold (h-[88vh] en el title component).
 */
export default function HeroAnimation({
  manoHumanaImg,
  manoRobotImg,
  className,
}: HeroAnimationProps) {
  const [fase, setFase] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setFase(1), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* ── 1. NAVBAR SUPERIOR (Z:30) ── */}
      <nav className={styles.navbar}>
        <div className={styles.navLinks}>
          <a href="#que-es" className={styles.navLink}>QUE ES</a>
          <a href="#software" className={styles.navLink}>SOFTWARE</a>
          <a href="#como-funciona" className={styles.navLink}>COMO FUNCIONA</a>
          <a href="#google" className={styles.navLink}>GOOGLE</a>
          <a href="#privacidad" className={styles.navLink}>PRIVACIDAD</a>
        </div>
      </nav>

      {/* ── 2. CONTENEDOR 3D SCROLL ANIMATION (Aceternity) ── */}
      <ContainerScroll
        titleComponent={
          <div className="relative w-full h-[88vh] flex flex-col justify-center items-center overflow-visible select-none">
            {/* ── EFECTO LUMÍNICO NEÓN DUAL (Encima de negro, debajo de imágenes/texto) ── */}
            <div className={styles.neonGlowAtmosphere} />

            {/* ── ALIGNMENT WRAPPER: Mantiene la proporción 16:9 ── */}
            <div className={styles.alignmentWrapper}>
              {/* Título Monumental detrás de las manos */}
              <div className={styles.centralTitleWrapper}>
                <h1 className={styles.mainTitle}>DENTAXY</h1>
                <div className={styles.subTitle}>SEED</div>
              </div>

              {/* Manos (1920x1080 original) proporcionales al texto */}
              <img
                src={manoHumanaImg}
                alt="Mano Humana"
                className={styles.handHuman}
              />
              <img
                src={manoRobotImg}
                alt="Mano Robótica"
                className={styles.handRobot}
              />
            </div>
          </div>
        }
      >
        {/* El Demo clínico completo que rotará y se expandirá */}
        <AnalysisModeProvider>
          <div className="w-full h-full bg-background relative z-10 select-text">
            <DentaxyFormPanel />
          </div>
        </AnalysisModeProvider>
      </ContainerScroll>
    </div>
  );
}

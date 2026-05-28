import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
 * HeroAnimation — Rediseño v4 del Hero de DentaXy Seed con Animaciones de Entrada
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
      <motion.nav 
        className={styles.navbar}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo Dentaxy Technologies */}
        <a href="/" className={styles.navLogo}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <img
              src="/Seed/diente.png"
              alt="Dentaxy"
              className="h-8 w-8"
            />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-black tracking-tight text-white transition-colors">
              DENTAXY
            </span>
            <span className="text-[9px] font-medium text-gray-400 tracking-widest uppercase">
              Technologies
            </span>
          </div>
        </a>

        {/* Enlaces centrales */}
        <div className={styles.navLinks}>
          <a href="#que-es" className={styles.navLink}>QUE ES</a>
          <a href="#software" className={styles.navLink}>SOFTWARE</a>
          <a href="#como-funciona" className={styles.navLink}>COMO FUNCIONA</a>
          <a href="#google" className={styles.navLink}>GOOGLE</a>
          <a href="#privacidad" className={styles.navLink}>PRIVACIDAD</a>
        </div>

        {/* Botones Iniciar Sesión / Obtener Seed */}
        <div className={styles.navActions}>
          <a
            href="/seed/login"
            className={styles.navBtnLogin}
          >
            INICIAR SESIÓN
          </a>
          <a
            href="/seed/login"
            className={styles.navBtnGet}
          >
            <span className={styles.navBtnGetText}>OBTENER SEED</span>
          </a>
        </div>
      </motion.nav>

      {/* ── 2. CONTENEDOR 3D SCROLL ANIMATION (Aceternity) ── */}
      <ContainerScroll
        titleComponent={
          <div className="relative w-full h-[88vh] flex flex-col justify-center items-center overflow-visible select-none pointer-events-none">
            {/* ── EFECTO LUMÍNICO NEÓN DUAL (Encima de negro, debajo de imágenes/texto) ── */}
            <motion.div 
              className={styles.neonGlowAtmosphere}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              transition={{ delay: 1.5, duration: 4.0, ease: 'easeOut' }}
            />

            {/* ── ALIGNMENT WRAPPER: Mantiene la proporción 16:9 ── */}
            <div className={styles.alignmentWrapper} style={{ isolation: 'isolate' }}>
              
              {/* CAPA 1: TEXTO DENTAXY SEED (SIEMPRE DETRÁS) */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
                <div className={styles.centralTitleWrapper}>
                  <motion.h1 
                    className={styles.mainTitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 4, ease: "easeInOut" }}
                  >
                    DENTAXY
                  </motion.h1>
                  <div className={styles.subTitle}>
                    {"SEED".split("").map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + (index * 0.15), duration: 0.1 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CAPA 2: MANOS (SIEMPRE AL FRENTE) */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
                {/* Mano Humana (Base sólida sin sombra) */}
                <motion.img
                  src={manoHumanaImg}
                  alt="Mano Humana"
                  className={styles.handHumanBase}
                  initial={{ x: "-30vw", opacity: 0, y: "-12%", scale: 0.75 }}
                  animate={{ x: "0vw", opacity: 1, y: "-12%", scale: 1 }}
                  transition={{ delay: 1.5, duration: 2.8, ease: 'easeOut' }}
                />
                {/* Mano Humana (Capa de Sombra Enmascarada) */}
                <motion.img
                  src={manoHumanaImg}
                  alt=""
                  aria-hidden="true"
                  className={styles.handHumanShadow}
                  initial={{ x: "-30vw", opacity: 0, y: "-12%", scale: 0.75 }}
                  animate={{ x: "0vw", opacity: 1, y: "-12%", scale: 1 }}
                  transition={{ delay: 1.5, duration: 2.8, ease: 'easeOut' }}
                />

                {/* Mano Robótica (Base sólida sin sombra) */}
                <motion.img
                  src={manoRobotImg}
                  alt="Mano Robótica"
                  className={styles.handRobotBase}
                  initial={{ x: "30vw", opacity: 0, y: "-12%", scale: 0.75 }}
                  animate={{ x: "0vw", opacity: 1, y: "-12%", scale: 1 }}
                  transition={{ delay: 1.5, duration: 2.8, ease: 'easeOut' }}
                />
                {/* Mano Robótica (Capa de Sombra Enmascarada) */}
                <motion.img
                  src={manoRobotImg}
                  alt=""
                  aria-hidden="true"
                  className={styles.handRobotShadow}
                  initial={{ x: "30vw", opacity: 0, y: "-12%", scale: 0.75 }}
                  animate={{ x: "0vw", opacity: 1, y: "-12%", scale: 1 }}
                  transition={{ delay: 1.5, duration: 2.8, ease: 'easeOut' }}
                />
              </div>

            </div>
          </div>
        }
      >
        {/* El Demo clínico completo que rotará y se expandirá */}
        <div 
          className="w-full h-full relative z-50 pointer-events-auto"
          style={{ pointerEvents: 'auto' }}
        >
          <AnalysisModeProvider>
            <div className="w-full h-full bg-background relative z-50 select-text pointer-events-auto" style={{ pointerEvents: 'auto' }}>
              <DentaxyFormPanel />
            </div>
          </AnalysisModeProvider>
        </div>
      </ContainerScroll>
    </div>
  );
}

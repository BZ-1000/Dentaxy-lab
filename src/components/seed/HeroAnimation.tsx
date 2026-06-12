import React from 'react';
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
 */
export default function HeroAnimation({
  manoHumanaImg,
  manoRobotImg,
  className,
}: HeroAnimationProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const yHumana = isMobile ? '3%' : '-5%';
  
  const xRobotInitial = isMobile ? '60vw' : '50vw';
  const xRobotAnimate = isMobile ? '34vw' : '28vw';
  const yRobot = isMobile ? '-2%' : '-12%';
  const scaleRobotInitial = isMobile ? 0.65 : 0.75;
  const scaleRobotAnimate = isMobile ? 0.85 : 1;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* ── 1. NAVBAR SUPERIOR (Z:30) ── */}
      <motion.nav 
        className={styles.navbar}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo Dentaxy Technologies con efecto hover zoom ultra-rápido */}
        <motion.a 
          href="/" 
          className={styles.navLogo}
          whileHover={{ scale: 1.06 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 28,
          }}
        >
          <div>
            <img
              src="/Seed/diente.png"
              alt="Dentaxy"
              className="h-8 w-8 shrink-0 object-contain"
              decoding="async"
              loading="eager"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-black tracking-tight text-white transition-colors">
              DENTAXY
            </span>
            <span className="text-[9px] font-medium text-gray-400 tracking-widest uppercase">
              Technologies
            </span>
          </div>
        </motion.a>

        {/* Enlaces centrales con efecto hover zoom individual ultra-rápido */}
        <div className={styles.navLinks}>
          <motion.a 
            href="#que-es" 
            className={styles.navLink}
            whileHover={{ scale: 1.06 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 28,
            }}
          >
            QUE ES
          </motion.a>
          <motion.a 
            href="#software" 
            className={styles.navLink}
            whileHover={{ scale: 1.06 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 28,
            }}
          >
            SOFTWARE
          </motion.a>
          <motion.a 
            href="#como-funciona" 
            className={styles.navLink}
            whileHover={{ scale: 1.06 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 28,
            }}
          >
            COMO FUNCIONA
          </motion.a>
          <motion.a 
            href="#google" 
            className={styles.navLink}
            whileHover={{ scale: 1.06 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 28,
            }}
          >
            GOOGLE
          </motion.a>
          <motion.a 
            href="#privacidad" 
            className={styles.navLink}
            whileHover={{ scale: 1.06 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 28,
            }}
          >
            PRIVACIDAD
          </motion.a>
        </div>

        {/* Botones Iniciar Sesión / Obtener Seed con efecto hover zoom individual ultra-rápido */}
        <div className={styles.navActions}>
          <motion.a
            href="/seed/login"
            className={styles.navBtnLogin}
            whileHover={{ scale: 1.06 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 28,
            }}
          >
            INICIAR SESIÓN
          </motion.a>
          <motion.a
            href="/seed/login"
            className={styles.navBtnGet}
            whileHover={{ scale: 1.06 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 28,
            }}
          >
            <span className={styles.navBtnGetText}>OBTENER SEED</span>
          </motion.a>
        </div>
      </motion.nav>

      {/* ── 2. CONTENEDOR 3D SCROLL ANIMATION (Aceternity) ── */}
      <ContainerScroll
        titleComponent={
          <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[88vh] flex flex-col justify-center items-center overflow-visible select-none pointer-events-none">
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
                  
                  {/* DENTAXY estático */}
                  <div style={{ pointerEvents: 'auto', width: 'fit-content', margin: '0 auto' }}>
                    <motion.h1 
                      className={styles.mainTitle}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5, duration: 4, ease: "easeInOut" }}
                      style={{ margin: 0 }}
                    >
                      DENTAXY
                    </motion.h1>
                  </div>

                  {/* SEED estático */}
                  <div style={{ pointerEvents: 'auto', width: 'fit-content', margin: '0 auto' }}>
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
              </div>

              {/* CAPA 2: MANOS (SIEMPRE AL FRENTE) */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>

                {/* Mano Humana — Base sólida */}
                <motion.img
                  src={manoHumanaImg}
                  alt="Mano Humana"
                  className={styles.handHumanBase}
                  initial={{ x: "-30vw", opacity: 0, y: yHumana, scale: 0.75 }}
                  animate={{ x: "-2vw", opacity: 1, y: yHumana, scale: 1 }}
                  transition={{ delay: 1.5, duration: 2.8, ease: 'easeOut' }}
                  decoding="async"
                  loading="eager"
                />
                {/* Mano Humana — Capa de Sombra Enmascarada */}
                <motion.img
                  src={manoHumanaImg}
                  alt=""
                  aria-hidden="true"
                  className={styles.handHumanShadow}
                  initial={{ x: "-30vw", opacity: 0, y: yHumana, scale: 0.75 }}
                  animate={{ x: "-2vw", opacity: 1, y: yHumana, scale: 1 }}
                  transition={{ delay: 1.5, duration: 2.8, ease: 'easeOut' }}
                  decoding="async"
                  loading="eager"
                />

                {/* Mano Robótica — Base sólida */}
                <motion.img
                  src={manoRobotImg}
                  alt="Mano Robótica"
                  className={styles.handRobotBase}
                  initial={{ x: xRobotInitial, opacity: 0, y: yRobot, scale: scaleRobotInitial }}
                  animate={{ x: xRobotAnimate, opacity: 1, y: yRobot, scale: scaleRobotAnimate }}
                  transition={{ delay: 1.5, duration: 2.8, ease: 'easeOut' }}
                  decoding="async"
                  loading="eager"
                />
                {/* Mano Robótica — Capa de Sombra Enmascarada */}
                <motion.img
                  src={manoRobotImg}
                  alt=""
                  aria-hidden="true"
                  className={styles.handRobotShadow}
                  initial={{ x: xRobotInitial, opacity: 0, y: yRobot, scale: scaleRobotInitial }}
                  animate={{ x: xRobotAnimate, opacity: 1, y: yRobot, scale: scaleRobotAnimate }}
                  transition={{ delay: 1.5, duration: 2.8, ease: 'easeOut' }}
                  decoding="async"
                  loading="eager"
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
              <DentaxyFormPanel disableProgressLineAnimation={true} />
            </div>
          </AnalysisModeProvider>
        </div>
      </ContainerScroll>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

interface ShaderSplashProps {
  onComplete: () => void;
}

export function ShaderSplash({ onComplete }: ShaderSplashProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "DENTAXY";
  const subText = "TECHNOLOGIES";

  const sceneRef = useRef<{
    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    uniforms: any;
    animationId: number;
  } | null>(null);

  // Initialize Three.js shader
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;
        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }
        gl_FragColor = vec4(color[0],color[1],color[2],1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    };

    animate();

    const textTimer = setTimeout(() => setShowText(true), 300);

    return () => {
      clearTimeout(textTimer);
      window.removeEventListener("resize", onWindowResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!showText) return;

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setShowCursor(false);
          setTimeout(() => onComplete(), 800);
        }, 600);
      }
    }, 120);

    return () => clearInterval(typeInterval);
  }, [showText, onComplete]);

  return (
    <div className="fixed inset-0 z-[100000]">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{
          background: "#000",
          overflow: "hidden",
        }}
      />
      
      {/* Futuristic overlay text */}
      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center relative">
              {/* Glowing backdrop */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 -z-10"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(0, 255, 255, 0.15) 0%, transparent 70%)",
                  filter: "blur(40px)",
                  transform: "scale(2)",
                }}
              />
              
              {/* Main title with futuristic styling */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Decorative lines top */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex items-center justify-center gap-4 mb-4"
                >
                  <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent via-cyan-400 to-cyan-400" />
                  <div className="w-2 h-2 rotate-45 border border-cyan-400 bg-cyan-400/20" />
                  <div className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent via-cyan-400 to-cyan-400" />
                </motion.div>

                {/* DENTAXY text */}
                <h1 
                  className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[0.2em] md:tracking-[0.3em] relative"
                  style={{
                    fontFamily: "'Orbitron', 'Rajdhani', 'Share Tech Mono', monospace",
                    background: "linear-gradient(180deg, #ffffff 0%, #00d4ff 50%, #0099cc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 40px rgba(0, 212, 255, 0.5)",
                    filter: "drop-shadow(0 0 20px rgba(0, 212, 255, 0.3))",
                  }}
                >
                  {displayedText.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.1 }}
                      className="inline-block"
                      style={{
                        textShadow: "0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.4)",
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {showCursor && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      className="inline-block w-[3px] md:w-[4px] h-[0.8em] ml-2 align-middle"
                      style={{
                        background: "linear-gradient(180deg, #00ffff 0%, #0099cc 100%)",
                        boxShadow: "0 0 10px #00ffff, 0 0 20px #00ffff",
                      }}
                    />
                  )}
                </h1>

                {/* TECHNOLOGIES subtitle */}
                <motion.div
                  initial={{ opacity: 0, letterSpacing: "0.5em" }}
                  animate={{ opacity: 1, letterSpacing: "0.4em" }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mt-4 md:mt-6"
                >
                  <span 
                    className="text-xs md:text-sm lg:text-base font-medium tracking-[0.4em]"
                    style={{
                      fontFamily: "'Share Tech Mono', 'Rajdhani', monospace",
                      color: "rgba(0, 212, 255, 0.8)",
                      textShadow: "0 0 10px rgba(0, 212, 255, 0.5)",
                    }}
                  >
                    {subText}
                  </span>
                </motion.div>

                {/* Decorative lines bottom */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex items-center justify-center gap-2 mt-6"
                >
                  <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-cyan-400/50" />
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="w-1 h-1 bg-cyan-400 rounded-full"
                        style={{ boxShadow: "0 0 6px #00ffff" }}
                      />
                    ))}
                  </div>
                  <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-cyan-400/50" />
                </motion.div>

                {/* Scanning line effect */}
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.6), transparent)",
                    boxShadow: "0 0 10px rgba(0, 255, 255, 0.8)",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

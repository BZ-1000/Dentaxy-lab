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
                  background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%)",
                  filter: "blur(60px)",
                  transform: "scale(2.5)",
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
                  <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent via-cyan-400/80 to-cyan-300" style={{ boxShadow: "0 0 10px rgba(0,255,255,0.5)" }} />
                  <motion.div 
                    animate={{ 
                      boxShadow: [
                        "0 0 8px rgba(0,200,255,0.8), 0 0 16px rgba(0,150,255,0.5)",
                        "0 0 15px rgba(0,200,255,1), 0 0 25px rgba(0,150,255,0.7)",
                        "0 0 8px rgba(0,200,255,0.8), 0 0 16px rgba(0,150,255,0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rotate-45 border border-cyan-300"
                    style={{ 
                      background: "linear-gradient(135deg, rgba(0,200,255,0.6), rgba(0,100,200,0.8))",
                    }} 
                  />
                  <div className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent via-cyan-400/80 to-cyan-300" style={{ boxShadow: "0 0 10px rgba(0,255,255,0.5)" }} />
                </motion.div>

                {/* DENTAXY text - LED white glow */}
                <h1 
                  className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[0.2em] md:tracking-[0.3em] relative"
                  style={{
                    fontFamily: "'Orbitron', 'Rajdhani', 'Share Tech Mono', monospace",
                    color: "#ffffff",
                    textShadow: `
                      0 0 10px rgba(255, 255, 255, 1),
                      0 0 20px rgba(255, 255, 255, 0.9),
                      0 0 40px rgba(255, 255, 255, 0.7),
                      0 0 80px rgba(255, 255, 255, 0.5),
                      0 0 120px rgba(255, 255, 255, 0.3)
                    `,
                  }}
                >
                  {displayedText.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 1.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                  {showCursor && (
                    <motion.span
                      animate={{ opacity: [1, 0.3] }}
                      transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
                      className="inline-block w-[4px] md:w-[5px] h-[0.8em] ml-2 align-middle bg-white"
                      style={{
                        boxShadow: "0 0 15px #fff, 0 0 30px #fff, 0 0 45px rgba(255,255,255,0.5)",
                      }}
                    />
                  )}
                </h1>

                {/* TECHNOLOGIES subtitle - softer white */}
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
                      color: "rgba(255, 255, 255, 0.9)",
                      textShadow: "0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.3)",
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
                  <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-amber-400/60" style={{ boxShadow: "0 0 6px rgba(255,180,0,0.4)" }} />
                  <div className="flex gap-1.5">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: 1,
                          boxShadow: [
                            "0 0 8px rgba(255,200,0,0.8), 0 0 16px rgba(255,150,0,0.5)",
                            "0 0 12px rgba(255,200,0,1), 0 0 24px rgba(255,150,0,0.7)",
                            "0 0 8px rgba(255,200,0,0.8), 0 0 16px rgba(255,150,0,0.5)"
                          ]
                        }}
                        transition={{ 
                          scale: { delay: 0.6 + i * 0.1 },
                          boxShadow: { duration: 1.5, repeat: Infinity, delay: i * 0.2 }
                        }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ 
                          background: "linear-gradient(135deg, #ffd700, #ff9500)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-amber-400/60" style={{ boxShadow: "0 0 6px rgba(255,180,0,0.4)" }} />
                </motion.div>

                {/* Scanning line effect - white */}
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.9)",
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

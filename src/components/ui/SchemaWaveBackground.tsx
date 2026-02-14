import React, { useEffect, useRef } from 'react';

interface SchemaWaveBackgroundProps {
    color?: string; // RGB format: "r,g,b"
}

export function SchemaWaveBackground({ color = "79,70,229" }: SchemaWaveBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const colorRef = useRef(color);
    const prevColorRef = useRef(color);
    const progressRef = useRef(1); // 0 to 1, 1 means transition complete

    // Update refs when color prop changes
    useEffect(() => {
        if (color !== colorRef.current) {
            prevColorRef.current = colorRef.current;
            colorRef.current = color;
            progressRef.current = 0; // Reset progress to start animation
        }
    }, [color]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let time = 0;
        let animationFrameId: number;

        const waveData = Array.from({ length: 8 }).map(() => ({
            value: Math.random() * 0.5 + 0.1,
            targetValue: Math.random() * 0.5 + 0.1,
            speed: Math.random() * 0.02 + 0.01
        }));

        function resizeCanvas() {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        }

        function updateWaveData() {
            waveData.forEach(data => {
                if (Math.random() < 0.01) data.targetValue = Math.random() * 0.7 + 0.1;
                const diff = data.targetValue - data.value;
                data.value += diff * data.speed;
            });
        }

        function draw() {
            if (!canvas || !ctx) return;

            // Clear with black
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update transition progress
            if (progressRef.current < 1) {
                progressRef.current += 0.005; // Slower wipe
                if (progressRef.current > 1) progressRef.current = 1;
            }

            // Create Gradient Wipe
            // The gradient moves from left to right.
            // 0 -> progress: New Color
            // progress -> 1: Old Color
            // Actually, usually a wipe replaces old with new. Let's say New comes from Left.
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

            // We want a smooth but distinct transition.
            // Define stops.
            // If progress is 0.5, we want left half new, right half old.
            const p = progressRef.current;

            // New Color (Current)
            gradient.addColorStop(0, `rgba(${colorRef.current}, 0.6)`);
            if (p > 0) {
                gradient.addColorStop(Math.max(0, p - 0.1), `rgba(${colorRef.current}, 0.6)`);
            }

            // Transition zone logic (simple wipe)
            if (p < 1) {
                gradient.addColorStop(Math.min(1, p + 0.1), `rgba(${prevColorRef.current}, 0.6)`);
                gradient.addColorStop(1, `rgba(${prevColorRef.current}, 0.6)`);
            } else {
                gradient.addColorStop(1, `rgba(${colorRef.current}, 0.6)`);
            }

            waveData.forEach((data, i) => {
                const freq = data.value * 7;
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x++) {
                    const nx = (x / canvas.width) * 2 - 1;
                    const px = nx + i * 0.04 + freq * 0.03;
                    const py = Math.sin(px * 10 + time) * Math.cos(px * 2) * freq * 0.1 * ((i + 1) / 8);
                    const y = (py + 1) * canvas.height / 2;
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }

                ctx.lineWidth = 1 + i * 0.3;
                ctx.strokeStyle = gradient; // Apply the gradient stroke

                // Shadow needs to be a solid color, harder to gradient. 
                // We'll trust the stroke gradient to carry the effect, 
                // or assume shadow is less critical to transition. 
                // Let's use the current color for shadow as it dominates.
                ctx.shadowColor = `rgba(${colorRef.current}, 0.5)`;
                ctx.shadowBlur = 5;
                ctx.stroke();
                ctx.shadowBlur = 0;
            });
        }

        function animate() {
            time += 0.002; // Much slower waves
            updateWaveData();
            draw();
            animationFrameId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // Empty deps because we use refs for colors to avoid re-binding loop

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" />;
}

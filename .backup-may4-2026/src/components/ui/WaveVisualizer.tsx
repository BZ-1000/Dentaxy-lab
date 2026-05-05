import React, { useEffect, useRef } from 'react';

interface WaveVisualizerProps {
    accentColor: string; // Hex color like "#A855F7"
    intensity?: number; // 0-1, default 1
}

export const WaveVisualizer: React.FC<WaveVisualizerProps> = ({
    accentColor,
    intensity = 1
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let time = 0;
        let animationFrameId: number;

        // Parse hex color to RGB
        const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16),
                }
                : { r: 168, g: 85, b: 247 }; // Default violet
        };

        const baseColor = hexToRgb(accentColor);

        // Initialize wave data
        const waveData = Array.from({ length: 8 }).map(() => ({
            value: Math.random() * 0.5 + 0.1,
            targetValue: Math.random() * 0.5 + 0.1,
            speed: Math.random() * 0.02 + 0.01,
        }));

        function resizeCanvas() {
            if (!canvas) return;
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
            }
        }

        function updateWaveData() {
            waveData.forEach((data) => {
                if (Math.random() < 0.01) {
                    data.targetValue = Math.random() * 0.7 + 0.1;
                }
                const diff = data.targetValue - data.value;
                data.value += diff * data.speed;
            });
        }

        function draw() {
            if (!ctx || !canvas) return;

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            waveData.forEach((data, i) => {
                const freq = data.value * 7 * intensity;
                ctx.beginPath();

                for (let x = 0; x < canvas.width; x++) {
                    const nx = (x / canvas.width) * 2 - 1;
                    const px = nx + i * 0.04 + freq * 0.03;
                    const py =
                        Math.sin(px * 10 + time) *
                        Math.cos(px * 2) *
                        freq *
                        0.1 *
                        ((i + 1) / 8);
                    const y = (py + 1) * (canvas.height / 2);

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                const waveIntensity = Math.min(1, freq * 0.3);
                const r = baseColor.r + waveIntensity * (255 - baseColor.r) * 0.3;
                const g = baseColor.g + waveIntensity * (255 - baseColor.g) * 0.3;
                const b = baseColor.b;

                ctx.lineWidth = 1 + i * 0.3;
                ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`;
                ctx.shadowColor = `rgba(${r},${g},${b},0.5)`;
                ctx.shadowBlur = 5;
                ctx.stroke();
                ctx.shadowBlur = 0;
            });
        }

        function animate() {
            time += 0.02;
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
    }, [accentColor, intensity]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: 'block' }}
        />
    );
};

import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface SectionTarget {
    id: string;
    nombre: string;
}

interface GenerationProgress {
    current: number;
    total: number;
    currentSection: string;
    percentage: number;
}

export const useGenerarTodasRedacciones = (sections: SectionTarget[], onComplete?: () => void) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState<GenerationProgress | null>(null);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const generarTodo = useCallback(async () => {
        setIsGenerating(true);
        setProgress({ current: 0, total: sections.length, currentSection: '', percentage: 0 });

        let processedCount = 0;
        const total = sections.length;

        try {
            toast({
                title: "Iniciando generación automática",
                description: "Clickendo botones mágicamente...",
            });

            for (const section of sections) {
                setProgress({
                    current: processedCount + 1,
                    total,
                    currentSection: section.nombre,
                    percentage: Math.round(((processedCount) / total) * 100)
                });

                // 1. Find the section container
                // We look for div[data-section="{id}"] as defined in DentaxyFormPanel
                const sectionContainer = document.querySelector(`div[data-section="${section.id}"]`);

                if (sectionContainer) {
                    // Scroll to section for visual feedback
                    sectionContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // 2. Find the "Generar Redacción IA" button within this section
                    // We search for buttons that contain the specific text or have specific classes/attributes
                    // Based on PadecimientoActual.tsx, buttons often have "Generar Redacción IA" text
                    const buttons = Array.from(sectionContainer.querySelectorAll('button'));
                    // Update search strategy:
                    // 1. Text content "Generar Redacción"
                    // 2. Text content "Redactar"
                    // 3. Or just the last primary button in the section if it has a wand icon? (Too risky)
                    // Let's stick to text but broaden it.
                    const generateButton = buttons.find(btn => {
                        const text = btn.textContent?.toLowerCase() || '';
                        return text.includes('generar redacción') ||
                            text.includes('redactar') ||
                            text.includes('generar');
                    });

                    if (generateButton) {
                        // Click it!
                        (generateButton as HTMLButtonElement).click();

                        // Wait for the "writing" effect to happen
                        // The Typewriter effect usually takes some time, plus some buffer
                        await delay(2500);
                    } else {
                        console.warn(`No generation button found for section: ${section.nombre}`);
                        // Maybe it's already generated or hidden?
                    }
                } else {
                    console.warn(`Container not found for section: ${section.id}`);
                }

                processedCount++;
                setProgress(prev => ({ ...prev!, percentage: Math.round((processedCount / total) * 100) }));

                // Small pause between sections
                await delay(500);
            }

            toast({
                title: "¡Generación Completa!",
                description: "Todas las secciones han sido procesadas.",
            });

            if (onComplete) {
                onComplete();
            }

        } catch (error) {
            console.error("Error during auto-generation:", error);
            toast({
                title: "Error",
                description: "Hubo un problema durante la generación automática.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
            setProgress(null);
        }
    }, [sections, onComplete]);

    return {
        isGenerating,
        progress,
        generarTodo
    };
};

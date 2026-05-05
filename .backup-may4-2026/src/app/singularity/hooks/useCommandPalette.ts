import { useEffect } from 'react';
import { useSingularityStore } from '../store/useSingularityStore';

export function useCommandPalette() {
    const { commandPaletteOpen, setCommandPaletteOpen, openWindow, setTheme } = useSingularityStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+K o Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(!commandPaletteOpen);
            }
            // ESC cierra
            if (e.key === 'Escape' && commandPaletteOpen) {
                setCommandPaletteOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [commandPaletteOpen, setCommandPaletteOpen]);

    return { commandPaletteOpen, setCommandPaletteOpen, openWindow, setTheme };
}

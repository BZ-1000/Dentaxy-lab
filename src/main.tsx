import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// --- DENTAXY OFFLINE-FIRST FONTS ---
import '@fontsource/m-plus-1p/100.css';
import '@fontsource/m-plus-1p/300.css';
import '@fontsource/m-plus-1p/400.css';
import '@fontsource/m-plus-1p/500.css';
import '@fontsource/m-plus-1p/700.css';
import '@fontsource/m-plus-1p/800.css';
import '@fontsource/m-plus-1p/900.css';

import '@fontsource/m-plus-rounded-1c/300.css';
import '@fontsource/m-plus-rounded-1c/400.css';
import '@fontsource/m-plus-rounded-1c/500.css';
import '@fontsource/m-plus-rounded-1c/700.css';

import '@fontsource/knewave/400.css';

import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/syne/400.css';
import '@fontsource/syne/600.css';
import '@fontsource/syne/700.css';
import '@fontsource/syne/800.css';

import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';

import './index.css'
// --- PERFORMANCE MONITORING (START) ---
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 100) {
                console.warn(`⚠️ Tarea larga detectada: ${Math.round(entry.duration)}ms`, entry);
            }
        }
    });
    observer.observe({ entryTypes: ['longtask'] });
}
// --- PERFORMANCE MONITORING (END) ---


createRoot(document.getElementById("root")!).render(<App />);

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
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

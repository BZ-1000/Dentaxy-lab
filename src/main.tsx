
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set initial background color to black to prevent white flash
document.body.style.backgroundColor = '#000000';

createRoot(document.getElementById("root")!).render(<App />);

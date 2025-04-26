
// Add immediate black background to prevent white flash
document.documentElement.style.background = '#000000';
document.body.style.backgroundColor = '#000000';

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);


/**
 * Script para copiar recursos necesarios de Cornerstone DICOM Image Loader
 * al directorio public para que estén disponibles en runtime.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas origen (dentro de node_modules)
const NODE_MODULES = path.resolve(__dirname, '../../node_modules');
const CS_LOADER_DIST = path.join(NODE_MODULES, '@cornerstonejs/dicom-image-loader/dist');
const CODES_ROOT = path.join(NODE_MODULES, '@cornerstonejs');

// Ruta destino (public)
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const DEST_DIR = path.join(PUBLIC_DIR, 'dicom-image-loader');

// Crear directorio destino
if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
    console.log(`Created directory: ${DEST_DIR}`);
}

// 1. Copiar codecs WASM
const codecs = [
    'codec-charls',
    'codec-libjpeg-turbo-8bit',
    'codec-openjpeg',
    'codec-openjph'
];

codecs.forEach(codec => {
    const codecDist = path.join(CODES_ROOT, codec, 'dist');
    if (fs.existsSync(codecDist)) {
        const files = fs.readdirSync(codecDist);
        files.forEach(file => {
            if (file.endsWith('.wasm') || file.endsWith('.js')) {
                fs.copyFileSync(path.join(codecDist, file), path.join(DEST_DIR, file));
                console.log(`Copied ${file} to ${DEST_DIR}`);
            }
        });
    } else {
        console.warn(`Codec dir not found: ${codecDist}`);
    }
});

console.log('✅ Cornerstone assets copied successfully!');

import puppeteer from 'puppeteer';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    try {
        console.log('Iniciando Puppeteer...');
        // To use Puppeteer inside a system without X server, we use strict headless args
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        console.log('Cargando plantilla HTML...');
        // Load the local HTML file
        const htmlPath = path.resolve(__dirname, 'loi_template.html');
        await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
        
        console.log('Generando PDF...');
        const pdfPath = path.resolve(__dirname, 'LOI_UAO_SYNC.pdf');
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true, // Important to render Dentaxy colors!
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            }
        });

        await browser.close();
        console.log(`PDF generado exitosamente en: ${pdfPath}`);
    } catch (e) {
        console.error('Error al generar el PDF:', e);
        process.exit(1);
    }
})();

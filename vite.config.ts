
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// Plugin para hacer proxy de Edge TTS y evadir las restricciones de CORS/Origin del navegador
const edgeTtsPlugin = () => {
  return {
    name: 'edge-tts-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/tts', async (req: any, res: any, next: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { text, voice } = JSON.parse(body);
              if (!text || !voice) {
                res.statusCode = 400;
                res.end('Missing text or voice');
                return;
              }
              const { EdgeTTS } = await import('edge-tts-universal');
              const tts = new EdgeTTS(text, voice);
              const result = await tts.synthesize();
              const buffer = Buffer.from(await result.audio.arrayBuffer());
              res.setHeader('Content-Type', 'audio/mpeg');
              res.end(buffer);
            } catch (e) {
              console.error("[TTS Proxy Error]", e);
              res.statusCode = 500;
              res.end(String(e));
            }
          });
        } else {
          next();
        }
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
    watch: {
      // Excluir directorios pesados que no son código fuente
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/y/**',               // Google Cloud SDK symlink/carpeta dentro del proyecto
        '**/google-cloud-sdk/**',
        '**/.cache/**',
        '**/dist/**',
      ],
    },
  },
  plugins: [
    react(),
    edgeTtsPlugin(),
    mode === 'development' &&
    componentTagger(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 75 },
      webp: { quality: 80 },
      svg: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'sortAttrs',
            active: true,
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      mangle: {
        toplevel: true,
        safari10: true
      },
      output: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  worker: {
    format: 'es'
  }
}));

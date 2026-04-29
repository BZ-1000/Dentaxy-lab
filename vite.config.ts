
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
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

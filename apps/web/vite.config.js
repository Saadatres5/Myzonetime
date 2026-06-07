import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ── Development server ────────────────────────────────────────────────────
  server: {
    port: 3001,
    host: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
    },
  },

  // ── Build optimisation ────────────────────────────────────────────────────
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // inline assets < 4kb

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        passes: 2,
      },
      format: {
        comments: false,
      },
    },

    rollupOptions: {
      output: {
        // ── Manual chunk splitting for optimal caching ──────────────────
        manualChunks(id) {
          // Core React + Router — rarely changes, cache forever
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'vendor-react';
          }
          // Icons — large but static
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Helmet — small, keep separate for SSR-like patterns
          if (id.includes('node_modules/react-helmet-async')) {
            return 'vendor-helmet';
          }
          // Charts — only loaded on pages that use them
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts';
          }
          // UI primitives
          if (
            id.includes('@radix-ui') ||
            id.includes('class-variance-authority') ||
            id.includes('clsx') ||
            id.includes('tailwind-merge')
          ) {
            return 'vendor-ui';
          }
          // date-fns — moderate size
          if (id.includes('node_modules/date-fns')) {
            return 'vendor-dates';
          }
          // Large data files — lazy-loaded on demand
          if (id.includes('src/data/cityPageData')) return 'data-cities-seo';
          if (id.includes('src/data/timezoneData')) return 'data-timezones';
          if (id.includes('src/data/worldCitiesData')) return 'data-world-cities';
          if (id.includes('src/data/citiesData')) return 'data-cities';
        },

        chunkFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
        entryFileNames:  'assets/[name]-[hash].js',
      },
    },

    chunkSizeWarningLimit: 800,

    // ── Reporting ─────────────────────────────────────────────────────────
    reportCompressedSize: true,
  },

  // ── Optimise deps pre-bundling ────────────────────────────────────────────
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-helmet-async',
      'lucide-react',
    ],
  },
});

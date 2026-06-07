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

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor splitting
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/react-helmet-async')) {
            return 'vendor-helmet';
          }
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts';
          }
          if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-sheet') || id.includes('@radix-ui/react-popover') || id.includes('@radix-ui/react-select') || id.includes('@radix-ui/react-dropdown-menu')) {
            return 'vendor-ui-overlay'; // heavy overlay components — lazy loaded
          }
          if (
            id.includes('@radix-ui') ||
            id.includes('class-variance-authority') ||
            id.includes('clsx') ||
            id.includes('tailwind-merge')
          ) {
            return 'vendor-ui';
          }
          // SEO data chunks (loaded lazily by their pages)
          if (id.includes('src/data/cityPageData')) return 'data-cities-seo';
          if (id.includes('src/data/timezoneData')) return 'data-timezones';
          // worldCitiesData is large — keep as separate lazy chunk
          if (id.includes('src/data/worldCitiesData')) return 'data-world-cities';
          if (id.includes('src/data/citiesData')) return 'data-cities';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 800,
  },
});

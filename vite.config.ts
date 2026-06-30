import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Repo is published at https://hridikh.github.io/portfolio so the base must be '/portfolio/'.
// Override with BASE_PATH env if the repo name ever changes.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/portfolio/',
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});

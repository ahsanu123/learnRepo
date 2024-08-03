
import { defineConfig } from 'vite';
import { Plugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    target: 'es2018',
  },
  server: {
    port: 3000
  }
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: loadEnv(mode, '.', '').VITE_BASE_PATH || './',
  server: { watch: { ignored: ['**/.impeccable/**', '**/test-results/**', '**/playwright-report/**'] } },
  build: { target: 'es2022' },
}));

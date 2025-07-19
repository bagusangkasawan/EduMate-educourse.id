// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

process.env.ROLLUP_FORCE_JS = 'true';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: [],
  }
});

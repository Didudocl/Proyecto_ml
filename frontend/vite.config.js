import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permitir acceso desde otros contenedores
    port: 5173,      // Puerto del frontend
  },
});

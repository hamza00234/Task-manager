import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  proxy: {
    '/api': 'http://localhost:5000',  // Assuming your Express API is running on port 5000
  },
});

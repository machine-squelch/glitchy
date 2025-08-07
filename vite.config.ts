import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    allowedHosts: ['all', '.ondigitalocean.app', 'glitchy-1-bqpkp.ondigitalocean.app']
  },
  server: {
    host: true,
    port: 5173
  }
})
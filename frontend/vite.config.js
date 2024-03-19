import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslintPlugin()
  ],
  server: {
    host: true,
    port: 8000,
    watch: {
      usePolling: true
    }
  }
})

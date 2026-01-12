import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    port: 5173,
  },
  server: {
    port: 5173,
    // Прокси удален - используется прямое подключение через VITE_API_BASE_URL
  },
})

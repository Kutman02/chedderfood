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
    proxy: {
      '/wp-json': {
        target: 'https://cd444351-wordpress-zdtv5.tw1.ru',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Убеждаемся, что все заголовки передаются
            console.log('Proxy Request to:', proxyReq.path);
          });
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
        },
        // КРИТИЧНО: передаем cookies через прокси
        cookieDomainRewrite: '',
        cookiePathRewrite: '/',
      },
    },
  },
})

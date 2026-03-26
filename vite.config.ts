import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',

      workbox: {
        skipWaiting: true,
        clientsClaim: true,

        // 👇 offline fallback
        navigateFallback: '/offline.html',

        runtimeCaching: [
          // HTML страницы
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 дней
              },
            },
          },

          // API (только публичные данные)
          {
            urlPattern: ({ request }) =>
              request.method === 'GET' &&
              request.url.includes('/wp-json/wp/v2'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'menu-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 день
              },
            },
          },

          // Статические ассеты
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 дней
              },
            },
          },
        ],
      },

      manifest: {
        name: 'KutMenu',
        short_name: 'KutMenu',
        description: 'Доставка еды',
        theme_color: '#ea580c',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    chunkSizeWarningLimit: 1000,
  },

  preview: {
    port: 5173,
  },

  server: {
    port: 5173,
    proxy: {
      '/wp-json': {
        target: 'https://chedderfood.local',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
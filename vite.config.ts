import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    plugins: [
      react(),
      tailwindcss(),

      VitePWA({
        registerType: 'autoUpdate',

        workbox: {
          skipWaiting: true,
          clientsClaim: true,

          navigateFallback: '/offline.html',

          runtimeCaching: [
            {
              // HTML
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
              },
            },

            {
              // 🔥 WooCommerce API — НЕ КЕШИРУЕМ
              urlPattern: ({ request }) =>
                request.method === 'GET' &&
                request.url.includes('/wp-json/wc/store'),
              handler: 'NetworkOnly',
            },

            {
              // 🔥 WP API — тоже НЕ КЕШИРУЕМ
              urlPattern: ({ request }) =>
                request.method === 'GET' &&
                request.url.includes('/wp-json/wp/v2'),
              handler: 'NetworkOnly',
            },

            {
              // JS / CSS
              urlPattern: ({ request }) =>
                request.destination === 'script' ||
                request.destination === 'style',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'assets-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },

            {
              // Images
              urlPattern: ({ request }) =>
                request.destination === 'image',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
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
          target: env.VITE_SITE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}
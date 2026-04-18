import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd())
  const isPwaEnabled = env.VITE_ENABLE_PWA === 'true'

  return defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      ...(isPwaEnabled
        ? [
            VitePWA({
              registerType: 'autoUpdate',
              injectRegister: 'auto',

              workbox: {
                skipWaiting: true,
                clientsClaim: true,
                cleanupOutdatedCaches: true,

                runtimeCaching: [
                  {
                    // Online-only app shell behavior
                    urlPattern: ({ request }) => request.mode === 'navigate',
                    handler: 'NetworkOnly',
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
                    // JS / CSS should always be fetched from network
                    urlPattern: ({ request }) =>
                      request.destination === 'script' ||
                      request.destination === 'style',
                    handler: 'NetworkOnly',
                  },

                  {
                    // Images should also be fetched from network
                    urlPattern: ({ request }) =>
                      request.destination === 'image',
                    handler: 'NetworkOnly',
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
          ]
        : []),
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
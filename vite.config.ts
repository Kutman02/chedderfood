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
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
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
      "/wp-json": {
        target: "https://chedderfood.local",
        changeOrigin: true,
        secure: false
      }
    }

  }

})
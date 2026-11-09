import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
   base: '/burzik/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['burzik.png', 'correct.mp3', 'incorrect.mp3', 'img-192.png', 'img-512.png'],
      manifest: {
        name: 'Бурзик — тренажёр критического мышления',
        short_name: 'Бурзик',
         description: 'Профилактика экстремизма в игровом формате',
        lang: 'ru',
        display: 'standalone',
         start_url: '/burzik/',
        theme_color: '#0f172a',
        background_color: '#0f172a',
         icons: [
          { src: '/burzik/img-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/burzik/burzik.png', sizes: '512x512', type: 'image/png' },
          { src: '/burzik/img-512.png', sizes: '512x512', type: 'image/png' }
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
       devOptions: {
        enabled: true
      }
    }),
  ],
})
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      fullInstall: false,
      include: path.resolve(__dirname, 'src/locales/**'),
    }),
    VitePWA({
      manifest: {
        name: "SaugLog",
        short_name: "SaugLog",
        description: "A simple breastfeeding tracker",
        background_color: "#908e91",
        theme_color: "#ebe96c",
        display: "standalone",
        icons: [
          {src: "icon_512.png", sizes: "512x512", type: "image/png"},
        ]
      },
      srcDir: 'src',
      filename: 'sw.ts',
      base: '/',
      strategies: 'injectManifest',
      workbox: {
        navigateFallback: '/index.html',
      },
    }),
  ]
})

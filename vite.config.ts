import crypto from 'crypto'
import { readFileSync } from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { VitePWA } from 'vite-plugin-pwa'
import { ManifestEntry } from 'workbox-build'

function assetManifestEntry(assetPath: string): ManifestEntry {
  const ASSETS_DIR = 'src/assets'

  if (!assetPath.startsWith(ASSETS_DIR)) {
    throw new Error(`Assets should be in ${ASSETS_DIR}`)
  }

  const fileContents = readFileSync(assetPath)
  const fileStamp = crypto
    .createHash('SHA256')
    .update(fileContents)
    .digest('hex')
    .substring(0, 8)
  const revision = crypto
    .createHash('MD5')
    .update(fileContents)
    .digest('hex')
  const parsedPath = path.parse(assetPath)
  const url = `${parsedPath.dir.substr('src/'.length)}/${parsedPath.name}.${fileStamp}${parsedPath.ext}`

  return {url, revision}
}

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
      injectManifest: {
        additionalManifestEntries: [
          assetManifestEntry('src/assets/icons.svg')
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
      },
    }),
  ]
})

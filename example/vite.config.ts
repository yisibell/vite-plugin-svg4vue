import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { svg4VuePlugin } from 'vite-plugin-svg4vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vite-plugin-svg4vue/',
  plugins: [
    vue(),
    svg4VuePlugin({
      svgoConfig: {
        plugins: [],
      },
      enableSvgoPresetDefaultConfig: true,
      enableBuildCache: false,
    }),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

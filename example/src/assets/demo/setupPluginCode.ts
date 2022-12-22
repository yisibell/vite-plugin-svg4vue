// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { svg4VuePlugin } from 'vite-plugin-svg4vue'

export default defineConfig({
  plugins: [vue(), svg4VuePlugin()],
})

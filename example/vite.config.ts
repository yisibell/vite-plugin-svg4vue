import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { svg4VuePlugin } from 'vite-plugin-svg4vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svg4VuePlugin({
      svgoConfig: {
        plugins: [
          {
            name: 'moveFillAttrToSvgNodeFromPath',
            fn() {
              return {
                element: {
                  enter: (node) => {
                    if (node.name === 'svg') {
                      if (!node.children || node.children.length <= 0) return

                      const pathElements = node.children.filter(
                        (v) => (v as any).name === 'path'
                      )

                      if (pathElements.length <= 0) return

                      const allPathFillValue = pathElements.map(
                        (v) => (v as any).attributes.fill
                      )

                      const hasPathFill = allPathFillValue.length > 0

                      const isPlainIcon =
                        hasPathFill &&
                        [...new Set(allPathFillValue)].length === 1

                      if (isPlainIcon) {
                        node.attributes.fill = allPathFillValue[0]

                        pathElements.forEach((v) => {
                          delete (v as any).attributes.fill
                        })
                      }
                    }
                  },
                },
              }
            },
          },
        ],
      },
    }),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

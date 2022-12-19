import { compileTemplate } from '@vue/compiler-sfc'
import { readFileSync } from 'fs'
import { optimize } from 'svgo'
import type { Config as SvgoConfig } from 'svgo'
import { Svg4VuePlugin, Svg4VuePluginOptions } from '../types/index'

/**
 * Compile svg to vue render function
 */
async function compileSvg(source: string, id: string) {
  let { code } = compileTemplate({
    id,
    filename: id,
    source,
    transformAssetUrls: false,
  })

  code = code.replace('export function render', 'function render')
  code += `\nexport default { render };`

  return code
}

/**
 * Optimize svg with svgo
 */
async function optimizeSvg(
  content: string,
  path: string,
  svgoConfig: SvgoConfig = {}
) {
  const { data } = await optimize(content, {
    ...svgoConfig,
    path,
  })

  return data
}

const svg4VuePlugin: Svg4VuePlugin = (options = {}) => {
  const { svgoConfig = {}, defaultExport = 'component' } = options

  const cache = new Map()
  const svgRegex = /\.svg(?:\?(component|url))?$/

  return {
    name: 'vite-plugin-svg4vue',
    async transform(source: string, id: string) {
      const result = id.match(svgRegex)
      // TODO
      const isBuild = false

      if (result) {
        const type = result[1]

        if (
          (defaultExport === 'url' && typeof type === 'undefined') ||
          type === 'url'
        ) {
          return source
        }

        if (
          (defaultExport === 'component' && typeof type === 'undefined') ||
          type === 'component'
        ) {
          const idWithoutQuery = id.replace('.svg?component', '.svg')
          let result = cache.get(idWithoutQuery)

          if (!result) {
            const code = readFileSync(idWithoutQuery, 'utf8')

            const svg = await optimizeSvg(code, idWithoutQuery, svgoConfig)

            result = await compileSvg(svg, idWithoutQuery)

            if (isBuild) {
              cache.set(idWithoutQuery, result)
            }
          }

          return result
        }
      }
    },
  }
}

export { svg4VuePlugin, Svg4VuePlugin, Svg4VuePluginOptions }

import compileSvg from './compileSvg'
import optimizeSvg from './optimizeSvg'
import { readFileSync } from 'fs'
import { Svg4VuePlugin, Svg4VuePluginOptions } from '../types/index'
import createSvgoConfig from './createSvgoConfig'

const svg4VuePlugin: Svg4VuePlugin = (options = {}) => {
  const {
    svgoConfig = {},
    defaultExport = 'url',
    assetsDirName = 'icons',
    enableBuildCache = true,
    enableMonochromeSvgOptimize = true,
    enableSvgSizeResponsive = true,
  } = options

  const cache = new Map()

  const svgRegex = new RegExp(
    `${assetsDirName}/.*\\.svg(?:\\?(component|url))?$`
  )

  let isBuild = false

  const finalSvgoConfig = createSvgoConfig(svgoConfig, {
    movePathFillAttrToSvgNode: enableMonochromeSvgOptimize,
    responsiveSVGSize: enableSvgSizeResponsive,
  })

  return {
    name: 'vite-plugin-svg4vue',
    config(config, { command }) {
      isBuild = command === 'build'
      return config
    },
    async transform(source: string, id: string) {
      const result = id.match(svgRegex)

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

            const svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig)

            result = await compileSvg(svg, idWithoutQuery)

            if (enableBuildCache && isBuild) {
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

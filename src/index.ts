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

  const svgComponentCache = new Map()
  const svgRawCache = new Map()

  const svgRegex = new RegExp(
    `${assetsDirName}/.*\\.svg(?:\\?(component|url|raw))?$`
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
      const matchedId = id.match(svgRegex)
      const idWithoutQuery = id.replace(/\.svg\?.*/, '.svg')

      if (matchedId) {
        const type = matchedId[1]

        // handle to raw
        if (
          (defaultExport === 'raw' && typeof type === 'undefined') ||
          type === 'raw'
        ) {
          let cachedSvgRawResult = svgRawCache.get(idWithoutQuery)

          if (!cachedSvgRawResult) {
            cachedSvgRawResult = await optimizeSvg(
              source,
              idWithoutQuery,
              finalSvgoConfig
            )

            if (enableBuildCache && isBuild) {
              svgRawCache.set(idWithoutQuery, cachedSvgRawResult)
            }
          }

          return cachedSvgRawResult
        }

        // handle to url
        if (
          (defaultExport === 'url' && typeof type === 'undefined') ||
          type === 'url'
        ) {
          return source
        }

        // handle to component
        if (
          (defaultExport === 'component' && typeof type === 'undefined') ||
          type === 'component'
        ) {
          let cachedSvgComponentResult = svgComponentCache.get(idWithoutQuery)

          if (!cachedSvgComponentResult) {
            const code = readFileSync(idWithoutQuery, 'utf8')

            const svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig)

            cachedSvgComponentResult = await compileSvg(svg, idWithoutQuery)

            if (enableBuildCache && isBuild) {
              svgComponentCache.set(idWithoutQuery, cachedSvgComponentResult)
            }
          }

          return cachedSvgComponentResult
        }
      }
    },
  }
}

export { svg4VuePlugin, Svg4VuePlugin, Svg4VuePluginOptions }

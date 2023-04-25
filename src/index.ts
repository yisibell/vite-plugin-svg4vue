import compileSvg from './compileSvg'
import optimizeSvg from './optimizeSvg'
import { readFileSync } from 'fs'
import { Svg4VuePlugin, Svg4VuePluginOptions } from '../types/index'
import { createSvgoConfig } from 'svgo-extra'
import compileSvgToRaw from './compileSvgToRaw'
import { resolveSearchParams } from './getSearchParams'
import type { Config as SvgoConfig } from 'svgo'

const svg4VuePlugin: Svg4VuePlugin = (options = {}) => {
  const {
    svgoConfig = {},
    defaultExport = 'url',
    assetsDirName = 'icons',
    enableBuildCache = true,
    enableMonochromeSvgOptimize = true,
    enableSvgSizeResponsive = true,
    enableSvgoPresetDefaultConfig = true,
  } = options

  const svgComponentCache = new Map()
  const svgRawCache = new Map()

  let isBuild = false

  const disabledSvgo = svgoConfig === false

  const finalSvgoConfig = disabledSvgo
    ? {}
    : createSvgoConfig(svgoConfig as SvgoConfig, {
        moveStrokeAttrToSvgNode: enableMonochromeSvgOptimize,
        movePathFillAttrToSvgNode: enableMonochromeSvgOptimize,
        responsiveSVGSize: enableSvgSizeResponsive,
        presetDefault: enableSvgoPresetDefaultConfig,
      })

  return {
    name: 'vite-plugin-svg4vue',
    config(config, { command }) {
      isBuild = command === 'build'
      return config
    },
    async transform(source: string, id: string) {
      const { idWithoutQuery, type, matchedId, skipsvgo } = resolveSearchParams(
        id,
        assetsDirName
      )

      if (matchedId) {
        // handle to raw
        if (
          (defaultExport === 'raw' && typeof type === 'undefined') ||
          type === 'raw'
        ) {
          if (disabledSvgo || skipsvgo) return source

          let cachedSvgRawResult = svgRawCache.get(idWithoutQuery)

          if (!cachedSvgRawResult) {
            const code = readFileSync(idWithoutQuery, 'utf8')

            const svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig)

            cachedSvgRawResult = compileSvgToRaw(svg)

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

            let svg = code

            if (!disabledSvgo && !skipsvgo) {
              svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig)
            }

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

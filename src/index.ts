import compileSvg from './compileSvg'
import optimizeSvg from './optimizeSvg'
import { readFileSync } from 'fs'
import { Svg4VuePlugin, Svg4VuePluginOptions } from './interfaces/core'
import { createSvgoConfig } from 'svgo-extra'
import compileSvgToRaw from './compileSvgToRaw'
import { resolveSearchParams } from './getSearchParams'
import type { Config as SvgoConfig } from 'svgo'
import {
  DEFAULT_OPTIONS,
  COMPONENT_COMPILE_TYPE,
  RAW_COMPILE_TYPE,
  URL_COMPILE_TYPE,
} from './defaults'

const svg4VuePlugin: Svg4VuePlugin = (options = {}) => {
  const {
    svgoConfig = {},
    defaultExport = DEFAULT_OPTIONS.defaultExport,
    assetsDirName = DEFAULT_OPTIONS.assetsDirName,
    enableBuildCache = true,
    enableMonochromeSvgOptimize = true,
    enableSvgSizeResponsive = true,
    enableSvgoPresetDefaultConfig = true,
  } = options

  const svgComponentCache = new Map<string, any>()
  const svgRawCache = new Map<string, string>()

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
    configResolved(config) {
      isBuild = config.mode === 'production'
    },
    async transform(source: string, id: string) {
      const { idWithoutQuery, type, matchedId, skipsvgo } = resolveSearchParams(
        id,
        assetsDirName,
      )

      if (matchedId) {
        // handle to raw
        if (
          (defaultExport === RAW_COMPILE_TYPE && typeof type === 'undefined') ||
          type === RAW_COMPILE_TYPE
        ) {
          if (disabledSvgo || skipsvgo) return source

          let cachedSvgRawResult = svgRawCache.get(id)

          if (!cachedSvgRawResult) {
            const code = readFileSync(idWithoutQuery, 'utf8')

            const svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig)

            cachedSvgRawResult = compileSvgToRaw(svg)

            if (enableBuildCache && isBuild) {
              svgRawCache.set(id, cachedSvgRawResult)
            }
          }

          return cachedSvgRawResult
        }

        // handle to url
        if (
          (defaultExport === URL_COMPILE_TYPE && typeof type === 'undefined') ||
          type === URL_COMPILE_TYPE
        ) {
          return source
        }

        // handle to component
        if (
          (defaultExport === COMPONENT_COMPILE_TYPE &&
            typeof type === 'undefined') ||
          type === COMPONENT_COMPILE_TYPE
        ) {
          let cachedSvgComponentResult = svgComponentCache.get(id)

          if (!cachedSvgComponentResult) {
            const code = readFileSync(idWithoutQuery, 'utf8')

            let svg = code

            if (!disabledSvgo && !skipsvgo) {
              svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig)
            }

            cachedSvgComponentResult = await compileSvg(svg, idWithoutQuery)

            if (enableBuildCache && isBuild) {
              svgComponentCache.set(id, cachedSvgComponentResult)
            }
          }

          return cachedSvgComponentResult
        }
      }
    },
  }
}

export { svg4VuePlugin, Svg4VuePlugin, Svg4VuePluginOptions }

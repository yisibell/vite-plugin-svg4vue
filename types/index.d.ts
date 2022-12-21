import type { Config as SvgoConfig } from 'svgo'
import type { Plugin as VitePlugin } from 'vite'

interface Svg4VuePluginOptions {
  svgoConfig?: SvgoConfig
  defaultExport?: string
  assetsDirName?: string
  enableBuildCache?: boolean
  enableMonochromeSvgOptimize?: boolean
  enableSvgSizeResponsive?: boolean
}

type Svg4VuePlugin = (opts?: Svg4VuePluginOptions) => VitePlugin

declare const svg4VuePlugin: Svg4VuePlugin

export { Svg4VuePluginOptions, Svg4VuePlugin, svg4VuePlugin }

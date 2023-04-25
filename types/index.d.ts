import type { Config as SvgoConfig } from 'svgo'
import type { Plugin as VitePlugin } from 'vite'

interface Svg4VuePluginOptions {
  svgoConfig?: SvgoConfig | boolean
  enableSvgoPresetDefaultConfig?: boolean
  defaultExport?: 'url' | 'raw' | 'component'
  assetsDirName?: string
  enableBuildCache?: boolean
  enableSvgSizeResponsive?: boolean
  enableMonochromeSvgOptimize?: boolean
}

type Svg4VuePlugin = (opts?: Svg4VuePluginOptions) => VitePlugin

declare const svg4VuePlugin: Svg4VuePlugin

export { Svg4VuePluginOptions, Svg4VuePlugin, svg4VuePlugin }

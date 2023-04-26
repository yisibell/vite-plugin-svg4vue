import type { Config as SvgoConfig } from 'svgo'
import type { Plugin as VitePlugin } from 'vite'

export interface Svg4VuePluginOptions {
  svgoConfig?: SvgoConfig | boolean
  enableSvgoPresetDefaultConfig?: boolean
  defaultExport?: 'url' | 'raw' | 'component'
  assetsDirName?: string
  enableBuildCache?: boolean
  enableSvgSizeResponsive?: boolean
  enableMonochromeSvgOptimize?: boolean
}

export type Svg4VuePlugin = (opts?: Svg4VuePluginOptions) => VitePlugin

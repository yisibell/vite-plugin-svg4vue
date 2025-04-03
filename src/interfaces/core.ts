import type { Config as SvgoConfig } from 'svgo'
import type { Plugin as VitePlugin } from 'vite'

export interface Svg4VuePluginOptions extends Svg4VueDefaultSvgoConfigOptions {
  svgoConfig?: SvgoConfig | boolean
  enableSvgoPresetDefaultConfig?: boolean
  defaultExport?: 'url' | 'raw' | 'component'
  assetsDirName?: string | boolean
  enableBuildCache?: boolean
  enableSvgSizeResponsive?: boolean
  enableMonochromeSvgOptimize?: boolean
}

export interface Svg4VueDefaultSvgoConfigOptions {
  namespaceClassnames?: boolean
  namespaceIDs?: boolean
}

export type Svg4VuePlugin = (opts?: Svg4VuePluginOptions) => VitePlugin

import { Config } from 'svgo';
import { Plugin } from 'vite';

interface Svg4VuePluginOptions {
  svgoConfig?: Config
  enableSvgoPresetDefaultConfig?: boolean
  defaultExport?: 'url' | 'raw' | 'component'
  assetsDirName?: string
  enableBuildCache?: boolean
  enableSvgSizeResponsive?: boolean
  enableMonochromeSvgOptimize?: boolean
}

type Svg4VuePlugin = (opts?: Svg4VuePluginOptions) => Plugin

declare const svg4VuePlugin: Svg4VuePlugin

export { Svg4VuePlugin, Svg4VuePluginOptions, svg4VuePlugin };

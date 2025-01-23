import { Config } from 'svgo';
import { Plugin } from 'vite';

interface Svg4VuePluginOptions {
  svgoConfig?: Config | boolean
  enableSvgoPresetDefaultConfig?: boolean
  defaultExport?: 'url' | 'raw' | 'component'
  assetsDirName?: string | boolean
  enableBuildCache?: boolean
  enableSvgSizeResponsive?: boolean
  enableMonochromeSvgOptimize?: boolean
}

type Svg4VuePlugin = (opts?: Svg4VuePluginOptions) => Plugin

declare const svg4VuePlugin: Svg4VuePlugin

export { type Svg4VuePlugin, type Svg4VuePluginOptions, svg4VuePlugin };

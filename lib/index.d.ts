import { Config } from 'svgo';
import { Plugin } from 'vite';

interface Svg4VuePluginOptions {
  svgoConfig?: Config
  defaultExport?: string
  assetsDirName?: string
  enableBuildCache?: boolean
  enableMonochromeSvgOptimize?: boolean
  enableSvgSizeResponsive?: boolean
}

type Svg4VuePlugin = (opts?: Svg4VuePluginOptions) => Plugin

declare const svg4VuePlugin: Svg4VuePlugin

export { Svg4VuePlugin, Svg4VuePluginOptions, svg4VuePlugin };

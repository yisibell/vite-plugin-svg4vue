import { optimize } from 'svgo'
import type { Config as SvgoConfig } from 'svgo'
import movePathFillAttrToSvgNode from './svgo-plugins/movePathFillAttrToSvgNode'

interface ExtraOptions {
  /** is enable movePathFillAttrToSvgNode plugin */
  movePathFillAttrToSvgNode?: boolean
}

/**
 * Optimize svg with svgo
 */
async function optimizeSvg(
  content: string,
  path: string,
  svgoConfig: SvgoConfig = {},
  extraOptions: ExtraOptions = {}
) {
  let finalSvgoConfig: SvgoConfig = {}

  finalSvgoConfig.plugins = ['preset-default']

  if (extraOptions.movePathFillAttrToSvgNode) {
    finalSvgoConfig.plugins.push(movePathFillAttrToSvgNode())
  }

  if (svgoConfig.plugins && svgoConfig.plugins.length > 0) {
    finalSvgoConfig.plugins = [
      ...finalSvgoConfig.plugins,
      ...svgoConfig.plugins,
    ]
  }

  delete svgoConfig.plugins

  finalSvgoConfig = { ...finalSvgoConfig, ...svgoConfig }

  const { data } = await optimize(content, {
    ...finalSvgoConfig,
    path,
  })

  return data
}

export default optimizeSvg

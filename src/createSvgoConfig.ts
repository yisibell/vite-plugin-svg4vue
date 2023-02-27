import type { Config as SvgoConfig } from 'svgo'
import { moveChildAttrToSVGElement, responsiveSVGSize } from 'svgo-extra'

export interface OptimizeSvgExtraOptions {
  /** whether to enable moveStrokeAttrToSvgNode plugin */
  moveStrokeAttrToSvgNode?: boolean
  /** whether to enable movePathFillAttrToSvgNode plugin */
  movePathFillAttrToSvgNode?: boolean
  /** whether to enable responsiveSVGSize plugin */
  responsiveSVGSize?: boolean
}

export default function (
  svgoConfig: SvgoConfig = {},
  extraOptions: OptimizeSvgExtraOptions = {}
) {
  let finalSvgoConfig: SvgoConfig = {}

  finalSvgoConfig.plugins = ['preset-default']

  if (extraOptions.moveStrokeAttrToSvgNode) {
    finalSvgoConfig.plugins.push(
      moveChildAttrToSVGElement('moveStrokeAttrToSVGNode', {
        targetChildElementNames: ['path'],
        targetChildElementAttributes: ['stroke', 'stroke-opacity'],
      })
    )
  }

  if (extraOptions.movePathFillAttrToSvgNode) {
    finalSvgoConfig.plugins.push(moveChildAttrToSVGElement())
  }

  if (responsiveSVGSize) {
    finalSvgoConfig.plugins.push(responsiveSVGSize())
  }

  if (svgoConfig.plugins && svgoConfig.plugins.length > 0) {
    finalSvgoConfig.plugins = [
      ...finalSvgoConfig.plugins,
      ...svgoConfig.plugins,
    ]
  }

  delete svgoConfig.plugins

  finalSvgoConfig = { ...finalSvgoConfig, ...svgoConfig }

  return finalSvgoConfig
}

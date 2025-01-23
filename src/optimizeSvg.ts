import * as SVGO from 'svgo'
import type { Config as SvgoConfig } from 'svgo'

/**
 * Optimize svg with svgo
 */
async function optimizeSvg(
  content: string,
  path: string,
  finalSvgoConfig: SvgoConfig = {},
) {
  const { data } = await SVGO.optimize(content, {
    ...finalSvgoConfig,
    path,
  })

  return data
}

export default optimizeSvg

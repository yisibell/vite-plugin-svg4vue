import { optimize } from 'svgo'
import type { Config as SvgoConfig } from 'svgo'

/**
 * Optimize svg with svgo
 */
async function optimizeSvg(
  content: string,
  path: string,
  svgoConfig: SvgoConfig = {}
) {
  const { data } = await optimize(content, {
    ...svgoConfig,
    path,
  })

  return data
}

export default optimizeSvg

import * as SVGO from 'svgo'
import type { Config as SvgoConfig } from 'svgo'
import { v4 as uuidv4 } from 'uuid'

const genUuid = () => {
  return `a-${uuidv4().slice(0, 5)}`
}

/**
 * Optimize svg with svgo
 */
async function optimizeSvg(
  content: string,
  path: string,
  finalSvgoConfig: SvgoConfig = {},
) {
  finalSvgoConfig.plugins?.push({
    name: 'prefixIds',
    params: {
      prefix: () => genUuid(),
    },
  })

  const { data } = await SVGO.optimize(content, {
    ...finalSvgoConfig,
    path,
  })

  return data
}

export default optimizeSvg

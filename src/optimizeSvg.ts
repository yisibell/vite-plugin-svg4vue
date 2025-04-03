import * as SVGO from 'svgo'
import type { Config as SvgoConfig } from 'svgo'
import { v4 as uuidv4 } from 'uuid'
import type { Svg4VueDefaultSvgoConfigOptions } from './interfaces/core'
import { withDefaultConfig } from './withDefault'

const genUuid = () => {
  return `a${uuidv4().slice(0, 5)}`
}

export const defaultSvgoConfig = (
  incommingConfig?: SvgoConfig | boolean,
  opts?: Svg4VueDefaultSvgoConfigOptions,
): SvgoConfig => {
  const inconfig =
    typeof incommingConfig === 'boolean'
      ? {}
      : incommingConfig
        ? incommingConfig
        : {}

  const deConfig = {
    plugins: [
      {
        name: 'prefixIds',
        params: {
          prefix: () => genUuid(),
          prefixIds: opts?.namespaceIDs,
          prefixClassNames: opts?.namespaceClassnames,
        },
      },
    ],
  } satisfies SvgoConfig

  const outputConfig = withDefaultConfig(inconfig, deConfig)

  return outputConfig
}

/**
 * Optimize svg with svgo
 */
export async function optimizeSvg(
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

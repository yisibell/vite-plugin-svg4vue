import * as SVGO from 'svgo'
import type { Config as SvgoConfig } from 'svgo'
import type { Svg4VueDefaultSvgoConfigOptions } from './interfaces/core'
import { withDefaultConfig } from './withDefault'
import { hash } from 'ohash'

export const defaultSvgoConfig = (
  incommingConfig?: SvgoConfig | boolean,
  opts?: Svg4VueDefaultSvgoConfigOptions,
  id?: string,
): SvgoConfig => {
  const hashedPrefix = `${opts?.namespacePrefix || 'a'}${hash({ id }).slice(0, 6)}`

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
          prefix: () => hashedPrefix,
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

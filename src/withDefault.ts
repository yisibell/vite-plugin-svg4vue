import { createDefu } from 'defu'
import type { Config as SvgoConfig } from 'svgo'

export const withDefaultConfig = (source: SvgoConfig, defaults: SvgoConfig) => {
  const def = createDefu((obj, key, value) => {
    if (Array.isArray(value) && Array.isArray(obj[key])) {
      obj[key] = [...obj[key], ...value] as any

      return true
    }
  })

  return def(source, defaults)
}

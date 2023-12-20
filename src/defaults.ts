export const COMPONENT_COMPILE_TYPE = 'component'

export const RAW_COMPILE_TYPE = 'raw'

export const URL_COMPILE_TYPE = 'url'

export const SKIP_SVGO_FLAG = 'skipsvgo'

export const AVAILABLE_COMPILE_TYPES = [
  COMPONENT_COMPILE_TYPE,
  RAW_COMPILE_TYPE,
  URL_COMPILE_TYPE,
]

export enum DEFAULT_OPTIONS {
  defaultExport = 'url',
  assetsDirName = 'icons',
}

import qs from 'node:querystring'
import * as ufo from 'ufo'
import {
  DEFAULT_OPTIONS,
  COMPONENT_COMPILE_TYPE,
  RAW_COMPILE_TYPE,
  URL_COMPILE_TYPE,
  SKIP_SVGO_FLAG,
} from './defaults'

const resolveSearchParams = (url: string, assetsDirName: string | boolean) => {
  const idWithoutQuery = url.replace(/\.svg\?.*/, '.svg')

  const assetsDirNameString =
    assetsDirName === false
      ? ''
      : assetsDirName === true
        ? DEFAULT_OPTIONS.assetsDirName
        : assetsDirName

  const safeAssetsDirName = assetsDirNameString
    ? ufo.withTrailingSlash(assetsDirNameString)
    : ''

  const svgRegexString = `${safeAssetsDirName}.*\\.svg(\\?.*)?$`

  const svgRegex = new RegExp(svgRegexString)

  const matchedId = url.match(svgRegex)
  const querystring =
    Array.isArray(matchedId) && matchedId[1]
      ? matchedId[1].replace('?', '')
      : ''

  const searchParamsKeys = Object.keys(qs.parse(querystring))

  const skipsvgo = searchParamsKeys.includes(SKIP_SVGO_FLAG)

  let type = undefined

  if (searchParamsKeys.includes(COMPONENT_COMPILE_TYPE)) {
    type = COMPONENT_COMPILE_TYPE
  } else if (searchParamsKeys.includes(RAW_COMPILE_TYPE)) {
    type = RAW_COMPILE_TYPE
  } else if (searchParamsKeys.includes(URL_COMPILE_TYPE)) {
    type = URL_COMPILE_TYPE
  }

  return {
    type,
    skipsvgo,
    searchParamsKeys,
    matchedId,
    idWithoutQuery,
    querystring,
  }
}

export { resolveSearchParams }

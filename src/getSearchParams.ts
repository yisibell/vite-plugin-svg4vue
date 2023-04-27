import qs from 'node:querystring'
import * as ufo from 'ufo'
import { DEFAULT_OPTIONS } from './defaults'

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
  const querystring = Array.isArray(matchedId)
    ? matchedId[1].replace('?', '')
    : ''

  const searchParamsKeys = Object.keys(qs.parse(querystring))

  const skipsvgo = searchParamsKeys.includes('skipsvgo')

  const type =
    !skipsvgo || searchParamsKeys.length >= 2 ? searchParamsKeys[0] : undefined

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

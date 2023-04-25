import qs from 'node:querystring'

const resolveSearchParams = (url: string, assetsDirName: string) => {
  const idWithoutQuery = url.replace(/\.svg\?.*/, '.svg')

  // legecy: `${assetsDirName}/.*\\.svg(?:\\?(component|url|raw))?$`
  const svgRegex = new RegExp(`${assetsDirName}/.*\\.svg(\\?.*)?$`)
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

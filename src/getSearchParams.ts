const getSearchParams = (url: string) => {
  return new URL(url).searchParams
}

const resolveSearchParams = (url: string, assetsDirName: string) => {
  const idWithoutQuery = url.replace(/\.svg\?.*/, '.svg')
  const searchParams = getSearchParams(url)
  const searchParamsKeys = [...searchParams.keys()]

  // legecy: `${assetsDirName}/.*\\.svg(?:\\?(component|url|raw))?$`
  const svgRegex = new RegExp(`${assetsDirName}/.*\\.svg(\\?.*)?$`)
  const matchedId = url.match(svgRegex)

  const skipsvgo = searchParamsKeys.includes('skipsvgo')

  const type =
    !skipsvgo || searchParamsKeys.length >= 2 ? searchParamsKeys[0] : undefined

  return {
    type,
    skipsvgo,
    searchParamsKeys,
    matchedId,
    idWithoutQuery,
  }
}

export { getSearchParams, resolveSearchParams }

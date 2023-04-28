import { compileTemplate } from 'vue/compiler-sfc'

/**
 * Compile svg to vue render function
 */
async function compileSvg(source: string, id: string) {
  const { code: renderFunctionCode, map } = compileTemplate({
    id,
    filename: id,
    source,
    transformAssetUrls: false,
  })

  const code = `${renderFunctionCode}\nexport default { render };`

  return {
    code,
    map,
  }
}

export default compileSvg

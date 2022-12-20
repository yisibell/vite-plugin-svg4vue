import { compileTemplate } from '@vue/compiler-sfc'

/**
 * Compile svg to vue render function
 */
async function compileSvg(source: string, id: string) {
  let { code } = compileTemplate({
    id,
    filename: id,
    source,
    transformAssetUrls: false,
  })

  code = code.replace('export function render', 'function render')
  code += `\nexport default { render };`

  return code
}

export default compileSvg

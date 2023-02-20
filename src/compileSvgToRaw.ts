/**
 * Compile svg to raw
 */
function compileSvgToRaw(source: string) {
  const formatSource = source.replace(/"/g, `\\"`)

  const code = `\nexport default "${formatSource}";`

  return code
}

export default compileSvgToRaw

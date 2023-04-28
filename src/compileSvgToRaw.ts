/**
 * Compile svg to raw
 */
function compileSvgToRaw(source: string) {
  const formatSource = JSON.stringify(source)

  const code = `\nexport default ${formatSource};`

  return code
}

export default compileSvgToRaw

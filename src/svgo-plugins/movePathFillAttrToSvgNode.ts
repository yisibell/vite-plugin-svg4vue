import type { CustomPlugin } from 'svgo'
import type { XastElement } from 'svgo/lib/types'

/**
 * move fill attribute value to it's parent node (svg) when a svg element is a monochrome icon.
 */
export default function (): CustomPlugin {
  return {
    name: 'movePathFillAttrToSvgNode',
    fn() {
      return {
        element: {
          enter: (node) => {
            if (node.name === 'svg') {
              if (!node.children || node.children.length <= 0) return

              const elements = node.children.filter(
                (v) => v.type === 'element'
              ) as XastElement[]

              const pathElements = elements.filter((v) => v.name === 'path')

              if (pathElements.length <= 0) return

              const allPathFillValue = pathElements
                .map((v) => v.attributes?.fill)
                .filter((fillValue) => !!fillValue)

              const hasPathFill = allPathFillValue.length > 0

              const isMonochromeSvg =
                hasPathFill && [...new Set(allPathFillValue)].length === 1

              if (isMonochromeSvg) {
                node.attributes.fill = allPathFillValue[0]

                pathElements.forEach((v) => {
                  delete v.attributes.fill
                })
              }
            }
          },
        },
      }
    },
  }
}

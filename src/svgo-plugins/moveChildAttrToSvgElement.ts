import type { CustomPlugin } from 'svgo'
import type { XastElement } from 'svgo/lib/types'

export interface MoveChildAttrToSvgElementOptions {
  targetChildElementNames?: string[]
  targetChildElementAttributes?: string[]
}

export const moveAttrToSvgNode = (
  svgNode: XastElement,
  targetElements: XastElement[],
  targetAttribute: string
) => {
  if (targetElements.length <= 0) return

  const allTargetElementAttrValues = targetElements
    .map((v) => v.attributes[targetAttribute])
    .filter((attrValue) => !!attrValue)

  const hasTargetAttr = allTargetElementAttrValues.length > 0

  const isMonochromeAttr =
    hasTargetAttr && [...new Set(allTargetElementAttrValues)].length === 1

  if (isMonochromeAttr) {
    svgNode.attributes[targetAttribute] = allTargetElementAttrValues[0]

    targetElements.forEach((v) => {
      delete v.attributes[targetAttribute]
    })
  }
}

/**
 * move child element attribute to it's parent node (svg) when the children elements are monochrome.
 */
export default function (
  name = 'movePathFillAttrToSvgNode',
  option?: MoveChildAttrToSvgElementOptions
): CustomPlugin {
  const finalOption = Object.assign(
    {
      targetChildElementNames: ['path'],
      targetChildElementAttributes: ['fill'],
    },
    option
  )

  return {
    name,
    fn() {
      return {
        element: {
          enter: (node) => {
            if (node.name === 'svg') {
              if (!node.children || node.children.length <= 0) return

              const elements = node.children.filter(
                (v) => v.type === 'element'
              ) as XastElement[]

              const targetElements = elements.filter((v) =>
                finalOption.targetChildElementNames.includes(v.name)
              )

              finalOption.targetChildElementAttributes.forEach((attrName) => {
                moveAttrToSvgNode(node, targetElements, attrName)
              })
            }
          },
        },
      }
    },
  }
}

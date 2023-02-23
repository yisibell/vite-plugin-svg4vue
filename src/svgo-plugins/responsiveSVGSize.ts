import type { CustomPlugin } from 'svgo'
import type { XastElement } from 'svgo/lib/types'

export const setAttr = (node: XastElement, name: string, value: string) => {
  node.attributes[name] = value
}

/**
 * change svg width attribute to 1em, remove svg height attribute and set `font-szie` to svg node's `width`.
 * so that the svg will be responsive
 */
export default function (): CustomPlugin {
  return {
    name: 'responsiveSVGSize',
    fn: () => {
      return {
        element: {
          enter(node) {
            if (node.name === 'svg') {
              const { width, height, style } = node.attributes

              const wNumber = Number.parseFloat(width)
              const hNumber = Number.parseFloat(height)

              const addStyle = `--svg-origin-width: ${wNumber};--svg-origin-height: ${hNumber}; 
              --svg-origin-width--with-unit: ${wNumber}px; --svg-origin-height--with-unit: ${hNumber}px;`

              const styleValue = style ? `${addStyle}${style}` : addStyle

              setAttr(node, 'style', styleValue)

              setAttr(node, 'data-svg-origin-width', width)
              setAttr(node, 'data-svg-origin-height', height)

              if (width) {
                setAttr(node, 'font-size', width)
              }

              setAttr(node, 'width', '1em')

              delete node.attributes.height
            }
          },
        },
      }
    },
  }
}

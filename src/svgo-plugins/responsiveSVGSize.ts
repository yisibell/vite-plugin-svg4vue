import type { CustomPlugin } from 'svgo'

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
              const { width } = node.attributes

              width && (node.attributes['font-size'] = width)

              node.attributes.width = '1em'

              delete node.attributes.height
            }
          },
        },
      }
    },
  }
}

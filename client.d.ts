declare module '*.svg?component' {
  import { DefineComponent, SVGAttributes } from 'vue'
  const component: DefineComponent<SVGAttributes>
  export default component
}

declare module '*.svg?component&skipsvgo' {
  import { DefineComponent, SVGAttributes } from 'vue'
  const component: DefineComponent<SVGAttributes>
  export default component
}

declare module '*.svg?component&skip-responsive' {
  import { DefineComponent, SVGAttributes } from 'vue'
  const component: DefineComponent<SVGAttributes>
  export default component
}

declare module '*.svg?component&skip-responsive&skip-monochrome' {
  import { DefineComponent, SVGAttributes } from 'vue'
  const component: DefineComponent<SVGAttributes>
  export default component
}

declare module '*.svg?component&skip-monochrome' {
  import { DefineComponent, SVGAttributes } from 'vue'
  const component: DefineComponent<SVGAttributes>
  export default component
}

declare module '*.svg?component&skip-monochrome&skip-responsive' {
  import { DefineComponent, SVGAttributes } from 'vue'
  const component: DefineComponent<SVGAttributes>
  export default component
}

declare module '*.svg?raw&skipsvgo' {
  const raw: string
  export default raw
}

declare module '*.svg?raw&skip-monochrome' {
  const raw: string
  export default raw
}

declare module '*.svg?raw&skip-monochrome&skip-responsive' {
  const raw: string
  export default raw
}

declare module '*.svg?raw&skip-responsive' {
  const raw: string
  export default raw
}

declare module '*.svg?raw&skip-responsive&skip-monochrome' {
  const raw: string
  export default raw
}

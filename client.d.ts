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

declare module '*.svg?raw&skipsvgo' {
  const raw: string
  export default raw
}

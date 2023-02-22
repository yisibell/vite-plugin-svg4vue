# vite-plugin-svg4vue

A `vite (3.x || 4.x)` plugin which can transform `svg` icon to `vue (3.x)` component.

> this plugin dependencies on `vue/compiler-sfc`, so keep your `vue` version to **3.2.13+**.

see <a href="https://hongwenqing.com/vite-plugin-svg4vue/" target="_blank">Example and docs</a>.

# Features

- [SVGO](https://github.com/svg/svgo) optimization.
- Hot Module Replacement support.
- Support for `?url` , `?component` and `?raw` query string.
- Support custom svg icon (monochrome) color with `fill` and `stroke` attribute.
- Support change svg icon size with `font-size` and it will be responsive.

# Installation

```bash
# pnpm
$ pnpm add vite-plugin-svg4vue -D

# yarn
$ yarn add vite-plugin-svg4vue --dev

# npm
$ npm i vite-plugin-svg4vue -D
```

# Usage
## Setup

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { svg4VuePlugin } from 'vite-plugin-svg4vue'

export default defineConfig({
  plugins: [
    vue(),
    svg4VuePlugin(),
  ],
})
```

If you are using TypeScript, **vite-plugin-svg4vue/client** can be added to d.ts declaration file.

``` ts
/// <reference types="vite-plugin-svg4vue/client" />
```

## Options

| Key | Default value | Description |
| :---: | :---: | :---: |
| `svgoConfig` | `{}` | [SVGO](https://github.com/svg/svgo) config |
| `defaultExport` | `url` | Default behavior when importing `.svg` files, possible options are: `url` , `component` and `raw` |
| `assetsDirName` | `icons` | Limit the svg icon in a folder |
| `enableBuildCache` | `true` | Whether to enable caching at build time |
| `enableMonochromeSvgOptimize` | `true` | Whether to enable **monochrome** svg icon optimize which can move child node (named **path**) 's `fill` and `stroke` attribute to its parent node (**svg** element). So that you can change the svg icon color with `fill` and `stroke`. |
| `enableSvgSizeResponsive` | `true` | Whether to enable svg icon responsive  |


## In Vue

```vue
<template>
  <div>
    <h2>svg component</h2>

    <!-- you can change the svg icon color with `fill` attribute when it's a monochrome icon -->
    <LogoSvg fill="red" />

    <!-- you can change the svg icon size with `font-size` or `width`. both of this will be responsive -->
    <LogoSvg font-size="48" />
    <LogoSvg width="48" />

    <h2>svg url</h2>

    <p>
      <img :src="logoSvgUrl" alt="" width="36" />
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LogoSvg from '@/icons/logo.svg?component'
import logoSvgUrl from '@/icons/logo.svg?url'

export default defineComponent({
  components: {
    LogoSvg,
  },
  setup() {
    return {
      logoSvgUrl,
    }
  },
})
</script>
```

# CHANGE LOG

see <a href="./CHANGELOG.md" target="_blank">CHANGE LOG</a>.

# Framework Support

- **Nuxt**: see <a href="https://github.com/yisibell/nuxt-svg-icons" target="_blank">nuxt-svg-icons</a>.
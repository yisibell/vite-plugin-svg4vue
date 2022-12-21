# vite-plugin-svg4vue

A vite plugin which can transform svg icon to vue component.

# Features

- [SVGO](https://github.com/svg/svgo) optimization.
- Hot Module Replacement support.
- Support for `?url` and `?component` query string.
- Support custom svg icon (monochrome) color with `fill` attribute, change svg icon size with `width` and `height` attribute.

# Installation

```bash
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

## Options

| property | Default value | Description |
| :---: | :---: | :---: |
| `svgoConfig` | `{}` | [SVGO](https://github.com/svg/svgo) config |
| `defaultExport` | `url` | Default behavior when importing `.svg` files, possible options are: `url` and `component` |
| `assetsDirName` | `icons` | Limit the svg icon in a folder |
| `enableBuildCache` | `true` | Whether to enable caching at build time |
| `enableMonochromeSvgOptimize` | `true` | Whether to enable monochrome svg icon optimize which can move `fill` attribute value to parent node (svg element). So that you can change the svg icon color with `fill`. |


## In Vue

```vue
<template>
  <div class="about">
    <div>
      <h1>This is an about page</h1>

      <h2>svg component</h2>

      <!-- you can change the svg icon color with `fill` attribute when it's a monochrome icon -->
      <LogoSvg width="36" height="36" fill="red" />

      <h2>svg url</h2>

      <p>
        <img :src="logoSvgUrl" alt="" width="36" />
      </p>
    </div>
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

If you are using TypeScript, **vite-plugin-svg4vue/client** can be added to d.ts declaration file.

``` ts
/// <reference types="vite-plugin-svg4vue/client" />
```
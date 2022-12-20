# vite-plugin-svg4vue

A vite plugin which could transform svg icon to vue component.

# Features

- [SVGO](https://github.com/svg/svgo) optimization
- Hot Module Replacement support
- Support for `?url` and `?component` query string

# Installation

```bash
# yarn
$ yarn add vite-plugin-svg4vue --dev

# npm
$ npm i vite-plugin-svg4vue -D
```

# Usage
## Setup

```js
// vite.config.js
const vue = require('@vitejs/plugin-vue');
const { svg4VuePlugin } = require('vite-plugin-svg4vue');

module.exports = {
  plugins: [
    vue(),
    svg4VuePlugin(),
  ],
};
```

## Options

| property | Default value | Description |
| :---: | :---: | :---: |
| `svgoConfig` | `{}` | [SVGO](https://github.com/svg/svgo) config |
| `defaultExport` | `url` | Default behavior when importing `.svg` files, possible options are: `url` and `component` |
| `assetsDirName` | `icons` | Limit the svg icon in a folder |


## In Vue

```vue
<template>
  <div>
    <MyIcon />

    <img :src="MyIcon2" alt="" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MyIcon from '@/icons/my-icon.svg?component'
import MyIcon2 from '@/icons/my-icon-2.svg?url'

export default defineComponent({
  components: {
    MyIcon,
  },
  setup() {
    return {
      MyIcon2
    }
  }
})
</script>
```

If you are using TypeScript, **vite-plugin-svg4vue/client** can be added to d.ts declaration file.

``` ts
/// <reference types="vite-plugin-svg4vue/client" />
```
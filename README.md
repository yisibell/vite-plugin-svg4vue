<p align="center">
  <a href="https://www.npmjs.org/package/vite-plugin-svg4vue">
    <img src="https://img.shields.io/npm/v/vite-plugin-svg4vue.svg">
  </a>
  <a href="https://npmcharts.com/compare/vite-plugin-svg4vue?minimal=true">
    <img src="https://img.shields.io/npm/dm/vite-plugin-svg4vue.svg">
  </a>
  <br>
</p>

# vite-plugin-svg4vue

A `vite (5.x || 6.x || 7.x || 8.x)` plugin which can transform `SVG` icon to `vue (2.7.X || 3.x)` component.

> this plugin dependencies on `vue/compiler-sfc`, so keep your `vue` version to **3.2.13+** or **2.7.14+**.

- [Example Here](https://hongwenqing.com/vite-plugin-svg4vue/).
- [Release Notes](./CHANGELOG.md).

# Features

- [SVGO](https://github.com/svg/svgo) optimization.
- Hot Module Replacement support.
- Support for `?url` , `?component` and `?raw` query string.
- Support custom svg icon (monochrome) color with `fill` , `fill-opacity` , `stroke` , `stroke-opacity` attribute.
- Support change svg icon size with `font-size` and it will be responsive.
- Support <a href="https://www.iconfont.cn/" target="_blank">Iconfont SVG Icons</a>.

# Installation

```bash
# pnpm
$ pnpm add vite-plugin-svg4vue -D

# yarn
$ yarn add vite-plugin-svg4vue --dev

# npm
$ npm i vite-plugin-svg4vue -D
```

# Development

The repository uses pnpm workspaces. The package is at the repository root and the Vue demo is the `example` workspace.

The root-level scripts are:

| Script | Description |
| :--- | :--- |
| `pnpm dev` | Watch and rebuild the `vite-plugin-svg4vue` package with Rollup while developing the plugin. |
| `pnpm dev:example` | Start the `example` Vite development server. |
| `pnpm build` | Build the plugin package and generate JavaScript and TypeScript declaration files in `lib/`. |
| `pnpm build:example` | Build the `example` app with Vite. This runs the production bundler only. |
| `pnpm build:all` | Build the plugin, then run the example's complete `build` script, including type checking and the production build. |
| `pnpm lint` | Check the root package with ESLint and `eslint-plugin-format` without changing files. |
| `pnpm lint:fix` | Check and automatically format/fix the root package. |
| `pnpm --filter example lint` | Check the `example` workspace with ESLint and `eslint-plugin-format`. |
| `pnpm --filter example lint:fix` | Check and automatically format/fix the `example` workspace. |
| `pnpm release` | Build the package, generate a changelog, publish it to npm, and push release tags. Use only when preparing a release. |

For example, run the demo in development mode from the repository root:

```bash
pnpm dev:example
```

This is equivalent to:

```bash
pnpm --filter example dev
```

You can also enter the workspace directory and run its scripts directly:

```bash
cd example
pnpm dev
pnpm build
```

To add a dependency to the demo, run this from the repository root:

```bash
pnpm --filter example add <package>
pnpm --filter example add -D <package>
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

## In Vue

```vue
<template>
  <div>
    <h2>SVG component: </h2>

    <!-- you can change the svg icon color with `fill` attribute when it's a monochrome icon -->
    <LogoSvg fill="red" />

    <!-- you can change the svg icon size with `font-size` or `width`. both of this will be responsive -->
    <LogoSvg font-size="48" />
    <LogoSvg width="48" />

    <h2>SVG url: </h2>

    <p>
      <img :src="logoSvgUrl" alt="" width="36" />
    </p>

    <h2>SVG raw: </h2>

    <p>
      <span v-html="logoSvgRaw"></span>
    </p>
  </div>
</template>

<script setup lang="ts">
import LogoSvg from '@/icons/logo.svg?component'
import logoSvgUrl from '@/icons/logo.svg?url'
import logoSvgRaw from '@/icons/logo.svg?raw'
</script>
```

## Skip SVGO for a single file (Added in v2.8.1)

**SVGO** can be explicitly disabled for one file by adding the `?skipsvgo` query string:

```vue
<template>
  <div class="d-flex align-center mb-16">
    <label class="mr-12"> ?component&skipsvgo: </label>
    <PPTSvg />
  </div>

  <div class="d-flex align-center">
    <label class="mr-12"> ?raw&skipsvgo: </label>
    <span v-html="PPTSvgRaw"></span>
  </div>
</template>

<script setup lang="ts">
import PPTSvg from '@/icons/ppt.svg?component&skipsvgo'
import PPTSvgRaw from '@/icons/ppt.svg?raw&skipsvgo'
</script>
```

## Typescript

If you are using TypeScript, **vite-plugin-svg4vue/client** can be added to `d.ts` declaration file.

``` ts
/// <reference types="vite-plugin-svg4vue/client" />
```

## Options

| Key | Default value | Description | Type |
| :---: | :---: | :---: | :---: |
| `svgoConfig` | `{}` | [SVGO](https://github.com/svg/svgo) config. if set to `false`, will disable **SVGO**. | `object/boolean` |
| `enableSvgoPresetDefaultConfig` | `true` | Whether to enable `preset-default` configuration for **SVGO** | `boolean` |
| `defaultExport` | `url` | Default behavior when importing `.svg` files, possible options are: `url` , `component` and `raw` | `string` |
| `assetsDirName` | `icons` | Restrict SVG to a specific folder. As long as the SVG is in the `assetsDirName` folder, it can be processed by this plugin, Even if the folder is nested, such as, `path/to/icons/*.svg`, `icons/path/to/svg/*.svg` , ` path/to/icons/path/to/*.svg` and so on. If set `assetsDirname` to `false` , will make it work with arbitrary file path. | `string/boolean` |
| `enableBuildCache` | `true` | Whether to enable caching at build time |  `boolean` |
| `enableMonochromeSvgOptimize` | `true` | Whether to enable **monochrome** svg icon optimize which can move child node (named **path**, Even the **path** wrapped by **g**) 's `fill`, `fill-opacity` and `stroke`, `stroke-opacity` attribute to its parent node (**svg** element). So that you can change the svg icon color with `fill` and `stroke`. | `boolean` |
| `enableSvgSizeResponsive` | `true` | Whether to enable svg icon responsive.  | `boolean` |
| `namespaceClassnames` | `true` | Whether to add a namespace for `class` selector.  | `boolean` |
| `namespaceIDs` | `true` | Whether to add a namespace for `ID` selector.  | `boolean` |
| `namespacePrefix` | `'a'` | Whether to add a namespace prefix string for selector.  | `string` |
| `enforce` | `'pre'` | Define this plugin invocation order. | `string` or `boolean` |


### What `enableSvgSizeResponsive` do ?

In fact, for the **svg** node, **vite-plugin-svg4vue** will set the `width` value to `font-size`, remove svg `height` and set `width` to `1em`, so that the **svg** size will be **responsive** and you can manipulate it's size with `font-size`.

Just in case, it records the **original size** of the **svg** as a **css variables**:

``` html
<svg style="--svg-origin-width: ${origin width}; --svg-origin-height: ${origin height};"></svg>
```

So, you can easily apply its original size.

```vue
<template>
  <LogoSvg fill="red" style="width: var(--svg-origin-width); height: var(--svg-origin-height)" />
</template>

<script setup lang="ts">
import LogoSvg from '@/icons/logo.svg?component'
</script>
```

# Framework Support

- **Nuxt**: see [nuxt-svg-icons](https://github.com/yisibell/nuxt-svg-icons).

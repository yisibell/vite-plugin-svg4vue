<template>
  <div id="container">
    <header class="mb-36">
      <h1>vite-plugin-svg4vue</h1>
      <p>
        A vite plugin which can transform svg icon to vue component. Support
        custom svg color and size.
      </p>

      <a
        class="button--primary mr-12"
        href="https://github.com/yisibell/vite-plugin-svg4vue"
        target="_blank"
      >
        <GithubIcon />
        GitHub
      </a>

      <a
        class="button--primary"
        href="https://github.com/yisibell/vite-plugin-svg4vue/blob/main/CHANGELOG.md"
        target="_blank"
      >
        <ChangeLogIcon />
        ChangeLog
      </a>

      <h2>Usage</h2>

      <h3>Installation</h3>
      <pre class="language-bash"><code>{{ installDemoCode }}</code></pre>

      <h3>Setup</h3>

      <h4>
        1. Config into the <code class="inline-code">vite.config.ts</code>.
      </h4>

      <pre
        class="language-js"
      > <code v-html="setupPluginCodeHtml"></code> </pre>

      <h4>
        2. Create a folder named <code class="inline-code">icons</code> to place
        your svg icons.
      </h4>
    </header>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { highlight, languages } from 'prismjs'

import installDemoCode from '@/assets/demo/installCode.bash?raw'
import setupPluginCode from '@/assets/demo/setupPluginCode.ts?raw'

import GithubIcon from '@/icons/github.svg?component'
import ChangeLogIcon from '@/icons/changelog.svg?component'

const setupPluginCodeHtml = highlight(
  setupPluginCode,
  languages.javascript,
  'javascript'
)
</script>

<style lang="scss" scoped>
header {
  p {
    font-size: 18px;
    padding: 12px 0;
  }
}
</style>

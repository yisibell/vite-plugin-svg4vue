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

      <pre><code class="language-js" v-html="setupPluginCodeHtml"></code></pre>

      <h4>
        2. Create a folder named <code class="inline-code">icons</code> to place
        your svg icons, and you can change the dir via
        <PluginConfigLink text="assetsDirName" /> .
      </h4>

      <h4>
        3. All configuration items can be found here <PluginConfigLink /> .
      </h4>

      <h4>
        4. If you are using TypeScript,
        <code class="inline-code">vite-plugin-svg4vue/client</code> can be added
        to <code>d.ts</code> declaration file.
      </h4>

      <pre><code class="language-js" v-html="ClientDtsRawHtml"></code></pre>
    </header>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { highlight, languages } from 'prismjs'

import PluginConfigLink from '@/components/PluginConfigLink.vue'

import installDemoCode from '@/assets/demo/installCode.bash?raw'
import setupPluginCode from '@/assets/demo/setupPluginCode.ts?raw'

import GithubIcon from '@/icons/github.svg?component'
import ChangeLogIcon from '@/icons/changelog.svg?component'

import ClientDtsRaw from '@/assets/demo/client.d.ts?raw'

const setupPluginCodeHtml = highlight(
  setupPluginCode,
  languages.javascript,
  'javascript'
)

const ClientDtsRawHtml = highlight(
  ClientDtsRaw,
  languages.javascript,
  'javascript'
)
</script>

<style lang="scss" scoped>
header {
  h4 {
    line-height: 36px;
  }
  p {
    font-size: 18px;
    padding: 12px 0;
  }
}
</style>

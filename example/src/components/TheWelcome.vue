<template>
  <WelcomeItem>
    <template #icon>
      <OptimizeIcon font-size="24" />
    </template>

    <template #heading>SVGO Optimization</template>

    the <b class="green">vite-plugin-svg4vue</b> use

    <a href="https://github.com/svg/svgo" target="_blank" rel="noopener">
      SVGO
    </a>

    optimize your svg icons. and you aslo can custom <b class="green">SVGO</b>'s
    config via

    <PluginConfigLink> svgoConfig </PluginConfigLink>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <HmrIcon font-size="24" />
    </template>
    <template #heading>HMR</template>

    Hot Module Replacement support.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CategoryIcon font-size="24" />
    </template>
    <template #heading>Query String Support</template>

    <div class="mb-12">
      Support for
      <code class="inline-code">?url</code>
      and <code class="inline-code">?component</code> query string.
    </div>

    <h3 class="py-10">1. with <code>?component</code></h3>
    <pre
      class="language-markup"
    ><code>{{ UseWithComponentDemoCode }}</code></pre>
    <b class="mr-10">result:</b> <UseWithComponentDemo />

    <h3 class="py-10">2. with <code>?url</code></h3>
    <pre class="language-markup"><code>{{ UseWithUrlDemoCode }}</code></pre>
    <b class="mr-10">result:</b> <UseWithUrlDemo />

    <h3 class="py-10">3. with <code>?raw</code></h3>
    <pre class="language-markup"><code>{{ UseWithRawDemoCode }}</code></pre>
    <b class="mr-10">result:</b> <UseWithRawDemo />
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ColorIcon font-size="24" />
    </template>
    <template #heading>Custom Color </template>

    <div>
      Support custom svg icon (monochrome) color with
      <code class="inline-code">fill</code> attribute.
    </div>

    <pre class="language-markup"><code>{{ UseFillDemoCode }}</code></pre>

    <b class="mr-10">result:</b> <UseFillDemo />
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SizeIcon font-size="24" />
    </template>
    <template #heading>Custom Size</template>

    <div>
      You can change the svg icon size with
      <code class="inline-code">font-size</code> or
      <code class="inline-code">width</code>. both of this will be responsive.
    </div>

    <pre class="language-markup"><code>{{ UseFontSizeDemoCode }}</code></pre>

    <b class="mr-10">result:</b> <UseFontSizeDemo />
  </WelcomeItem>
</template>

<script setup lang="ts">
import PluginConfigLink from './PluginConfigLink.vue'
import WelcomeItem from './WelcomeItem.vue'
import OptimizeIcon from '@/icons/optimize.svg?component'
import HmrIcon from '@/icons/hmr.svg?component'
import CategoryIcon from '@/icons/category.svg?component'
import ColorIcon from '@/icons/color.svg?component'
import SizeIcon from '@/icons/size.svg?component'

import UseWithComponentDemo from '@/assets/demo/useWithComponent.vue'
import UseWithComponentDemoCode from '@/assets/demo/useWithComponent.vue?raw'

import UseWithUrlDemo from '@/assets/demo/useWithUrl.vue'
import UseWithUrlDemoCode from '@/assets/demo/useWithUrl.vue?raw'

import UseWithRawDemo from '@/assets/demo/UseWithRaw.vue'
import UseWithRawDemoCode from '@/assets/demo/UseWithRaw.vue?raw'

import UseFillDemo from '@/assets/demo/useFill.vue'
import UseFillDemoCode from '@/assets/demo/useFill.vue?raw'

import UseFontSizeDemo from '@/assets/demo/UseFontSize.vue'
import UseFontSizeDemoCode from '@/assets/demo/UseFontSize.vue?raw'
</script>

<template>
  <div class="">
    <FeatureSection>
      <template #title> <code>with glob of vite</code> </template>

      <template #sub-title>
        <div>
          Supports importing multiple modules from the file system via the
          special
          <code class="lang-js">import.meta.glob</code>
          function:
        </div>
      </template>

      <template #demo>
        <DemoCode />
      </template>

      <template #code>
        {{ DemoCodeRaw }}
      </template>
    </FeatureSection>
  </div>
</template>

<script lang="ts" setup>
import FeatureSection from '@/components/FeatureSection.vue'
import DemoCode from './DemoCode.vue'
import DemoCodeRaw from './DemoCode.vue?raw'
</script>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'UrlQueryString',
})
</script>

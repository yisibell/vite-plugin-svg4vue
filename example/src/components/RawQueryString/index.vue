<template>
  <div class="">
    <FeatureSection :reverse="false">
      <template #title> <code>with ?raw</code> </template>

      <template #sub-title>
        You can import SVG as a raw text via
        <code>?raw</code> query string, and then you can render the SVG with
        <code>v-html</code>.
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
  name: 'RawQueryString',
})
</script>

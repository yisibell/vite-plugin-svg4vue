<template>
  <div class="">
    <FeatureSection>
      <template #title> <code>with ?component</code> </template>

      <template #sub-title>
        You can import SVG as a Vue component via <code>?component</code> query
        string.
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
  name: 'ComponentQueryString',
})
</script>

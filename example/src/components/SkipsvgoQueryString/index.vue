<template>
  <div class="">
    <FeatureSection>
      <template #title> Skip SVGO for a single file </template>

      <template #sub-title>
        SVGO can be explicitly disabled for one file by adding the
        <code>?skipsvgo</code> query string.
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
  name: 'SkipsvgoQueryString',
})
</script>

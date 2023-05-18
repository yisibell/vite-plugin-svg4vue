<template>
  <div class="">
    <FeatureSection>
      <template #title> <code>Maintenance colors</code> </template>

      <template #sub-title>
        Support maintenance SVG icon (monochrome) color via
        <code>fill</code> and <code>stroke</code> attribute.
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
  name: 'MaintenanceColors',
})
</script>

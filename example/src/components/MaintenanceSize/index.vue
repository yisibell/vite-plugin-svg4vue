<template>
  <div class="">
    <FeatureSection>
      <template #title> <code>Maintenance of size</code> </template>

      <template #sub-title>
        You can change the SVG icon <b>size</b> with <code>font-size</code> or
        <code>width</code>, both of this will be responsive.
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
  name: 'MaintenanceSize',
})
</script>

<template>
  <div class="">
    <FeatureSection>
      <template #title> Optimize the class and id selectors so that they are unique </template>

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
  name: 'ClassAndIdNamespace',
})
</script>

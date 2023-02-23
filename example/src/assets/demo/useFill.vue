<template>
  <div class="mb-20">
    <div class="d-flex align-center">
      <label class="mr-12">
        Select a color:
        <input type="color" v-model="color" />
      </label>

      <PptSvg :fill="color" />
    </div>

    <div class="d-flex align-center">
      <label class="mr-12">
        Select a color:
        <input type="color" v-model="color2" />
      </label>

      <!-- Just in case, it records the original size of the svg as a css variable. So, you can easily apply its original size -->
      <PathInGFillMonochromeSvg
        :fill="color2"
        style="width: var(--svg-origin-width); height: var(--svg-origin-height)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PptSvg from '@/icons/ppt.svg?component'
import PathInGFillMonochromeSvg from '@/icons/path-in-g-fill-monochrome.svg?component'
import { ref } from 'vue'

const color = ref('#000000')
const color2 = ref('#586B4B')
</script>

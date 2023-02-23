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
      <PathInGFillMonochromeSvg :fill="color2" width="533" height="531" />
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

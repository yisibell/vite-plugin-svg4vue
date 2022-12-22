<template>
  <div class="d-flex align-center">
    <label class="mr-12">
      Select a color:
      <input type="color" v-model="color" />
    </label>

    <PptSvg :fill="color" />
  </div>
</template>

<script setup lang="ts">
import PptSvg from '@/icons/ppt.svg?component'
import { ref } from 'vue'

const color = ref('#000000')
</script>

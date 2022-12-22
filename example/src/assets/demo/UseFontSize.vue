<template>
  <div class="d-flex align-center mb-16">
    <label class="mr-12">
      font-size(any CSS unit):
      <input type="number" min="0" v-model="size" />
    </label>
    <WordSvg :font-size="size" />
  </div>

  <div class="d-flex align-center">
    <label class="mr-12">
      width(any CSS unit):
      <input type="number" min="0" v-model="width" />
    </label>
    <WordSvg :width="width" />
  </div>
</template>

<script setup lang="ts">
import WordSvg from '@/icons/word.svg?component'
import { ref } from 'vue'

const size = ref('40')
const width = ref('40')
</script>
